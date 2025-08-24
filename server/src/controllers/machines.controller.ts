import { Request, Response } from "express";
import { MachineModel } from "../models/machine.model";
import { Parser } from "json2csv";

export async function listMachines(req: Request, res: Response) {
    const platformFilter = req.query.platform as string | undefined;
    const issue = req.query.issue as string | undefined;

    let machines = await MachineModel.find({}).sort({ lastSeen: -1 }).lean();

    if (platformFilter) {
        machines = machines.filter((m) => (m.platform || "").toLowerCase() === platformFilter.toLowerCase());
    }

    if (issue) {
        machines = machines.filter((m) => {
            const r = m.latestReport || {};
            switch (issue) {
                case "unencrypted":
                    return r.disk_encryption && r.disk_encryption.status === "not_encrypted";
                case "outdated":
                    return r.os_updates && r.os_updates.status === "updates_available";
                case "antivirus_missing":
                    return !r.antivirus || r.antivirus.status === "not_found";
                case "sleep_noncompliant":
                    return r.sleep_settings && (r.sleep_settings.compliant === false || r.sleep_settings.timeout_minutes === "never");
                default:
                    return false;
            }
        });
    }

    return res.json({ ok: true, count: machines.length, data: machines });
}

export async function getMachine(req: Request, res: Response) {
    const id = req.params.id;
    const m = await MachineModel.findOne({ machineId: id }).lean();
    if (!m) return res.status(404).json({ error: "not_found" });
    return res.json({ ok: true, data: m });
}

export async function exportCsv(req: Request, res: Response) {
    const machines = await MachineModel.find({}).lean();
    const rows = machines.map((m) => ({
        machineId: m.machineId,
        platform: m.platform,
        hostname: m.hostname || "",
        lastSeen: m.lastSeen?.toISOString() ?? "",
        disk_encryption: m.latestReport?.disk_encryption?.status ?? "",
        os_updates: m.latestReport?.os_updates?.status ?? "",
        antivirus: m.latestReport?.antivirus?.status ?? "",
        sleep_settings: typeof m.latestReport?.sleep_settings?.timeout_minutes !== "undefined"
            ? String(m.latestReport.sleep_settings.timeout_minutes)
            : "",
    }));

    const parser = new Parser();
    const csv = parser.parse(rows);
    res.header("Content-Type", "text/csv");
    res.attachment("machines.csv");
    res.send(csv);
}

import { Request, Response } from "express";
import { ReportSchema, ReportInput } from "../schemas/report.schema";
import { ReportModel } from "../models/report.model";
import { MachineModel } from "../models/machine.model";

export async function postReport(req: Request, res: Response) {
    // validate
    const parsed = ReportSchema.safeParse(req.body);
    console.log("Incoming report:", req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "invalid_payload", details: parsed.error.format() });
    }
    const data = parsed.data as ReportInput;

    const timestamp = new Date(data.timestamp);

    const reportDoc = await ReportModel.create({
        machineId: data.machine_id,
        timestamp,
        payload: data,
    });

    await MachineModel.findOneAndUpdate(
        { machineId: data.machine_id },
        {
            machineId: data.machine_id,
            platform: data.platform,
            hostname: data.hostname,
            lastSeen: timestamp,
            latestReport: data,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({ ok: true, id: reportDoc._id });
}

export async function listReports(req: Request, res: Response) {
    const page = Math.max(0, Number(req.query.page || 0));
    const limit = Math.min(100, Number(req.query.limit || 50));
    const q: any = {};
    if (req.query.machineId) q.machineId = req.query.machineId;
    const reports = await ReportModel.find(q).sort({ timestamp: -1 }).skip(page * limit).limit(limit).lean();
    return res.json({ ok: true, data: reports });
}

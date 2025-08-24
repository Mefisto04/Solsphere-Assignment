import type { Machine } from "../types/api";

export type HealthStatus = "ok" | "issue" | "unknown";

export function computeHealth(m: Machine): HealthStatus {
    const r = m.latestReport;
    if (!r) return "unknown";

    const diskBad = "not_encrypted" === r.disk_encryption?.status;
    const updateBad = "updates_available" === r.os_updates?.status;
    const avBad = "not_found" === r.antivirus?.status;
    const sleepBad = r.sleep_settings?.compliant === false;

    if (diskBad || updateBad || avBad || sleepBad) return "issue";

    const allKnownGood =
        ["encrypted", "up_to_date", "found", "configured"].includes(r.disk_encryption?.status as string) &&
        ["up_to_date"].includes(r.os_updates?.status as string) &&
        ["found"].includes(r.antivirus?.status as string) &&
        (r.sleep_settings?.compliant ?? true);

    return allKnownGood ? "ok" : "unknown";
}

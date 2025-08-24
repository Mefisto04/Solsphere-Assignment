export type CheckStatus =
    | { status: "encrypted" | "up_to_date" | "found" | "configured";[k: string]: unknown }
    | { status: "not_encrypted" | "updates_available" | "not_found" | "unknown";[k: string]: unknown };

export type LatestReport = {
    machine_id: string;
    timestamp: string;
    platform: "windows" | "linux" | "darwin" | string;
    hostname: string;
    disk_encryption: CheckStatus;
    os_updates: CheckStatus;
    antivirus: CheckStatus;
    sleep_settings: CheckStatus & { compliant?: boolean };
};

export type Machine = {
    _id: string;
    machineId: string;
    platform: LatestReport["platform"];
    hostname: string;
    lastSeen: string;
    latestReport: LatestReport;
};

export type MachinesResponse = { ok: boolean; data: Machine[]; total?: number };

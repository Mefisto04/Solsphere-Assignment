import { z } from "zod";

const DiskEncryptionSchema = z.object({
    status: z.string(),
    detail: z.string().optional(),
    reason: z.string().optional(),
    raw: z.any().optional(),
});

const OsUpdatesSchema = z.object({
    status: z.string(),
    pending: z.number().optional(),
    raw: z.any().optional(),
    error: z.string().optional(),
});

const AntivirusSchema = z.object({
    status: z.string(),
    products: z.array(z.string()).optional(),
    active_services: z.array(z.string()).optional(),
    raw: z.any().optional(),
});

const SleepSchema = z.object({
    status: z.string(),
    timeout_minutes: z.union([z.number(), z.string()]).optional(),
    compliant: z.boolean().optional(),
    raw: z.any().optional(),
});

export const ReportSchema = z.object({
    machine_id: z.string().min(5),
    timestamp: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "invalid timestamp" }),
    platform: z.string().min(1),
    hostname: z.string().optional(),
    disk_encryption: DiskEncryptionSchema.optional(),
    os_updates: OsUpdatesSchema.optional(),
    antivirus: AntivirusSchema.optional(),
    sleep_settings: SleepSchema.optional(),
});

export type ReportInput = z.infer<typeof ReportSchema>;


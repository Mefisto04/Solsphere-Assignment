import mongoose, { Schema, Document } from "mongoose";

export interface IMachine extends Document {
    machineId: string;
    platform: string;
    hostname?: string;
    lastSeen: Date;
    latestReport: any; 
}

const LatestReportSchema = new Schema(
    {
        timestamp: { type: Date },
        data: { type: Schema.Types.Mixed },
    },
    { _id: false }
);

const MachineSchema = new Schema<IMachine>(
    {
        machineId: { type: String, required: true, index: true, unique: true },
        platform: { type: String, required: true },
        hostname: { type: String },
        lastSeen: { type: Date, required: true, default: Date.now },
        latestReport: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

export const MachineModel = mongoose.model<IMachine>("Machine", MachineSchema);

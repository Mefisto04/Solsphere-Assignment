import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
    machineId: string;
    timestamp: Date;
    payload: any;
}

const ReportSchema = new Schema<IReport>({
    machineId: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

export const ReportModel = mongoose.model<IReport>("Report", ReportSchema);

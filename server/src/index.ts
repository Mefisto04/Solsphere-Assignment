import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import "express-async-errors";
import { connectDb } from "./db";
import authRouter from "./routes/auth";
import reportsRouter from "./routes/reports";
import machinesRouter from "./routes/machines";

dotenv.config();

const PORT = process.env.PORT ?? 4000;

async function start() {
    await connectDb();

    const app = express();
    app.use(helmet());
    app.use(cors());
    app.use(express.json({ limit: "1mb" }));
    app.use(morgan("combined"));

    app.use("/api/auth", authRouter);
    app.use("/api/reports", reportsRouter);
    app.use("/api/machines", machinesRouter);

    // health
    app.get("/health", (_req: express.Request, res: express.Response) => res.json({ ok: true, ts: new Date().toISOString() }));

    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        console.error(err);
        res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
    });

    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
}

start().catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
});

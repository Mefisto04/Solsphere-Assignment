import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "solsphere-secret-key-2024";

export interface AuthRequest extends Request {
    user?: {
        sub: string;
        role: string;
        exp: number;
    };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            sub: string;
            role: string;
            exp: number;
        };

        // Check if token is expired
        if (decoded.exp < Math.floor(Date.now() / 1000)) {
            return res.status(401).json({ error: "Token expired" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

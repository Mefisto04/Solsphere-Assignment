import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();

const ADMIN_CREDENTIALS = {
    email: "admin@solsphere.com",
    password: "admin123"
};


const JWT_SECRET = "solsphere-secret-key-2024";

router.post("/login", (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Generate JWT token
        const token = jwt.sign(
            {
                sub: email,
                role: "admin",
                exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
            },
            JWT_SECRET
        );

        res.json({
            token,
            user: {
                email: ADMIN_CREDENTIALS.email,
                role: "admin"
            }
        });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

export default router;

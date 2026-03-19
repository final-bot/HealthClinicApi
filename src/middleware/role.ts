import { Request, Response, NextFunction } from "express";

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.header("x-role");

    if (userRole !== role) {
      return res.status(403).json({ message: "Forbidden. Only administrators can perform this action." });
    }

    next();
  };
}
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log(token)
  if (!token) {
    res.status(401).json({ message: "Вы не авторизованны" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.body.user = decoded;
    next();
  } catch (error) {
    console.log(error)
    res.status(403).json({ message: "Неправильный токен" });
  }
};

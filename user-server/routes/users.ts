import express, { Request, Response } from "express";
import knex from "knex";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRoutes = express.Router();
const knex1 = knex(require('../knexfile.js').development);

const generateTokens = (login: string) => {
  const accessToken = jwt.sign({ "login": login }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  const refreshToken = jwt.sign({ "login": login }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

let refreshTokens: string[] = [];

userRoutes.post('/register', async (req: Request, res: Response) => {
  const { login, password, email } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    knex1('users')
      .where({"login": login})
      .select("login")
      .then(async (users) => {
        if (users.length > 0) return res.status(404).json({ message: "Пользователь с таким логином уже существует" }); 
        knex1('users')
          .insert({"login": login, "password": hashedPassword, "email": email})
          .then(() => {
            const {accessToken, refreshToken} = generateTokens(login);
            refreshTokens.push(refreshToken); 
    
            res.cookie("accessToken", accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 60 * 60 * 1000,
            });

            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({ message: "Регистрация прошла успешно" });
          })
      })
  } catch (err) {
    res.status(500).json({ message: "Ошибка в регистрации пользователя: " + err });
  }
});

userRoutes.post('/login', async (req: Request, res: Response) => {
  const { login, password } = req.body;
  knex1('users')
    .where({"login": login})
    .then(async (user) => {
      if (user.length == 0) return res.status(404).json({ message: "Неверный логин" });
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });

      const {accessToken, refreshToken} = generateTokens(login);
      refreshTokens.push(refreshToken); 

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ message: "Авторизация прошла успешно" })
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Ошибка авторизации пользователя: " + err });
    })
});


userRoutes.post('/refresh', (req: Request, res: Response): void => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401).json({ message: "Вы не авторизованы" });
    return;
  }

  if (!refreshTokens.includes(token)) {
    res.status(403).json({ message: "Неверный токен" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { login: string };
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.login);

    refreshTokens = refreshTokens.filter(t => t !== token);
    refreshTokens.push(newRefreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "" });
  } catch (err) {
    res.status(403).json({ message: "Неправильный refresh-токен" });
  }
});

userRoutes.post('/logout', authMiddleware, (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  refreshTokens = refreshTokens.filter(t => t !== req.cookies.refreshToken);
  res.json({ message: "Выход" });
});

userRoutes.get('/get_user', authMiddleware, async (req: Request, res: Response) => {
  const { login } = req.body.user;
  knex1('users')
    .select("login", "email")
    .where({"login": login})
    .then((user) => {
      if (user.length == 0) return res.status(404).json({ message: "Нет такого пользователя" });
      
      res.status(200).json({ user: user[0] });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Ошибка получения пользователя: " + err });
    })
});

userRoutes.get('/get_login', authMiddleware, (req: Request, res: Response) => {
  const login = req.body.user.login
  res.status(200).json({ "login": login });
});

export default userRoutes;
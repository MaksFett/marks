import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { IUser } from "../types";
import jwt from "jsonwebtoken";
import { knex1 } from "../services/db_service";
import { generateTokens } from "../utils/tokenUtil";

let refreshTokens: string[] = [];

export async function register(req: Request, res: Response) {
    const { login, password, email } = req.body;
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      knex1('users')
        .where({"login": login})
        .select("login")
        .then(async (users: Array<IUser>) => {
          if (users.length > 0) return res.status(404).json({ message: "Пользователь с таким логином уже существует" }); 
          knex1('users')
            .insert({"login": login, "password": hashedPassword, "email": email})
            .then(() => {
              const {accessToken, refreshToken} = generateTokens(login);
              refreshTokens.push(refreshToken); 
  
              res.status(200).json({ "accessToken": accessToken, "refreshToken": refreshToken });
            })
        })
    } catch (err) {
      res.status(500).json({ message: "Ошибка в регистрации пользователя: " + err });
    }
}

export async function login(req: Request, res: Response) {
    const { login, password } = req.body;
    knex1('users')
      .where({"login": login})
      .then(async (user) => {
        if (user.length == 0) return res.status(404).json({ message: "Неверный логин" });
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });
  
        const {accessToken, refreshToken} = generateTokens(login);
        refreshTokens.push(refreshToken); 
        res.status(200).json({ "accessToken": accessToken, "refreshToken": refreshToken });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Ошибка авторизации пользователя: " + err });
      })
}

export async function refresh(req: Request, res: Response) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Вы не авторизованы" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { login: string };
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.login);

    refreshTokens = refreshTokens.filter(t => t !== token);
    refreshTokens.push(newRefreshToken);

    res.status(200).json({ "accessToken": accessToken, "refreshToken": newRefreshToken });
  } catch (err) {
    res.status(403).json({ message: "Неправильный refresh-токен" });
  }
}

export async function logout(req: Request, res: Response) {
  refreshTokens = refreshTokens.filter(t => t !== req.cookies.refreshToken);
  res.json({ message: "Выход" });
}

export async function getUser(req: Request, res: Response) {
  const { login } = req.body.user;
  knex1('users')
    .select("login", "email")
    .where({"login": login})
    .then((user) => {
      if (user.length == 0) return res.status(404).json({ message: "Нет такого пользователя" });
      
      res.status(200).json(user[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Ошибка получения пользователя: " + err });
    })
}

export async function getLogin(req: Request, res: Response) {
  const login = req.body.user.login
  res.status(200).json({ "login": login });
}
import jwt from "jsonwebtoken";

export const generateTokens = (login: string) => {
  const accessToken = jwt.sign({ "login": login }, process.env.JWT_SECRET!, { expiresIn: "5m" });

  const refreshToken = jwt.sign({ "login": login }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};
import { Response } from "express";

export const setAuthCookie = (
  res: Response,
  token: string
) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookie = (
  res: Response
) => {
  res.clearCookie("token");
};

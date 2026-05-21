import dotenv from "dotenv"
dotenv.config();
export const PORT = process.env.PORT || 3001
export const JWT_SECRET = process.env.JWT_SECRET
export const COOKIE_NAME = process.env.COOKIE_NAME
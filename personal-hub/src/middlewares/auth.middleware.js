import { verifyToken } from "../utils/token.js"
import { AppError } from "../utils/AppError.js"

export const authMiddleware = (
  req,
  res,
  next
) => {
  const authHeader =
    req.headers.authorization
  if (!authHeader) {
    throw new AppError(
      "Unauthorized",
      401
    )
  }

  const token =
    authHeader.split(" ")[1]
  if (!token) {
    throw new AppError(
      "Unauthorized",
      401
    )
  }
  const decoded =
    verifyToken(token)
  req.user = decoded
  next()
}
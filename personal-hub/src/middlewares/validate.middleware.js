import { AppError } from "../utils/AppError.js"
export const validateRegister = ( req, res, next ) => {
  const { username, password } =
    req.body
  if (!username || !password) {
    throw new AppError(
      "Username and password are required",
      400
    )
  }
  next()
}
export const validateNote = ( req, res, next ) => {
  const { title, content } =
    req.body
  if (!title || !content) {
    throw new AppError(
      "Title and content are required",
      400
    )
  }
  next()
}
export const validateBook = ( req, res, next ) => {
  const { title, author } =
    req.body

  if (!title || !author) {
    throw new AppError(
      "Title and author are required",
      400
    )
  }
  next();
}
export const validateHabit = ( req, res, next ) => {
  const { title } = req.body
  if (!title) {
    throw new AppError(
      "Title is required",
      400
    )
  }
  next()
}
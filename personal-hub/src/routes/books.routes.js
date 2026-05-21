import express from "express"
import {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook} from "../controllers/books.controller.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()
router.get(
  "/",
  authMiddleware,
  asyncHandler(getAllBooks)
)

router.get(
  "/:id",
  authMiddleware,
  asyncHandler(getBook)
)

router.post(
  "/",
  authMiddleware,
  asyncHandler(createBook)
)

router.patch(
  "/:id",
  authMiddleware,
  asyncHandler(updateBook)
)

router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(deleteBook)
)

export default router
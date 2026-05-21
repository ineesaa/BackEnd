import express from "express"
import {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
} from "../controllers/notes.controller.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { validateNote } from "../middlewares/validate.middleware.js"

const router = express.Router()
router.get(
  "/",
  authMiddleware,
  asyncHandler(getAllNotes)
)

router.get(
  "/:id",
  authMiddleware,
  asyncHandler(getNote)
)

router.post(
  "/",
  authMiddleware,
  validateNote,
  asyncHandler(createNote)
)

router.patch(
  "/:id",
  authMiddleware,
  asyncHandler(updateNote)
)

router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(deleteNote)
)

export default router
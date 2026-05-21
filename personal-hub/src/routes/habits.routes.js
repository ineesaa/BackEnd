import express from "express"
import {
  getAllHabits,
  getHabit,
  createHabit,
  updateHabit,
  checkHabit,
  deleteHabit } from "../controllers/habits.controller.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get(
  "/",
  authMiddleware,
  asyncHandler(getAllHabits)
)

router.get(
  "/:id",
  authMiddleware,
  asyncHandler(getHabit)
)

router.post(
  "/",
  authMiddleware,
  asyncHandler(createHabit)
)

router.patch(
  "/:id",
  authMiddleware,
  asyncHandler(updateHabit)
)

router.patch(
  "/:id/check-in",
  authMiddleware,
  asyncHandler(checkHabit)
)

router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(deleteHabit)
)

export default router
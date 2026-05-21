import express from "express"
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser
} from "../controllers/auth.controller.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import {
  validateRegister
} from "../middlewares/validate.middleware.js"
const router = express.Router()


router.post(
  "/register",
  validateRegister,
  asyncHandler(registerUser)
)

router.post(
  "/login",
  validateRegister,
  asyncHandler(loginUser)
)

router.get(
  "/me",
  authMiddleware,
  asyncHandler(getMe)
)

router.post(
  "/logout",
  authMiddleware,
  asyncHandler(logoutUser)
)

export default router
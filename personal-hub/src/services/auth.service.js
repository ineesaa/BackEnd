import {createUser,getUserById,getUserByUsername } from "../models/user.model.js"
import { hashPassword, verifyPassword } from "../utils/hash.js"
import { signToken } from "../utils/token.js"
import { generateId } from "../utils/id.js"
import { AppError } from "../utils/AppError.js"
  
  export const register = async (username, password) => {
    const existingUser = await getUserByUsername(username);
  
    if (existingUser) {
      throw new AppError("Username already taken", 409);
    }
    const passwordHash = await hashPassword(password)
    const newUser = {
      id: generateId("u"),
      username,
      passwordHash,
      createdAt: new Date().toISOString(),
    }
    await createUser(newUser)
    return {
      id: newUser.id,
      username: newUser.username,
    }
  }
  export const login = async (username, password) => {
    const user = await getUserByUsername(username);
  
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }
    const isValidPassword = await verifyPassword(
      password,
      user.passwordHash
    );
  
    if (!isValidPassword) {
      throw new AppError("Invalid credentials", 401);
    }
  
    const token = signToken({
      id: user.id,
      username: user.username,
    })
  
    return {
      token, user: {id: user.id, username: user.username}
    }
  }
  export const getCurrentUser = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return {
      id: user.id,
      username: user.username,
    }
  }
  
  export const logout = async () => {
    return { message: "Logged out" };
  }
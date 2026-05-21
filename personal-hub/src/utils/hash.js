import bcrypt from "bcryptjs";

export const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, 10)
}
export const verifyPassword = async (
  plainPassword,
  hashedPassword) => {
  return await bcrypt.compare(
    plainPassword,
    hashedPassword)
}
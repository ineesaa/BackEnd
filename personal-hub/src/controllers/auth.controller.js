import {
    register,
    login,
    getCurrentUser,
    logout
  } from "../services/auth.service.js"
  export const registerUser = async (req, res) => {
    const { username, password } = req.body

    const user = await register( username,password )
    res.status(201).json(user)
  }
  export const loginUser = async (req, res) => {
    const { username, password } = req.body
    const data = await login( username, password )
    res.json(data)
  }
  export const getMe = async (req, res) => {
    const user = await getCurrentUser(
      req.user.id
    )
    res.json(user)
  }
  export const logoutUser = async ( req, res ) => {
    const data = await logout();
  
    res.json(data)
  };
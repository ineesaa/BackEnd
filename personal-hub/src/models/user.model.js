import { readJson, writeJson } from "../utils/fileDb.js";

export const getAllUsers = async () => {
   const users = await readJson("users.json");

   return users;
}

export const getUserById = async (id) => {
    const users = await readJson("users.json")
    const user = users.find((user) => user.id === id)
    return user;
}

export const createUser = async (newUser) => {
    const users = await readJson("users.json")
    users.push(newUser)
    await writeJson("users.json", users)
    return newUser
}

export const getUserByUsername = async (username) => {
    const users = await readJson("users.json");
  
    const user = users.find(
      (user) => user.username === username
    );
  
    return user;
  };

export const updateUser = async (id, updates) => {
    const users = await readJson("users.json")
    const index = users.findIndex((user) => user.id === id)
    const updatedUser = {
        ...users[index],
        ...updates
    }
    users[index] = updatedUser
    await writeJson("users.json", users)
    return updatedUser
}

export const deleteUser = async(id) => {
    const users = await readJson("users.json")
    const filteredUsers = users.filter((user) => user.id !== id)
    await writeJson("users.json", filteredUsers)
    return true;
}
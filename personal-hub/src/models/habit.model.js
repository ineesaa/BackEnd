import { readJson, writeJson } from "../utils/fileDb.js";

export const getAllHabits = async () => {
   const habits = await readJson("habits.json");

   return habits;
}

export const getHabitById = async (id) => {
    const habits = await readJson("habits.json")
    const habit = habits.find((habit) => habit.id === id  )
    return habit;
}

export const createHabit = async (newHabit) => {
    const habits = await readJson("habits.json")
    habits.push(newHabit)
    await writeJson("habits.json", habits)
    return newHabit
}

export const updateHabit = async (id, updates) => {
    const habits = await readJson("habits.json")
    const index = habits.findIndex((habit) => habit.id === id)
    const updatedHabit = {
        ...habits[index],
        ...updates
    }
    habits[index] = updatedHabit
    await writeJson("habits.json", habits)
    return updatedHabit
}

export const deleteHabit = async(id) => {
    const habits = await readJson("habits.json")
    const filteredHabits = habits.filter((habit) => habit.id !== id)
    await writeJson("habits.json", filteredHabits)
    return true;
}
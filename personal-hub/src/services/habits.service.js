import {
    getAllHabits,
    getHabitById,
    createHabit,
    updateHabit,
    deleteHabit,
  } from "../models/habit.model.js";
  import { generateId } from "../utils/id.js";
  import { AppError } from "../utils/AppError.js";
  export const getHabits = async () => {
    return await getAllHabits();
  }
  
  export const getSingleHabit = async (id) => {
    const habit = await getHabitById(id);
  
    if (!habit) {
      throw new AppError("Habit not found", 404);
    }
  
    return habit
  }
  
  export const createNewHabit = async (
    habitData
  ) => {
    const newHabit = {
      id: generateId("h"),
      checkIns: 0,
      ...habitData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  
    return await createHabit(newHabit);
  }
  
  export const updateSingleHabit = async (
    id,
    updates
  ) => {
    const existingHabit =
      await getHabitById(id)
  
    if (!existingHabit) {
      throw new AppError("Habit not found", 404)
    }
  
    return await updateHabit(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  }
  
  export const checkInHabit = async (id) => {
    const habit = await getHabitById(id)
    if (!habit) {
      throw new AppError("Habit not found", 404);
    }
    return await updateHabit(id, {
      checkIns: habit.checkIns + 1,
      updatedAt: new Date().toISOString(),
    })
  }
  
  export const deleteSingleHabit = async (
    id
  ) => {
    const existingHabit =
      await getHabitById(id)
    if (!existingHabit) {
      throw new AppError("Habit not found", 404);
    }
  
    await deleteHabit(id)
    return { message: "Habit deleted" }
  }
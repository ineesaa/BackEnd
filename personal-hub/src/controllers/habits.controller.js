import {
    getHabits,
    getSingleHabit,
    createNewHabit,
    updateSingleHabit,
    checkInHabit,
    deleteSingleHabit } from "../services/habits.service.js";
  export const getAllHabits = async (
    req,
    res
  ) => {
    const habits =
      await getHabits()
    res.json(habits)
  }
  export const getHabit = async (
    req,
    res
  ) => {
    const habit =
      await getSingleHabit(
        req.params.id
      )
    res.json(habit)
  }
  
  export const createHabit = async (
    req,
    res
  ) => {
    const habit =
      await createNewHabit(
        req.body
      )
  
    res.status(201).json(habit)
  }
  
  export const updateHabit = async (
    req,
    res
  ) => {
    const habit =
      await updateSingleHabit(
        req.params.id,
        req.body
      )  
    res.json(habit)
  }
  
  export const checkHabit = async (
    req,
    res
  ) => {
    const habit =
      await checkInHabit(
        req.params.id
      )
    res.json(habit)
  }
  
  export const deleteHabit = async (
    req,
    res
  ) => {
    const data =
      await deleteSingleHabit(
        req.params.id
      )
    res.json(data)
  }
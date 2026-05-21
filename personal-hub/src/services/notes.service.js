import {getAllNotes,getNoteById,createNote,updateNote,deleteNote} from "../models/note.model.js"
  
  import { generateId } from "../utils/id.js"
  import { AppError } from "../utils/AppError.js"
  
  export const getNotes = async () => {
    return await getAllNotes()
  };
  export const getSingleNote = async (id) => {
    const note = await getNoteById(id)
    if (!note) {
      throw new AppError("Note not found", 404);
    }
    return note
  }
  export const createNewNote = async (noteData) => {
    const newNote = {
      id: generateId("n"),
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return await createNote(newNote)
  }
  
  export const updateSingleNote = async (
    id,
    updates
  ) => {
    const existingNote = await getNoteById(id)
  
    if (!existingNote) {
      throw new AppError("Note not found", 404)
    }
  
    return await updateNote(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  }
  
  export const deleteSingleNote = async (id) => {
    const existingNote = await getNoteById(id)
    if (!existingNote) {
      throw new AppError("Note not found", 404)
    }
  
    await deleteNote(id)
    return { message: "Note deleted" }
  }
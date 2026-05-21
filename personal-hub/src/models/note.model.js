import { readJson, writeJson } from "../utils/fileDb.js";

export const getAllNotes = async () => {
   const notes = await readJson("notes.json");

   return notes;
}

export const getNoteById = async (id) => {
    const notes = await readJson("notes.json")
    const note = notes.find((note) => note.id === id  )
    return note;
}

export const createNote = async (newNote) => {
    const notes = await readJson("notes.json")
    notes.push(newNote)
    await writeJson("notes.json", notes)
    return newNote
}

export const updateNote = async (id, updates) => {
    const notes = await readJson("notes.json")
    const index = notes.findIndex((note) => note.id === id)
    const updateNote = {
        ...notes[index],
        ...updates
    }
    notes[index] = updateNote
    await writeJson("notes.json", notes)
    return updateNote
}

export const deleteNote = async(id) => {
    const notes = await readJson("notes.json")
    const filteredNotes = notes.filter((note) => note.id !== id)
    await writeJson("notes.json", filteredNotes)
    return true;
}
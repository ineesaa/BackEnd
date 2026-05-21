import {
    getNotes,
    getSingleNote,
    createNewNote,
    updateSingleNote,
    deleteSingleNote
  } from "../services/notes.service.js";
  export const getAllNotes = async ( req,res ) => {
    const notes = await getNotes()
    res.json(notes)
  }
  export const getNote = async ( req, res ) => {
    const note = await getSingleNote(
      req.params.id
    )
    res.json(note)
  }
  
  export const createNote = async (
    req,
    res
  ) => {
    const note = await createNewNote(
      req.body
    )
    res.status(201).json(note);
  }
  
  export const updateNote = async (req,res) => {
    const note = await updateSingleNote(
      req.params.id,
      req.body
    );
  
    res.json(note);
  }
  
  export const deleteNote = async ( req, res ) => {
    const data =
      await deleteSingleNote(
        req.params.id
      )
    res.json(data);
  };
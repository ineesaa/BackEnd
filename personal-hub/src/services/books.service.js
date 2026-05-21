import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
  } from "../models/book.model.js"
  
  import { generateId } from "../utils/id.js"
  import { AppError } from "../utils/AppError.js"
  export const getBooks = async () => {
    return await getAllBooks()
  }
  export const getSingleBook = async (id) => {
    const book = await getBookById(id)
    if (!book) {
      throw new AppError("Book not found", 404);
    }
  
    return book
  }
  export const createNewBook = async (
    bookData
  ) => {
    const newBook = {
      id: generateId("b"),
      ...bookData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return await createBook(newBook)
  }
  
  export const updateSingleBook = async (id,updates) => {
    const existingBook = await getBookById(id)
  
    if (!existingBook) {
      throw new AppError("Book not found", 404)
    }
    return await updateBook(id, {...updates,updatedAt: new Date().toISOString(),})
  }
  
  export const deleteSingleBook = async (
    id
  ) => {
    const existingBook = await getBookById(id)
    if (!existingBook) {
      throw new AppError("Book not found", 404)
    }
  
    await deleteBook(id)
    return { message: "Book deleted" }
  }
import { readJson, writeJson } from "../utils/fileDb.js";

export const getAllBooks = async () => {
   const books = await readJson("books.json");

   return books;
}

export const getBookById = async (id) => {
    const books = await readJson("books.json")
    const book = books.find((book) => book.id === id  )
    return book;
}

export const createBook = async (newBook) => {
    const books = await readJson("books.json")
    books.push(newBook)
    await writeJson("books.json", books)
    return newBook
}

export const updateBook = async (id, updates) => {
    const books = await readJson("books.json")
    const index = books.findIndex((book) => book.id === id)
    const updatedBook = {
        ...books[index],
        ...updates
    }
    books[index] = updatedBook
    await writeJson("books.json", books)
    return updatedBook
}

export const deleteBook = async(id) => {
    const books = await readJson("books.json")
    const filteredBooks = books.filter((book) => book.id !== id)
    await writeJson("books.json", filteredBooks)
    return true;
}
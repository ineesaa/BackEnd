import {
    getBooks,
    getSingleBook,
    createNewBook,
    updateSingleBook,
    deleteSingleBook } from "../services/books.service.js";
  export const getAllBooks = async (
    req,
    res
  ) => {
    const books = await getBooks()
    res.json(books)
  }
  export const getBook = async (
    req,
    res
  ) => {
    const book = await getSingleBook(
      req.params.id
    );
    res.json(book)
  }
  export const createBook = async (
    req,
    res
  ) => {
    const book = await createNewBook(
      req.body
    )
    res.status(201).json(book);
  }
  export const updateBook = async (
    req,
    res
  ) => {
    const book = await updateSingleBook(
      req.params.id,
      req.body
    )
    res.json(book);
  }
  export const deleteBook = async (
    req,
    res
  ) => {
    const data =
      await deleteSingleBook(
        req.params.id
      );
  
    res.json(data);
  }
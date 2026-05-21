import express from "express";

import authRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import booksRoutes from "./routes/books.routes.js";
import habitsRoutes from "./routes/habits.routes.js";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/habits", habitsRoutes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
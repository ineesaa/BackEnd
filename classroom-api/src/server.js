require('dotenv').config({ quiet: true });
const express = require('express');
const connectDB = require('./db');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const coursesRoutes = require('./routes/courses');
const enrollmentsRoutes = require('./routes/enrollments.routes');

const errorHandler = require('./middleware/errorHandler');

const AppError = require('./utils/AppError');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'Classroom API',
    endpoints: ['auth', '/users', '/courses', '/enrollments'],
  });
});

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/courses', coursesRoutes);
app.use('/enrollments', enrollmentsRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.url} not found`), 404);
});

app.use(errorHandler);
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server runing on http://localhost:${PORT}`);
  });
});

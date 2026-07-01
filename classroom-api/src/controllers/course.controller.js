const courseService = require('../services/course.service');

async function list(req, res) {
  const courses = await courseService.listAll();
  res.json(courses);
}

async function getOne(req, res) {
  const course = await courseService.getById(req.params.id);
  res.json(course);
}

async function create(req, res) {
  const { name, description, materials, capacity } = req.body;
  const course = await courseService.create(
    { name, description, materials, capacity },
    req.user.id,
  );
  res.status(201).json(course);
}

async function update(req, res) {
  const course = await courseService.update(req.params.id, req.body, req.user);
  res.json(course);
}

async function remove(req, res) {
  await courseService.remove(req.params.id, req.user);
  res.status(204).send();
}

module.exports = { list, getOne, create, update, remove };

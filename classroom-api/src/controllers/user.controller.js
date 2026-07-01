const userService = require('../services/user.service');

async function me(req, res) {
  const user = await userService.getById(req.user.id);
  res.json(user);
}

async function list(req, res) {
  const users = await userService.listAll();
  res.json(users);
}

async function getOne(req, res) {
  const user = await userService.getById(req.params.id);
  res.json(user);
}

module.exports = { me, list, getOne };

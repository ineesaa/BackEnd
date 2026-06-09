const { readData } = require("../utils/fileHandler");
const path = require("path");

module.exports = async (req, res, next) => {
  const userId = Number(req.headers["x-user-id"]);

  const users = await readData(
    path.join(__dirname, "../data/users.json")
  );

  const user = users.find(u => u.id === userId);

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  next();
};
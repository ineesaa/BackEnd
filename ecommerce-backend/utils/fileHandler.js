const fs = require("fs").promises;

async function readData(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeData(filePath, data) {
  await fs.writeFile(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

module.exports = {
  readData,
  writeData,
};
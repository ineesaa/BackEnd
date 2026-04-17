const fs = require('fs');
const path = require('path');
const data = require('./data');
const filePath = path.join(__dirname, 'output.json');
fs.stat(filePath, (err, stats) => {
  if (err) {
    writeFile()
    return;
  }
  // size < 1KB
  if (stats.size < 1024) {
    writeFile()
  } else {
    console.log("File is big enough, nothing to do");
  }
})
function writeFile() {
  fs.writeFile(
    filePath,
    JSON.stringify(data, null, 2),
    (err) => {
      if (err) {
        console.log("Error writing file")
      } else {
        console.log("Data written to file")
      }
    }
  )
}
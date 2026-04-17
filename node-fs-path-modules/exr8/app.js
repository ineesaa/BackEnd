const fs = require('fs');
const path = require('path');
const rename = require('./renamer');
const dir = path.join(__dirname, 'files');
fs.readdir(dir, (err, files) => {
  if (err) {
    console.log("Error reading folder")
    return
  }

  for (let i = 0; i < files.length; i++) {
    const oldPath = path.join(dir, files[i])
    const newName = rename(files[i], i);
    const newPath = path.join(dir, newName);
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.log("Error renaming:", files[i])
      } else {
        console.log(files[i], "→", newName)
      }
    })
  }
})
const fs = require('fs');
const path = require('path');
const getBackupPath = require('./helper');
// source file
const sourcePath = path.resolve(__dirname, 'file.txt');
// destination file
const destPath = getBackupPath(sourcePath);
// copy file
fs.copyFile(sourcePath, destPath, (err) => {
  if (err) {
    console.log("Error copying file");
  } else {
    console.log("File copied to:", destPath);
  }
})
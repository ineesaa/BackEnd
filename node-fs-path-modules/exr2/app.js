const fs = require('fs');
const path = require('path');
const filterFiles = require('./filter');
const dir = path.join(__dirname, 'files');
const ext = '.js';
fs.readdir(dir, (err, files) => {
  if (err) {
    console.log('error');
    return
  }
  const filtered = filterFiles(files, ext)

  for (let i = 0; i < filtered.length; i++) {
    const fullPath = path.resolve(dir, filtered[i]);
    console.log(fullPath)
  }
})
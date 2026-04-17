const fs = require('fs');
const path = require('path');
const folders = require('./structure')
for (let i = 0; i < folders.length; i++) {
  const fullPath = path.resolve(__dirname, folders[i]);

  fs.mkdir(fullPath, { recursive: true }, (err) => {
    if (err) {
      console.log("Error creating:", folders[i]);
    } else {
      console.log("Created:", folders[i]);
    }
  })
}
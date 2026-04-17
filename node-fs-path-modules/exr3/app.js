const fs = require('fs');
const path = require('path');
const createHTML = require('./generator');
const title = "My First Page";
// generate HTML content
const content = createHTML(title)
const filePath = path.join(__dirname, 'index.html');
fs.writeFileSync(filePath, content);

console.log("HTML file created!");
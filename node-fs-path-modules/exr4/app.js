const fs = require('fs');
const path = require('path');
const render = require('./template-engine');
const templatePath = path.join(__dirname, 'template.txt');
const template = fs.readFileSync(templatePath, 'utf-8');
const data = {
  name: "Elon",
  city: "America",
  age: 55
}
// render template
const result = render(template, data);
const outputPath = path.join(__dirname, 'output.txt');
fs.writeFileSync(outputPath, result)
console.log("Template rendered!");
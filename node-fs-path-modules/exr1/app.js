const fs = require('fs');
const path = require('path');
const convert = require('./data-processor');
//input file path
const inputPath = path.join(__dirname, 'data.json');
//output file path
const outputPath = path.join(__dirname, 'output.json')
// read file
const raw = fs.readFileSync(inputPath, 'utf-8');
//convert JSON string → object
const data = JSON.parse(raw);
//process data
const newData = convert(data);
// write result
fs.writeFileSync(outputPath, JSON.stringify(newData, null, 2));
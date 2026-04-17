const fs = require('fs');
const path = require('path');
const parseConfig = require('./parser');
const requiredFields = ['PORT', 'DB_HOST', 'DB_USER'];
const filePath = path.join(__dirname, 'config.env');
const content = fs.readFileSync(filePath, 'utf-8');
const config = parseConfig(content)
// validation
for (let i = 0; i < requiredFields.length; i++) {
  const key = requiredFields[i]
  if (!config[key]) {
    console.log(`Missing config: ${key}`)
    process.exit(1)
  }
}

console.log("Config loaded successfully:", config);
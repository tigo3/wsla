
const fs = require('fs');
const path = require('path');

// Read the current package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add or update the server scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "server": "node src/server/start.js",
  "server:dev": "nodemon src/server/start.js",
  "dev:all": "concurrently \"npm run dev\" \"npm run server:dev\""
};

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('Package.json scripts updated successfully!');

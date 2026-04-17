const path = require('path');
function getBackupPath(filePath) {
  const dir = path.dirname(filePath);
  const name = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath);

  return path.join(dir, `${name}_backup${ext}`);
}
module.exports = getBackupPath
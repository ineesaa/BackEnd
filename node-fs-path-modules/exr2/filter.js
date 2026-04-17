function filterFiles(files, ext) {
    const result = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].endsWith(ext)) {
        result.push(files[i]);
      }
    }
    return result;
  }
  module.exports = filterFiles;
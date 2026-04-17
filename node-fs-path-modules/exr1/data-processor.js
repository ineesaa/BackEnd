function convert(obj) {
    const result = {};
    for (let key in obj) {
      let newKey = '';
      let upperNext = false;
      for (let i = 0; i < key.length; i++) {
        if (key[i] === '_') {
          upperNext = true;
        } else {
          if (upperNext) {
            newKey += key[i].toUpperCase();
            upperNext = false;
          } else {
            newKey += key[i]
          }
        }
      }
      result[newKey] = obj[key];
    }
    return result;
  }
  module.exports = convert
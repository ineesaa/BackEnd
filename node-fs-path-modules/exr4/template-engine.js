function render(template, vars) {
    let result = template;
    for (let key in vars) {
      const placeholder = `{{${key}}}`
      result = result.split(placeholder).join(vars[key])
    }
    return result;
  }
  
  module.exports = render;
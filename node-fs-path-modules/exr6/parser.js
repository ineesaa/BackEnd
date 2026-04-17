function parseConfig(content) {
    const lines = content.split('\n');
    const config = {}
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('=')) {
        const parts = line.split('=');
        const key = parts[0];
        const value = parts[1];
        config[key] = value;
      }
    }
    return config;
  }
  module.exports = parseConfig;
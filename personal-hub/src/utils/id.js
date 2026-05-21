export const generateId = (prefix) => {
    const random = Math.random().toString(36).slice(2, 7)
    return `${prefix}_${random}`
  }
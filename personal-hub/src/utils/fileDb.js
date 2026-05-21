import { writeFile } from "fs"
import fs from "fs/promises"

export const readJson = async(filename) => {
    const data = await fs.readFile(`data/${filename}`, "utf-8")
    return JSON.parse(data)
}
export const writeJson = async(filename, data) => {
    await fs.writeFile(`data/${filename}`, JSON.stringify(data, null, 2))
}
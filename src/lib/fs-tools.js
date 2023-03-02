import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const usersJSONPath = join(dataFolderPath, "users.json");
const blogJSONPath = join(dataFolderPath, "blogs.json");

export const getUsers = () => readJSON(usersJSONPath);
export const writeUsers = (usersArray) => writeJSON(usersJSONPath, usersArray);
export const getBlogs = () => readJSON(blogJSONPath);
export const writeBlogs = (blogsArray) => writeJSON(blogJSONPath, blogsArray);

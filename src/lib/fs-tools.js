import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const usersJSONPath = join(dataFolderPath, "users.json");
const blogJSONPath = join(dataFolderPath, "blogs.json");
const authorsPublicFolderPath = join(process.cwd(), "./public/img/authors");
console.log(process.cwd(), "cwd");
// const blogsPublicFolderPath = join(process.cwd(), "./public/img/blogPosts");

export const getAuthors = () => readJSON(usersJSONPath);
export const writeAuthors = (usersArray) =>
  writeJSON(usersJSONPath, usersArray);
export const getBlogs = () => readJSON(blogJSONPath);
export const writeBlogs = (blogsArray) => writeJSON(blogJSONPath, blogsArray);

export const saveUserAvatars = (fileName, fileContentAsBuffer) =>
  writeFile(join(authorsPublicFolderPath, fileName), fileContentAsBuffer);

// export const saveBlogCover = (fileName, fileContentAsBuffer) =>
//   writeFile(join(blogsPublicFolderPath, fileName), fileContentAsBuffer);

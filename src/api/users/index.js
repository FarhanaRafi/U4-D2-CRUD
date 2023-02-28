import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouter = Express.Router();

console.log("Current file", import.meta.url);
console.log("Current", fileURLToPath(import.meta.url));
console.log("Parent", dirname(fileURLToPath(import.meta.url)));
console.log(
  "target",
  join(dirname(fileURLToPath(import.meta.url)), "users.json")
);

const authorJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "users.json"
);

authorsRouter.post("/", (req, res) => {
  console.log("Request body", req.body);
  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
  };

  const author = JSON.parse(fs.readFileSync(authorJSONPath));
  author.push(newAuthor);
  fs.writeFileSync(authorJSONPath, JSON.stringify(author));
  res.status(201).send({ id: newAuthor.id });
});
authorsRouter.get("/", (req, res) => {
  const fileContent = fs.readFileSync(authorJSONPath);
  const authors = JSON.parse(fileContent);
  res.send(authors);
});
authorsRouter.get("/:authorId", (req, res) => {
  console.log("author id", req.params.authorId);
  const author = JSON.parse(fs.readFileSync(authorJSONPath));
  const findAuthor = author.find((a) => a.id === req.params.authorId);
  res.send(findAuthor);
});
authorsRouter.put("/:authorId", (req, res) => {
  const author = JSON.parse(fs.readFileSync(authorJSONPath));
  const index = author.findIndex((a) => a.id === req.params.authorId);
  const oldAuthor = author[index];
  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
  author[index] = updatedAuthor;
  fs.writeFileSync(authorJSONPath, JSON.stringify(author));
  res.send(updatedAuthor);
});
authorsRouter.delete("/:authorId", (req, res) => {
  const author = JSON.parse(fs.readFileSync(authorJSONPath));
  const remainingAuthors = author.filter((a) => a.id !== req.params.authorId);
  fs.writeFileSync(authorJSONPath, JSON.stringify(remainingAuthors));
  res.status(204).send();
});

export default authorsRouter;

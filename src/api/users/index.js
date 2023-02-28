import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqId from "uniqid";

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
  res.send({ message: "Hello I am the post Endpoint" });
});
authorsRouter.get("/", (req, res) => {
  const fileContent = fs.readFileSync(authorJSONPath);
  const authors = JSON.parse(fileContent);
  res.send(authors);
});
authorsRouter.get("/:authorId", (req, res) => {
  res.send({ message: "Hello I am the get Endpoint" });
});
authorsRouter.put("/:authorId", (req, res) => {
  res.send({ message: "Hello I am the put Endpoint" });
});
authorsRouter.delete("/:authorId", (req, res) => {
  res.send({ message: "Hello I am the delete Endpoint" });
});

export default authorsRouter;

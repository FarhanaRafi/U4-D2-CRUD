import Express from "express";

import { extname } from "path";
import uniqid from "uniqid";
import multer from "multer";
import { saveUserAvatars } from "../../lib/fs-tools.js";
import createHttpError from "http-errors";
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";

const authorsRouter = Express.Router();

// console.log("Current file", import.meta.url);
// console.log("Current", fileURLToPath(import.meta.url));
// console.log("Parent", dirname(fileURLToPath(import.meta.url)));
// console.log(
//   "target",
//   join(dirname(fileURLToPath(import.meta.url)), "users.json")
// );

// const authorJSONPath = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "users.json"
// );
// const getAuthors = () => JSON.parse(fs.readFileSync(authorJSONPath));
// const writeAuthors = (authorsArray) =>
//   fs.writeFileSync(authorJSONPath, JSON.stringify(authorsArray));

authorsRouter.post("/", async (req, res, next) => {
  console.log("Request body", req.body);
  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
  };
  const authorsArray = await getAuthors();

  const hasEmail = authorsArray.some(
    (author) => author.email === req.body.email
  );

  if (hasEmail) {
    res.status(400).send("Email already exists");
  } else {
    authorsArray.push(newAuthor);
    await writeAuthors(authorsArray);
    res.status(201).send({ id: newAuthor.id });
  }
});
authorsRouter.get("/", async (req, res, next) => {
  const authorsArray = await getAuthors();
  // const authors = JSON.parse(authorsArray);
  res.send(authorsArray);
});
authorsRouter.get("/:authorId", async (req, res) => {
  console.log("author id", req.params.authorId);
  const author = await getAuthors();
  const findAuthor = author.find((a) => a.id === req.params.authorId);
  res.send(findAuthor);
});
authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const authorsArray = await getAuthors();
    const index = authorsArray.findIndex((a) => a.id === req.params.authorId);
    if (index !== -1) {
      const oldAuthor = authorsArray[index];
      const updatedAuthor = {
        ...oldAuthor,
        ...req.body,
        updatedAt: new Date(),
      };
      authorsArray[index] = updatedAuthor;
      await writeAuthors(authorsArray);
      res.send(updatedAuthor);
    } else {
      next(
        createHttpError(404, `Author with id ${req.params.authorId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});
authorsRouter.delete("/:authorId", async (req, res) => {
  try {
    const authorsArray = await getAuthors();
    const remainingAuthors = authorsArray.filter(
      (a) => a.id !== req.params.authorId
    );
    if (authorsArray.length !== remainingAuthors.length) {
      await writeAuthors(remainingAuthors);
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Author with id ${req.params.authorId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});
authorsRouter.post("/checkEmail", async (req, res) => {
  const authors = await getAuthors();
  const email = req.body.email;
  const hasEmail = authors.some((author) => author.email === email);
  res.send(hasEmail);
});

authorsRouter.post(
  "/:authorId/uploadAvatar",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      console.log(req.file, "req file");
      console.log(req.body, "req body");
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.authorId + originalFileExtension;
      await saveUserAvatars(fileName, req.file.buffer);

      const authors = await getAuthors();
      const index = authors.findIndex(
        (author) => author.id === req.params.authorId
      );
      const authorToUpdate = authors[index];
      const updatedAuthor = {
        ...authorToUpdate,
        avatar: `http://localhost:3002/img/authors/${fileName}`,
      };
      authors[index] = updatedAuthor;
      await writeAuthors(authors);
      res.send({ message: "file uploaded" });
    } catch (error) {
      next(error);
    }
  }
);

export default authorsRouter;

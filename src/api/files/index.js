// import Express from "express";
// import multer from "multer";
// import { saveUserAvatars } from "../../lib/fs-tools.js";
// import { extname } from "path";

// const filesRouter = Express.Router();
// filesRouter.post(
//   "/:authorId/uploadAvatar",
//   multer().single("avatar"),
//   async (req, res, next) => {
//     try {
//       console.log(req.file, "req file");
//       console.log(req.body, "req body");
//       const originalFileExtension = extname(req.file.originalname);
//       const fileName = req.params.authorId + originalFileExtension;
//       await saveUserAvatars(fileName, req.file.buffer);

//       const authors = await getAuthors();
//       const index = authors.findIndex(
//         (author) => author.id === req.params.authorId
//       );
//       const authorToUpdate = authors[index];
//       const updatedAuthor = {
//         ...authorToUpdate,
//         avatar: `http://localhost:3001/imag/authors/${fileName}`,
//       };
//       authors[index] = updatedAuthor;
//       await writeAuthors(authors);
//       res.send({ message: "file uploaded" });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// export default filesRouter;

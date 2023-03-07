import Express from "express";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
import fs from "fs";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { checkBlogSchema, triggerBadRequest } from "./validation.js";
import { getBlogs, writeBlogs } from "../../lib/fs-tools.js";
import multer from "multer";
// import { extname } from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";

const blogsRouter = Express.Router();

// const blogJSONPath = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "blogs.json"
// );
// console.log(
//   "targetB",
//   join(dirname(fileURLToPath(import.meta.url)), "blogs.json")
// );

// const getBlogs = () => JSON.parse(fs.readFileSync(blogJSONPath));
// const writeBlogs = (blogsArray) =>
//   fs.writeFileSync(blogJSONPath, JSON.stringify(blogsArray));

const routerMiddleware = (req, res, next) => {
  console.log("I am a router middleware!");
  next();
};

blogsRouter.post(
  "/",
  routerMiddleware,
  checkBlogSchema,
  triggerBadRequest,
  async (req, res, next) => {
    const newBlog = {
      ...req.body,
      _id: uniqid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const blogsArray = await getBlogs();
    blogsArray.push(newBlog);
    await writeBlogs(blogsArray);
    res.status(201).send({ id: newBlog._id });
  }
);
blogsRouter.get("/", async (req, res, next) => {
  console.log("req query", req.query);
  const blogs = await getBlogs();
  console.log(blogs, "blogs");
  if (req.query && req.query.title) {
    const filteredBlogs = blogs.filter(
      (blog) => blog.title.toLowerCase() === req.query.title.toLowerCase()
    );
    res.send(filteredBlogs);
  } else {
    res.send(blogs);
  }
});
blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    const foundBlog = blogsArray.find((blog) => blog._id === req.params.blogId);
    if (foundBlog) {
      res.send(foundBlog);
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    const index = blogsArray.findIndex(
      (blog) => blog._id === req.params.blogId
    );
    if (index !== -1) {
      const oldBlog = blogsArray[index];
      const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };
      blogsArray[index] = updatedBlog;
      await writeBlogs(blogsArray);
      res.send(updatedBlog);
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    const remainingBlogs = blogsArray.filter(
      (blog) => blog._id !== req.params.blogId
    );
    if (blogsArray.length !== remainingBlogs.length) {
      await writeBlogs(remainingBlogs);
      res.status(204).send();
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "Strive/blogCover",
    },
  }),
}).single("cover");

blogsRouter.post(
  "/:blogId/uploadCover",
  cloudinaryUploader,
  //   multer().single("cover"),
  async (req, res, next) => {
    try {
      console.log(req.file, "req file");
      //   console.log(req.body, "req body");
      //   const originalFileExtension = extname(req.file.originalname);
      //   const fileName = req.params.blogId + originalFileExtension;
      //   await saveBlogCover(fileName, req.file.buffer);

      const blogsArray = await getBlogs();
      const index = blogsArray.findIndex(
        (blog) => blog._id === req.params.blogId
      );
      if (index !== -1) {
        const blogToUpdate = blogsArray[index];
        const updatedBlog = {
          ...blogToUpdate,
          cover: req.file.path,
        };
        blogsArray[index] = updatedBlog;
        await writeBlogs(blogsArray);
      }
      res.send({ message: "file uploaded" });
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.post("/:blogId/comments", async (req, res, next) => {
  try {
    const newComment = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: uniqid(),
    };

    const blogsArray = await getBlogs();
    const index = blogsArray.findIndex(
      (blog) => blog._id === req.params.blogId
    );
    if (index !== -1) {
      const oldBlog = blogsArray[index];
      const updatedComments = oldBlog.comments
        ? [...oldBlog.comments, newComment]
        : [newComment];
      const updatedBlog = { ...oldBlog, comments: updatedComments };
      blogsArray[index] = updatedBlog;
      await writeBlogs(blogsArray);
      res.status(201).send({ message: `Comment added ${newComment._id}` });
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId/comments", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    const blog = blogsArray.find((b) => b._id === req.params.blogId);
    if (blog.comments) {
      res.send(blog.comments);
    } else {
      res.send(`Blog with id ${req.params.blogId} has no comments`);
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    const index = blogsArray.findIndex((b) => b._id === req.params.blogId);
    const oldBlog = blogsArray[index];
    const newComments = oldBlog.comments.filter(
      (c) => c._id !== req.params.commentId
    );
    const newBlog = { ...oldBlog, comments: newComments };
    blogsArray[index] = newBlog;
    await writeBlogs(blogsArray);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId/pdf", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=blog.pdf");
    const blogsArray = await getBlogs();
    const foundBlog = blogsArray.find((blog) => blog._id === req.params.blogId);
    const source = getPDFReadableStream(foundBlog);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;

import Express from "express";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
import fs from "fs";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { checkBlogSchema, triggerBadRequest } from "./validation.js";
import { getBlogs, writeBlogs } from "../../lib/fs-tools.js";

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

export default blogsRouter;

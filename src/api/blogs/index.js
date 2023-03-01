import Express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import uniqid from "uniqid";

const blogsRouter = Express.Router();

const blogJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogs.json"
);
console.log(
  "targetB",
  join(dirname(fileURLToPath(import.meta.url)), "blogs.json")
);
const getBlogs = () => JSON.parse(fs.readFileSync(blogJSONPath));
const writeBlogs = (blogsArray) =>
  fs.writeFileSync(blogJSONPath, JSON.stringify(blogsArray));

const routerMiddleware = (req, res, next) => {
  console.log("I am a router middleware!");
  next();
};

blogsRouter.post("/", routerMiddleware, (req, res) => {
  const newBlog = {
    ...req.body,
    _id: uniqid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const blogsArray = getBlogs();
  blogsArray.push(newBlog);
  writeBlogs(blogsArray);
  res.status(201).send({ id: newBlog._id });
});
blogsRouter.get("/", (req, res) => {
  console.log("req query", req.query);
  const blogs = getBlogs();
  if (req.query && req.query.category) {
    const filteredBlogs = blogs.filter(
      (blog) => blog.category === req.query.category
    );
    res.send(filteredBlogs);
  } else {
    res.send(blogs);
  }
});
blogsRouter.get("/:blogId", (req, res) => {
  const blogsArray = getBlogs();
  const foundBlog = blogsArray.find((blog) => blog._id === req.params.blogId);
  res.send(foundBlog);
});
blogsRouter.put("/:blogId", (req, res) => {
  const blogsArray = getBlogs();
  const index = blogsArray.findIndex((blog) => blog._id === req.params.blogId);
  const oldBlog = blogsArray[index];
  const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };
  blogsArray[index] = updatedBlog;
  writeBlogs(blogsArray);
  res.send(updatedBlog);
});
blogsRouter.delete("/:blogId", (req, res) => {
  const blogsArray = getBlogs();
  const remainingBlogs = blogsArray.filter(
    (blog) => blog._id !== req.params.blogId
  );
  writeBlogs(remainingBlogs);
  res.status(204).send();
});

export default blogsRouter;

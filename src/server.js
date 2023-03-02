import Express from "express";
import authorsRouter from "./api/users/index.js";
import listEndpoints from "express-list-endpoints";
import blogsRouter from "./api/blogs/index.js";
import {
  badRequestHandler,
  genericErrorHandler,
  notfoundHandler,
  unauthorizedHandler,
} from "./errorsHandlers.js";
import cors from "cors";
// import filesRouter from "./api/files/index.js";

const server = Express();
const port = 3002;

const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request method ${req.method} -- url ${req.url} -- ${new Date()}`
  );
  next();
};
server.use(cors());

server.use(loggerMiddleware);
server.use(Express.json());

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogsRouter);
// server.use("/files", filesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notfoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});

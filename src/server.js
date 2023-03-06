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
import { join } from "path";
import createHttpError from "http-errors";
// import filesRouter from "./api/files/index.js";

const server = Express();
const port = process.env.PORT;
const publicFolderPath = join(process.cwd(), "./public");

const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request method ${req.method} -- url ${req.url} -- ${new Date()}`
  );
  next();
};
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

server.use(Express.static(publicFolderPath));
server.use(
  cors({
    object: (currentOrigin, corsNext) => {
      if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
        corsNext(null, true);
      } else {
        corsNext(
          createHttpError(
            400,
            `origin ${currentOrigin} is not in the whitelist`
          )
        );
      }
    },
  })
);

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

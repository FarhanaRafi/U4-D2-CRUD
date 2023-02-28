import Express from "express";
import authorsRouter from "./api/users/index.js";
import listEndpoints from "express-list-endpoints";

const server = Express();
const port = 3002;

server.use(Express.json());

server.use("/authors", authorsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});

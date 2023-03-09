import Express from "express";
// import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";
// import { getBlogs } from "../../lib/fs-tools.js";
import { Transform } from "@json2csv/node";
import { getBlogsJSONReadableStream } from "../../lib/fs-tools.js";

const filesRouter = Express.Router();

// filesRouter.get("/pdf", async (req, res, next) => {
//   try {
//     res.setHeader("Content-Disposition", "attachment; filename=blog.pdf");
//     const blogsArray = await getBlogs();
//     // const foundBlog = blogsArray.find((blog) => blog._id === req.params.blogId);
//     const source = getPDFReadableStream(blogsArray[0]);
//     const destination = res;
//     pipeline(source, destination, (err) => {
//       if (err) {
//         console.log(err);
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// });

filesRouter.get("/csv", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=blog.csv");
    const source = getBlogsJSONReadableStream();
    const transform = new Transform({
      fields: ["_id", "title", "category", "author.avatar", "author.name"],
    });
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default filesRouter;

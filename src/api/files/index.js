// import Express from "express";
// import { getPDFReadableStream } from "../../lib/pdf-tools.js";
// import { pipeline } from "stream";
// import { getBlogs } from "../../lib/fs-tools.js";

// const filesRouter = Express.Router();

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

// export default filesRouter;

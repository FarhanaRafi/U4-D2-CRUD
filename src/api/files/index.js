import Express from "express";

const filesRouter = Express.Router();
filesRouter.post("/:", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default filesRouter;

import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogsSchema = {
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory and needs to be in string",
    },
  },
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory and needs to be in string",
    },
  },
  cover: {
    in: ["body"],
    isString: {
      errorMessage: "Image is a mandatory and needs to be in string",
    },
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "Content is a mandatory and needs to be in string",
    },
  },
  createdAt: {
    in: ["body"],
    isString: {
      errorMessage: "CreatedAt is a mandatory and needs to be in string",
    },
  },
};

export const checkBlogSchema = checkSchema(blogsSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors.array());

  if (errors.isEmpty()) {
    next();
  } else {
    next(
      createHttpError(400, "Errors during blog validation", {
        errorsList: errors.array(),
      })
    );
  }
};

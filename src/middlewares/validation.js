import { loginScheme, registerScheme } from "../utils/validations.js";
import { ValidationError } from "../utils/error.js";

export default (req, res, next) => {
  try {
    if (req.url == "/login") {
      let { error } = loginScheme.validate(req.body);
      if (error) throw error;
    }

    if (req.url == "/register") {
      let { error } = registerScheme.validate(req.body);
      if (error) throw error;
    }

    return next();
  } catch (error) {
    return next(new ValidationError(401, error.message));
  }
};

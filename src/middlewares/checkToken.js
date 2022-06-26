import { ForbiddenError } from "../utils/error.js";
import jwt from "../utils/jwt.js";

export default (req, res, next) => {
  try {
    if (req.url == "/login" || req.url == "/register") return next();

    let { token } = req.headers;

    if (!token) {
      return next(new ForbiddenError(403, "token required"));
    }

    let { userId } = jwt.verify(token);

    req.userId = userId;

    return next();
  } catch (error) {
    return next(new ForbiddenError(403, error.message));
  }
};

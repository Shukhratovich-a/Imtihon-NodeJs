import sha256 from "sha256";
import jwt from "../utils/jwt.js";
import { editObject } from "../utils/editCase.js";
import { InternalServerError, AuthorizationError } from "../utils/error.js";
import { read, write } from "../utils/model.js";

const GET = (req, res, next) => {
  try {
    const users = read("users");

    res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const LOGIN = (req, res, next) => {
  try {
    const users = read("users");
    const { username, password } = req.body;

    const data = users.find(
      (user) =>
        (user.username.toLowerCase() == username.toLowerCase() || user.email == username) &&
        user.password == sha256(password)
    );

    if (!data) return next(new AuthorizationError(401, "wrong username or password"));

    delete data.password;

    res.status(200).json({
      status: 200,
      message: "login success",
      token: jwt.sign({ userId: data.userId }),
      data: data,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const REGISTER = (req, res, next) => {
  try {
    const users = read("users");

    req.body.userId = users.length ? users.at(-1).userId + 1 : 1;
    req.body.password = sha256(req.body.password);

    const data = users.find(
      (user) =>
        user.username.toLowerCase() == req.body.username.toLowerCase() ||
        user.email == req.body.email
    );

    if (data) return next(new AuthorizationError(401, "this username or email exits"));

    users.push(req.body);
    write("users", users);

    delete req.body.password;

    res.status(201).json({
      status: 201,
      message: "register success",
      token: jwt.sign({ userId: req.body.userId }),
      data: req.body,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

export default { GET, LOGIN, REGISTER };

import JWT from "jsonwebtoken";

let secret = "xn-9t4b11yi5a";

export default {
  sign: (payload) => JWT.sign(payload, secret),
  verify: (token) => JWT.verify(token, secret),
};

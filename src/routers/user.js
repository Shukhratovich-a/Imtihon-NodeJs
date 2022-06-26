import { Router } from "express";
import controller from "../controller/user.js";
import validation from "../middlewares/validation.js";

const router = Router();

router.get("/users", controller.GET);
router.post("/login", validation, controller.LOGIN);
router.post("/register", validation, controller.REGISTER);

export default router;

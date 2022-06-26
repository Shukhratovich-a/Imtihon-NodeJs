import { Router } from "express";
import checkToken from "../middlewares/checkToken.js";
import controller from "../controller/categories.js";

const router = Router();

router.get("/categories", controller.GET);
router.get("/categories/:categoryId", controller.GET);

router.post("/admin/categories", checkToken, controller.POST);
router.put("/admin/categories/:categoryId", checkToken, controller.PUT);
router.delete("/admin/categories/:categoryId", checkToken, controller.DELETE);

export default router;

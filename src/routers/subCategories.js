import { Router } from "express";
import checkToken from "../middlewares/checkToken.js";
import controller from "../controller/subCategories.js";

const router = Router();

router.get("/subcategories", controller.GET);
router.get("/subCategories/:subCategoryId", controller.GET);

router.post("/admin/subCategories", checkToken, controller.POST);
router.put("/admin/subCategories/:subCategoryId", checkToken, controller.PUT);
router.delete("/admin/subCategories/:subCategoryId", checkToken, controller.DELETE);

export default router;

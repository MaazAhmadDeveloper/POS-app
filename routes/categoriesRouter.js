import express from "express";
import { getCategoriesController, addCategoriesController, updateCategoriesController, deleteCategoriesController } from "../controllers/categoriesController.js"; 

const categoriesRouter = express.Router();

categoriesRouter.post("/addCategories", addCategoriesController);

categoriesRouter.get("/getCategories", getCategoriesController);

categoriesRouter.put("/updateCategories", updateCategoriesController);

categoriesRouter.put("/deleteCategories", deleteCategoriesController);

export default categoriesRouter;
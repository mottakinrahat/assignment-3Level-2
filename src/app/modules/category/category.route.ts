import { Router } from "express";
import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { categoryValidations } from "./category.validation";
import { categoryController } from "./category.controller";

const router = express.Router();
router.post(
  "/",
  validateRequest(categoryValidations.categoryValidationSchema),
  categoryController.createCategory
);
router.get("/", categoryController.getAllCategory);

export const categoryRoutes = router;

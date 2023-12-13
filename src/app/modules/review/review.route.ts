import { Router } from "express";
import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { reviewValidations } from "./review.validation";
import { reviewController } from "./review.controller";

const router = express.Router();
router.post(
  "/",
  validateRequest(reviewValidations.reviewValidationSchema),
  reviewController.createReview
);
router.get("/", reviewController.getAllReview);
router.get("/:id", reviewController.getSingleReview);

export const reviewRoutes = router;

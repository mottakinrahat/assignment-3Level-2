import { Router } from "express";
import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { courseValidations } from "./course.validation";
import { courseControllers } from "./course.controller";

const router = express.Router();
router.post(
  "/",
  validateRequest(courseValidations.courseValidationSchema),
  courseControllers.createCourse
);
router.get("/", courseControllers.getAllCourses);
router.get("/:id", courseControllers.getSingleCourse);
router.put(
  "/:id",
  validateRequest(courseValidations.updateCourseValidationSchema),
  courseControllers.updateCourse
);

export const courseRoutes = router;

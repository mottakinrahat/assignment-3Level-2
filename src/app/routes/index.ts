import { Router } from "express";
import { categoryRoutes } from "../modules/category/category.route";
import { courseRoutes } from "../modules/course/course.route";
import { reviewRoutes } from "../modules/review/review.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/categories",
    route: categoryRoutes,
  },
  {
    path: "/course",
    route: courseRoutes,
  },
  {
    path: "/courses",
    route: courseRoutes,
  },
  {
    path: "/reviews",
    route: reviewRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

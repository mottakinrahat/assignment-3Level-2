import { TCourse } from "./course.interface";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { courseServices } from "./course.service";
import catchAsync from "../../utils/catchAsync";

const createCourse = catchAsync(async (req, res) => {
  const result = await courseServices.createCourseIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course created successfully",
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  
  const result = await courseServices.getAllCoursesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses retrieved successfully",
    // meta:{
    //   page:,
    //   limit:,
    //   total:
    // },
    data:result
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.getSingleCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course retrieved successfully",
    data: result,
  });
});
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.updateCourseIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course is updated successfully",
    data: result,
  });
});

const getCourseWithReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.getCourseWithReviewIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course and Reviews retrieved successfully",
    data: result,
  });
});
const getBestCourse = catchAsync(async (req, res) => {
  const result = await courseServices.getBestCourseIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Best course retrieved successfully",
    data: result,
  });
});
export const courseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  getCourseWithReview,
  getBestCourse,
};

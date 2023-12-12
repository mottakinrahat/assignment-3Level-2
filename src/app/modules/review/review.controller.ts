import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { reviewServices } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const result = await reviewServices.createReviewIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});
const getAllReview = catchAsync(async (req, res) => {
  const result = await reviewServices.getAllReviewFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review retrieved successfully",
    data: result,
  });
});
const getSingleReview = catchAsync(async (req, res) => {
  const { id } = req.body;
  const result = await reviewServices.getSingleReviewFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Review retrieved successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getAllReview,
  getSingleReview,
};

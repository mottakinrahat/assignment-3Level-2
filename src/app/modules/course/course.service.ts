import { Request } from "express";
import { number } from "zod";
import { TCourse } from "./course.interface";
import { Course } from "./course.model";
import { courseFunctions } from "./course.function";
import mongoose from "mongoose";
import { Review } from "../review/review.model";

const createCourseIntoDB = async (payload: TCourse) => {
  const { startDate, endDate, ...restPayload } = payload;
  const durationInWeeks = courseFunctions.durationInWeeksCalculation(
    startDate,
    endDate
  );
  const updatedPayload = {
    durationInWeeks,
    startDate,
    endDate,
    ...restPayload,
  };

  const result = await Course.create(updatedPayload);
  return result;
};
const getAllCoursesFromDB = async () => {
  const result = await Course.find().populate("categoryId");
  return result;
};
const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id);
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { tags, details, ...courseRemainingData } = payload;

  //primitive data update
  const updateBasicCourseInfo = await Course.findByIdAndUpdate(
    id,
    courseRemainingData,
    { new: true, runValidators: true }
  );

  if (details) {
    const updateDetails = await Course.findByIdAndUpdate(
      id,
      {
        $set: {
          "details.level": details?.level,
          "details.description": details?.description,
        },
      },
      { new: true, runValidators: true }
    );
    return updateDetails;
  }

  if (tags && tags.length > 0) {
    const deletedTags = tags.filter((el) => el.name && el.isDeleted);
    const deleteOperation = await Course.findByIdAndUpdate(
      id,
      {
        $pull: {
          $set: {
            "tags.$[elem].isDeleted": true,
          },
        },
      },
      {
        new: true,
        arrayFilters: [
          { "elem.name": { $in: deletedTags.map((tag) => tag.name) } },
        ],
        runValidators: true,
      }
    );

    //add new data
    const addTags: object = tags.filter((el) => el.name && !el.isDeleted);
    const addToSetOperation = await Course.findByIdAndUpdate(
      id,
      { $addToSet: { tags: { $each: addTags } } },
      { new: true, runValidators: true }
    );
    return addToSetOperation;
  }
  return updateBasicCourseInfo;
};

const getCourseWithReviewIntoDB = async (id: string) => {
  const newObjectID = new mongoose.Types.ObjectId(id);
  const result = await Course.aggregate([
    {
      $match: {
        _id: newObjectID,
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "courseId",
        as: "reviews",
      },
    },
  ]);
  if (result.length > 0) {
    const courseWithReviewArray = result[0];
    return courseWithReviewArray;
  } else {
    throw new Error("No data found");
  }
};

const getBestCourseIntoDB = async () => {
  try {
    const result = await Review.aggregate([
      {
        $group: {
          _id: "$courseId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
      {
        $sort: { averageRating: -1, reviewCount: -1 },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $project: {
          _id: 0,
          course: 1,
          averageRating: 1,
          reviewCount: 1,
        },
      },
    ]);

    if (result.length > 0) {
      const bestCourse = result[0]; 
      return bestCourse;
    } else {
      return null; 
    }
  } catch (error) {
    throw error;
  }
};

export const courseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  getCourseWithReviewIntoDB,
  getBestCourseIntoDB,
};

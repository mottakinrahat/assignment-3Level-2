/* eslint-disable prefer-const */

import { TCourse } from "./course.interface";
import { Course } from "./course.model";
import { courseFunctions } from "./course.function";
import mongoose from "mongoose";
import { Review } from "../review/review.model";
import { filterCourseQuery } from "./course.type";
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

const totalDataCount = async () => {
  const data = await Course.find();
  return data.length;
};
const getAllCoursesFromDB = async (query: filterCourseQuery) => {
  //destructuring the query fields
  let {
    page = 1,
    limit = 10,
    sortBy = "title",
    sortOrder = "asc",
    minPrice,
    maxPrice,
    tags,
    startDate,
    endDate,
    language,
    provider,
    durationInWeeks,
    level,
  } = query;
  page = +page;
  limit = +limit;
  const skip = (page - 1) * limit;
  const filterData: any = {};

  //filter using price
  if (minPrice !== undefined && maxPrice !== undefined) {
    filterData.price = { $gte: +minPrice, $lte: +maxPrice };
  }
  if (startDate !== undefined && endDate !== undefined) {
    filterData.startDate = { $gte: startDate };
    filterData.endDate = { $lte: endDate };
  }
  if (tags) {
    filterData["tags.name"] = tags;
  }
  if (language) {
    filterData.language = language;
  }
  if (provider) {
    filterData.provider = provider;
  }
  if (durationInWeeks) {
    filterData.durationInWeeks = durationInWeeks;
  }
  if (level) {
    filterData["details.level"] = level;
  }
  const sortFormula: any = {};

  sortFormula[sortBy] = sortOrder === "desc" ? -1 : 1;

  const result = await Course.find(filterData)
    .sort(sortFormula)
    .skip(skip)
    .limit(limit);

  const totalCount = await Course.countDocuments(filterData);
  const meta = {
    page,
    limit,
    total: totalCount,
  };
  return { result, meta };
};
const getSingleCourseFromDB = async (id: string) => {
  const exists = await Course.isCourseExists(id);
  if (!exists) {
    throw new Error("Course not found");
  }
  const result = await Course.findById(id);
  return result;
};
//for update course
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  //check if the id is exist or not
  const exists = await Course.isCourseExists(id);
  if (!exists) {
    throw new Error("Course not found");
  }
  try {
    const { tags, details, ...courseRemainingData } = payload;

    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      { new: true, runValidators: true }
    );

    if (details) {
      await Course.findByIdAndUpdate(
        id,
        {
          $set: {
            "details.level": details.level,
            "details.description": details.description,
          },
        },
        { new: true, runValidators: true }
      );
    }

    if (tags && tags.length > 0) {
      const existingTags = updateBasicCourseInfo?.tags.map((tag) => tag.name);

      for (const tag of tags) {
        if (tag.name && !tag.isDeleted) {
          if (!existingTags?.includes(tag.name)) {
            await Course.findByIdAndUpdate(
              id,
              { $addToSet: { tags: tag } },
              { runValidators: true }
            );
          } else {
            await Course.findOneAndUpdate(
              { _id: id, "tags.name": tag.name },
              { $set: { "tags.$.isDeleted": false } },
              { runValidators: true }
            );
          }
        } else if (tag.name && tag.isDeleted) {
          await Course.findOneAndUpdate(
            { _id: id, "tags.name": tag.name },
            { $pull: { tags: { name: tag.name } } },
            { runValidators: true }
          );
        }
      }
    }

    const updatedCourse = await Course.findById(id);
    return updatedCourse;
  } catch (error) {
    throw new Error("Error");
  }
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
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
  ]);

  if (result.length > 0) {
    const bestCourse = result[0];
    return bestCourse;
  } else {
    return "Course not found";
  }
};

export const courseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  getCourseWithReviewIntoDB,
  getBestCourseIntoDB,
  totalDataCount,
};

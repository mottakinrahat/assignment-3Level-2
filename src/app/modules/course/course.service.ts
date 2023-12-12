import { number } from "zod";
import { TCourse } from "./course.interface";
import { Course } from "./course.model";
import { courseFunctions } from "./course.function";

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

  if (tags && tags.length > 0) {
    const deletedTags = tags.filter((el) => el.name && el.isDeleted);
    const deleteOperation = await Course.findByIdAndUpdate(
      id,
      {
        $set: {
          "tags.$[elem].isDeleted": true,
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

export const courseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
};

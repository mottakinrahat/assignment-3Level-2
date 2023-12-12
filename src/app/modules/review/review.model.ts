import { Schema, model } from "mongoose";
import { TReview } from "./review.interface";


const reviewSchema = new Schema<TReview>({
  courseId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  rating: {
    type: Number,
    required: [true,'Rating is Required'],
  },
  review: {
    type: String,
    required: [true,'Review is Required'],
  },
});

export const Review = model<TReview>("Review", reviewSchema);

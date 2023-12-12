import { Schema, model } from "mongoose";
import { TCourse, TDetails, TTags } from "./course.interface";

const tagsSchema = new Schema<TTags>({
  name: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const detailsSchema = new Schema<TDetails>({
  level: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  instructor: {
    type: String,
    required: true,
    trim: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    required: [true, "Category ID is required"],
    ref: "Category",
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
  tags: [tagsSchema],
  startDate: {
    type: String,
    required: [true, "Start Date is required"],
    trim: true,
  },
  endDate: {
    type: String,
    required: [true, "end Date is required"],
    trim: true,
  },
  language: {
    type: String,
    required: [true, "language is required"],
    trim: true,
  },
  provider: {
    type: String,
    required: [true, "Provider is required"],
    trim: true,
  },
  durationInWeeks: {
    type: Number,
  },
  details: detailsSchema,
});

export const Course = model<TCourse>("Course", courseSchema);

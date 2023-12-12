import { z } from "zod";

const reviewValidationSchema = z.object({
  body: z.object({
    courseId: z.string(),
    rating: z.number(),
    review: z.string(),
  }),
});

export const reviewValidations = {
  reviewValidationSchema,
};

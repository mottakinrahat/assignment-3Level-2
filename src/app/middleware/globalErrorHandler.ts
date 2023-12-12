import { path } from "path";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

import { ErrorRequestHandler, NextFunction } from "express";
import express, { Request, Response } from "express";
import { ZodError, ZodIssue, number, string } from "zod";
import { TErrorSource } from "../interface/error";
import config from "../config";
import handleZodError from "../config/errors/handleZodError";
import handleValidationError from "../config/errors/handleValidationError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "something went wrong";

  let errorSources: TErrorSource = [
    {
      path: "",
      message: "something went wrong",
    },
  ];

  if (err instanceof ZodError) {
    const smiplifiedError = handleZodError(err);
    statusCode = smiplifiedError.statusCode;
    message = smiplifiedError.message;
    errorSources = smiplifiedError.errorSources;
  } else if (err?.name === "ValidationError") {
    const smiplifiedError = handleValidationError(err);
    statusCode = smiplifiedError.statusCode;
    message = smiplifiedError.message;
    errorSources = smiplifiedError.errorSources;
  }
  else if(err?.name==='castError'){
    const smiplifiedError = handleCastError(err);
    statusCode = smiplifiedError.statusCode;
    message = smiplifiedError.message;
    errorSources = smiplifiedError.errorSources;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage: errorSources
      .map((eSource) => `${eSource.path} is ${eSource.message}`)
      .join("."),
    errorDetails: err,

    stack: config.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;

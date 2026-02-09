import { Express, Request, NextFunction } from "express";

import { ApiError } from "../class/api.error";
// import { errorHandler } from "./error.handler";
export const MiddlewareApplication = (app: Express) => {
  // Catch 404 and forward to error handler
  app.use((req: Request, _, next: NextFunction) => {
    const error = new ApiError(
      `Can't find ${req.originalUrl} on this server`,
      404,
    );
    next(error);
  });

  // Global error handling middleware (must be last)
  //   app.use(errorHandler);
};

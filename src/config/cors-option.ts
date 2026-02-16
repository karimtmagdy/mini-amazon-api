import cors from "cors";
import { ApiError } from "../class/api.error";
import { env } from "../lib/env";

export const corsOption = () => {
  return cors({
    origin: (origin, callback) => {
      const { clientUrl, frontendUrl, globalUrl } = env;
      const allowedOrigins = [clientUrl, frontendUrl, globalUrl];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new ApiError("Not allowed by CORS", 403));
      }
    },
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
};

const { NODE_ENV, PORT, DB_LOCAL, MONGO_URL_MONGODB_URI } = process.env;
const { CLIENT_URL, FRONTEND_URL, GLOBAL_URL } = process.env;
const { DB_URI, DB_PASS, DB_PASS_URI, MINI_MONGODB_URI } = process.env;
const { ACCESS_TOKEN, ACCESS_EXPIRES_IN } = process.env;
const { REFRESH_TOKEN, REFRESH_EXPIRES_IN } = process.env;
const { CART_SECRET, RESET_SECRET } = process.env;
const {
  CLOUDINARY_API_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET_KEY,
  CLOUDINARY_API_URL,
  WEBHOOK_PASSWORD,
} = process.env;
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
const { STRIPE_SECRET_KEY } = process.env;
const { VERCEL_TOKEN, VERCEL_PROJECTID ,VERCEL_TEAM_ID,VERCEL_API} = process.env;

export const env = {
  port: PORT,
  nodeEnv: NODE_ENV,
  clientUrl: CLIENT_URL,
  frontendUrl: FRONTEND_URL,
  globalUrl: GLOBAL_URL,
  dbLocal: DB_LOCAL,
  mongoDbUri: MONGO_URL_MONGODB_URI,
  dbUri: DB_URI,
  dbPass: DB_PASS,
  dbPassUri: DB_PASS_URI,
  miniMongodbUri: MINI_MONGODB_URI,
  accessToken: ACCESS_TOKEN,
  accessExpiresIn: ACCESS_EXPIRES_IN,
  refreshToken: REFRESH_TOKEN,
  refreshExpiresIn: REFRESH_EXPIRES_IN,
  cartSecret: CART_SECRET,
  resetSecret: RESET_SECRET,
  cloudinaryApiCloudName: CLOUDINARY_API_CLOUD_NAME,
  cloudinaryApiKey: CLOUDINARY_API_KEY,
  cloudinaryApiSecretKey: CLOUDINARY_API_SECRET_KEY,
  cloudinaryApiUrl: CLOUDINARY_API_URL,
  webhookPassword: WEBHOOK_PASSWORD,
  emailHost: EMAIL_HOST,
  emailPort: EMAIL_PORT,
  emailUser: EMAIL_USER,
  emailPass: EMAIL_PASS,
  stripeSecretKey: STRIPE_SECRET_KEY,
  vercelToken: VERCEL_TOKEN,
  vercelProjectId: VERCEL_PROJECTID,
  vercelTeamId: VERCEL_TEAM_ID,
  vercelApiUrl: VERCEL_API,
};

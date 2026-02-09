// import { type Express } from "express";
import fs from "fs";
import path from "path";
import os from "os";
import multer from "multer";

// 1. Use system temp directory for Vercel compatibility
export const uploadDir = path.join(os.tmpdir(), "a-z-express-uploads");

// 2. Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 3. Storage configuration
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      new Date().toISOString().replace(/:/g, "-") + file.originalname;
    // const uniqueSuffix = new Date().toISOString().replace(/:/g, "-") + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix);
  },
});

// 4. File filter
const FileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [".png", ".jpg", ".jpeg", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (.png, .jpg, .jpeg, .webp)"));
  }
};

// 5. Export Multer Instance
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024, // 1MB
    // fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: FileFilter,
});

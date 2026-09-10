import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${safeName}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /pdf|doc|docx|ppt|pptx|zip|tar|gz|csv|png|jpg|jpeg|mp4/;
  const isExtAllowed = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

  if (isExtAllowed) {
    return cb(null, true);
  }
  cb(new Error("File upload rejected: Only educational documents, presentations, datasets, and media files are allowed."));
};

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter
});

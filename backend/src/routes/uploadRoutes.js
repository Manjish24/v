import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, requireRoles("trainer", "admin"), upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file provided for upload." });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    message: "File uploaded successfully!",
    file: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
      mimetype: req.file.mimetype,
      url: fileUrl
    }
  });
});

export default router;

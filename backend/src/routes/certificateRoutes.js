import express from "express";
import { downloadCertificate, verifyCertificate } from "../controllers/certificateController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/verify/:certificateId", verifyCertificate);
router.get("/:certificateId/download", verifyToken, downloadCertificate);

export default router;

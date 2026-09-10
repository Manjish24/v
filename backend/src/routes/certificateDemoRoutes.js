import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createCertificatePdf } from "../services/certificateService.js";

const router = express.Router();
const certificates = new Map();

const clean = (value, maxLength) => String(value || "").trim().slice(0, maxLength);

router.post("/", async (req, res) => {
  const recipientName = clean(req.body.recipientName, 80);
  const courseTitle = clean(req.body.courseTitle, 160);
  if (!recipientName || !courseTitle) {
    return res.status(400).json({ message: "Student name and course name are required." });
  }

  const certificateId = `TEST-CERT-${uuidv4().slice(0, 8).toUpperCase()}`;
  const certificate = {
    certificateId,
    recipientName,
    courseTitle,
    issueDate: new Date().toISOString()
  };
  certificates.set(certificateId, certificate);
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.status(201).json({
    certificate,
    verificationUrl: `${baseUrl}/api/demo-certificates/verify/${certificateId}`
  });
});

router.get("/verify/:certificateId", (req, res) => {
  const certificate = certificates.get(req.params.certificateId);
  if (!certificate) return res.status(404).json({ valid: false, message: "Test certificate not found." });
  res.json({ valid: true, status: "valid", certificate });
});

router.get("/:certificateId/download", async (req, res) => {
  try {
    const certificate = certificates.get(req.params.certificateId);
    if (!certificate) return res.status(404).json({ message: "Test certificate not found. Create one first." });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${certificate.certificateId}.pdf"`);
    await createCertificatePdf(res, certificate, `${baseUrl}/api/demo-certificates/verify/${certificate.certificateId}`);
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ message: "Could not create the test PDF." });
  }
});

export default router;

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import traineeRoutes from "./routes/traineeRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import certificateDemoRoutes from "./routes/certificateDemoRoutes.js";

import { dataService } from "./services/dataService.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Global Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/certificate-demo", express.static(path.join(__dirname, "../public/certificate-demo")));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// System Health API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    portal: "CAPACITY CONNECT - MoES / IMD",
    hackathon: "Smart India Hackathon 2026 - Problem 26075",
    timestamp: new Date().toISOString()
  });
});

// Mounted REST API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/trainee", traineeRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/demo-certificates", certificateDemoRoutes);

// Public announcements & library endpoints
app.get("/api/announcements", async (req, res, next) => {
  try {
    const announcements = await dataService.getAnnouncements();
    res.status(200).json({ success: true, count: announcements.length, announcements, data: announcements });
  } catch (err) {
    next(err);
  }
});

app.get("/api/library", async (req, res, next) => {
  try {
    const resources = await dataService.getLibraryResources();
    res.status(200).json({ success: true, count: resources.length, resources, data: resources });
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;

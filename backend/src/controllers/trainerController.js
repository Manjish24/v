import { v4 as uuidv4 } from "uuid";
import { dataService } from "../services/dataService.js";
import { validateCourse } from "../models/Course.js";
import { validateAssessment } from "../models/Assessment.js";
import { generateVideoTheory, verifyCourseContent, verifyYouTubeVideo } from "../services/geminiService.js";
import { getVideoMetadata } from "../services/youtubeService.js";

const isYouTubeUrl = (value) => {
  try {
    const url = new URL(value);
    return ["www.youtube.com", "youtube.com", "youtu.be", "m.youtube.com"].includes(url.hostname);
  } catch {
    return false;
  }
};

// ---------------------------------------------------------------------------
// GET /api/trainer/youtube-metadata?url=<youtubeUrl>
// Fetches video title, thumbnail, duration via YouTube Data API v3.
// ---------------------------------------------------------------------------
export const getYouTubeMetadata = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ success: false, message: "Query parameter 'url' is required." });
    }

    if (!isYouTubeUrl(url)) {
      return res.status(400).json({ success: false, message: "Invalid YouTube URL." });
    }

    const metadata = await getVideoMetadata(url);

    return res.status(200).json({ success: true, metadata });
  } catch (error) {
    console.error("YouTube metadata fetch failed:", error.message);
    return res.status(502).json({
      success: false,
      message: error.message || "Failed to fetch YouTube video metadata.",
    });
  }
};

// ---------------------------------------------------------------------------
// POST /api/trainer/verify-video
// Verifies a YouTube video against a course using Gemini AI.
// ---------------------------------------------------------------------------
export const verifyVideo = async (req, res) => {
  try {
    let { courseName, videoTitle, videoUrl, topics, competencies = topics } = req.body;

    if (!courseName || !videoUrl || !Array.isArray(topics) || topics.length === 0 || !Array.isArray(competencies) || competencies.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Course name, YouTube URL, at least one topic, and one competency are required.",
      });
    }

    if (!isYouTubeUrl(videoUrl)) {
      return res.status(400).json({ success: false, message: "Invalid YouTube URL." });
    }

    // Auto-fetch video title from YouTube API if the caller didn't provide it
    if (!videoTitle) {
      try {
        const meta = await getVideoMetadata(videoUrl);
        videoTitle = meta.title;
      } catch {
        videoTitle = "Unknown Video";
      }
    }

    const verification = await verifyYouTubeVideo({
      courseName,
      videoTitle,
      videoUrl,
      topics: topics.map((topic) => String(topic).trim()).filter(Boolean),
      competencies: competencies.map((competency) => String(competency).trim()).filter(Boolean),
    });

    if (verification.mappingPercentage < 85) {
      return res.status(422).json({
        success: false,
        verified: false,
        message: "Video does not sufficiently map to the academic course.",
        data: { ...verification, theory: null },
      });
    }

    const theory = await generateVideoTheory({
      courseName,
      videoTitle,
      topics,
      competencies,
      verification,
    });

    return res.status(200).json({
      success: true,
      verified: true,
      message: "Video successfully verified.",
      data: { ...verification, theory },
    });
  } catch (error) {
    console.error("Video verification failed:", error.message);
    return res.status(502).json({
      success: false,
      verified: false,
      message: "Gemini video verification failed.",
      error: error.message,
    });
  }
};


export const getTrainerCourses = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const courses = await dataService.getCourses();
    const myCourses = courses.filter((c) => c.trainerId === trainerId);
    res.status(200).json({ success: true, courses: myCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch courses.", error: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const trainerName = req.user.name;
    const { title, category, duration, level, description, thumbnail, modules, topics = [] } = req.body;

    const validation = validateCourse({ title, category, trainerId });
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: validation.errors.join(", ") });
    }

    if (!Array.isArray(modules) || modules.length === 0) {
      return res.status(400).json({ success: false, message: "At least one course module is required." });
    }

    const normalizedTopics = topics.map((topic) => String(topic).trim()).filter(Boolean);
    const primaryModule = modules[0];

    if (normalizedTopics.length === 0) {
      return res.status(400).json({ success: false, message: "At least one academic topic is required." });
    }

    if (!primaryModule.videoUrl || !isYouTubeUrl(primaryModule.videoUrl)) {
      return res.status(400).json({ success: false, message: "A valid YouTube URL is required for the first module." });
    }

    let verification;
    try {
      verification = await verifyYouTubeVideo({
        courseName: category,
        videoTitle: primaryModule.title || title,
        videoUrl: primaryModule.videoUrl,
        topics: normalizedTopics,
        competencies: normalizedTopics
      });
    } catch (error) {
      return res.status(502).json({ success: false, message: error.message });
    }

    if (verification.mappingPercentage < 85) {
      return res.status(422).json({
        success: false,
        verified: false,
        message: "Course content does not map sufficiently to the academic course (minimum 85%).",
        verification: { ...verification, theory: null }
      });
    }

    const theory = await generateVideoTheory({
      courseName: category,
      videoTitle: primaryModule.title || title,
      topics: normalizedTopics,
      competencies: normalizedTopics,
      verification,
    });

    const newCourse = {
      id: `crs-${uuidv4().substring(0, 8)}`,
      title,
      category,
      trainerId,
      trainerName,
      duration: duration || "4 Weeks",
      level: level || "Intermediate",
      description: description || "",
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?auto=format&fit=crop&w=800&q=80",
      status: "published",
      enrolledCount: 0,
      rating: 5.0,
      verification: {
        ...verification,
        theory,
        verifiedAt: new Date().toISOString()
      },
      modules: Array.isArray(modules)
        ? modules.map((m, idx) => ({
            id: m.id || `mod-${idx + 101}`,
            title: m.title || `Module ${idx + 1}`,
            duration: m.duration || "45 mins",
            videoUrl: m.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
            timestamp: m.timestamp || "",
            content:
              m.content ||
              (idx === 0
                ? `${theory.notes}${theory.keyPoints.length ? `\n\nKey Points:\n${theory.keyPoints.map((point) => `- ${point}`).join("\n")}` : ""}`
                : ""),
            resources: m.resources || []
          }))
        : [],
      createdAt: new Date().toISOString()
    };

    await dataService.createCourse(newCourse);

    res.status(201).json({
      success: true,
      message: "Course verified and created successfully!",
      course: newCourse,
      verification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create course.", error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const trainerId = req.user.id;
    const course = await dataService.getCourseById(id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }
    if (course.trainerId !== trainerId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized to edit this course." });
    }

    const updated = await dataService.updateCourse(id, req.body);
    res.status(200).json({ success: true, message: "Course updated successfully.", course: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update course.", error: error.message });
  }
};

export const createAssessment = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const { courseId, title, durationMinutes, passingPercentage, deadline, questions } = req.body;

    const course = await dataService.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Associated course not found." });
    }

    const validation = validateAssessment({ courseId, title, questions });
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: validation.errors.join(", ") });
    }

    const formattedQuestions = questions.map((q, idx) => ({
      id: q.id || `q${idx + 1}`,
      question: q.question,
      options: q.options || [],
      correctOptionIndex: Number(q.correctOptionIndex) || 0,
      marks: Number(q.marks) || 10,
      explanation: q.explanation || ""
    }));

    const totalMarks = formattedQuestions.reduce((sum, q) => sum + q.marks, 0);

    const newAssessment = {
      id: `asm-${uuidv4().substring(0, 8)}`,
      courseId,
      courseTitle: course.title,
      title,
      trainerId,
      durationMinutes: Number(durationMinutes) || 20,
      passingPercentage: Number(passingPercentage) || 60,
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      totalMarks,
      questions: formattedQuestions,
      createdAt: new Date().toISOString()
    };

    await dataService.createAssessment(newAssessment);

    res.status(201).json({
      success: true,
      message: "Assessment created successfully!",
      assessment: newAssessment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create assessment.", error: error.message });
  }
};

export const getTrainerAssessments = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const assessments = await dataService.getAssessments();
    const myAssessments = assessments.filter((a) => a.trainerId === trainerId || req.user.role === "admin");
    res.status(200).json({ success: true, assessments: myAssessments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch assessments.", error: error.message });
  }
};

export const getTraineeProgress = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const allCourses = await dataService.getCourses();
    const trainerCourses = allCourses.filter((c) => c.trainerId === trainerId);
    const trainerCourseIds = trainerCourses.map((c) => c.id);

    const allEnrollments = await dataService.getEnrollments();
    const relevantEnrollments = allEnrollments.filter((e) => trainerCourseIds.includes(e.courseId));

    const allUsers = await dataService.getUsers();
    const allSubmissions = await dataService.getSubmissions();

    const progressData = relevantEnrollments.map((enr) => {
      const trainee = allUsers.find((u) => u.id === enr.userId);
      const course = trainerCourses.find((c) => c.id === enr.courseId);
      const traineeSubs = allSubmissions.filter((s) => s.userId === enr.userId && s.courseId === enr.courseId);

      return {
        enrollmentId: enr.id,
        traineeId: enr.userId,
        traineeName: trainee ? trainee.name : "Unknown Trainee",
        traineeEmail: trainee ? trainee.email : "",
        organization: trainee ? trainee.organization : "",
        department: trainee ? trainee.department : "",
        courseId: enr.courseId,
        courseTitle: course ? course.title : "Unknown Course",
        enrolledAt: enr.enrolledAt,
        progressPercentage: enr.progressPercentage,
        status: enr.status,
        submissions: traineeSubs.map((s) => ({
          assessmentTitle: s.assessmentTitle,
          score: s.score,
          totalMarks: s.totalMarks,
          percentage: s.percentage,
          passed: s.passed,
          submittedAt: s.submittedAt
        }))
      };
    });

    res.status(200).json({ success: true, progress: progressData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve trainee progress.", error: error.message });
  }
};

export const getLibraryResources = async (req, res) => {
  try {
    const resources = await dataService.getLibraryResources();
    res.status(200).json({ success: true, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load library resources.", error: error.message });
  }
};

export const uploadLibraryResource = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const trainerName = req.user.name;
    const { title, category, fileType, fileSize, downloadUrl, description } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, message: "Title and Category are required." });
    }

    const newResource = {
      id: `lib-${uuidv4().substring(0, 8)}`,
      title,
      category,
      uploadedBy: trainerId,
      uploaderName: trainerName,
      fileType: fileType || "PDF",
      fileSize: fileSize || "5.0 MB",
      downloadUrl: downloadUrl || "#",
      description: description || "",
      downloads: 0,
      createdAt: new Date().toISOString()
    };

    await dataService.createLibraryResource(newResource);

    res.status(201).json({
      success: true,
      message: "Resource uploaded to Trainer Library successfully!",
      resource: newResource
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to upload resource.", error: error.message });
  }
};

export const deleteLibraryResource = async (req, res) => {
  try {
    const { id } = req.params;
    await dataService.deleteLibraryResource(id);
    res.status(200).json({ success: true, message: "Resource removed successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete resource.", error: error.message });
  }
};

import { v4 as uuidv4 } from "uuid";
import { dataService } from "../services/dataService.js";
import { validateFeedback } from "../models/Feedback.js";

export const getAllCourses = async (req, res) => {
  try {
    const { category, search, level } = req.query;
    let courses = await dataService.getCourses();

    if (category && category !== "All") {
      courses = courses.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }
    if (level && level !== "All") {
      courses = courses.filter((c) => c.level.toLowerCase() === level.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.trainerName.toLowerCase().includes(q)
      );
    }

    res.status(200).json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch courses.", error: error.message });
  }
};

export const getCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await dataService.getCourseById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    // Check enrollment if user is authenticated
    let enrollment = null;
    if (req.user) {
      enrollment = await dataService.getEnrollment(req.user.id, id);
    }

    // Get assessments linked to course
    const assessments = await dataService.getAssessmentsByCourse(id);
    // Get feedbacks
    const feedbacks = await dataService.getFeedbacksByCourse(id);

    res.status(200).json({
      success: true,
      course,
      enrollment,
      assessments: assessments.map((a) => ({
        id: a.id,
        title: a.title,
        durationMinutes: a.durationMinutes,
        deadline: a.deadline,
        passingPercentage: a.passingPercentage,
        questionsCount: a.questions ? a.questions.length : 0,
        totalMarks: a.totalMarks
      })),
      feedbacks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch course details.", error: error.message });
  }
};

export const enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const course = await dataService.getCourseById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    const existingEnrollment = await dataService.getEnrollment(userId, id);
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: "You are already enrolled in this course." });
    }

    const newEnrollment = {
      id: `enr-${uuidv4().substring(0, 8)}`,
      userId,
      courseId: id,
      enrolledAt: new Date().toISOString(),
      completedModules: [],
      progressPercentage: 0,
      status: "in-progress"
    };

    await dataService.createEnrollment(newEnrollment);

    res.status(201).json({
      success: true,
      message: `Enrolled successfully in ${course.title}!`,
      enrollment: newEnrollment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Enrollment failed.", error: error.message });
  }
};

export const updateModuleProgress = async (req, res) => {
  try {
    const { id } = req.params; // courseId
    const { moduleId } = req.body;
    const userId = req.user.id;

    const course = await dataService.getCourseById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    const enrollment = await dataService.getEnrollment(userId, id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "You are not enrolled in this course." });
    }

    let completedModules = enrollment.completedModules || [];
    if (!completedModules.includes(moduleId)) {
      completedModules.push(moduleId);
    }

    const totalModules = (course.modules && course.modules.length) || 1;
    const progressPercentage = Math.min(100, Math.round((completedModules.length / totalModules) * 100));
    const status = progressPercentage === 100 ? "completed" : "in-progress";

    const updated = await dataService.updateEnrollment(enrollment.id, {
      completedModules,
      progressPercentage,
      status
    });

    res.status(200).json({
      success: true,
      message: "Progress updated successfully.",
      enrollment: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update progress.", error: error.message });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await dataService.getEnrollmentsByUser(userId);
    const allCourses = await dataService.getCourses();
    const allAssessments = await dataService.getAssessments();

    const myCourses = enrollments.map((enr) => {
      const course = allCourses.find((c) => c.id === enr.courseId);
      return {
        ...course,
        enrollment: enr,
        assessmentId: allAssessments.find((assessment) => assessment.courseId === enr.courseId)?.id || null
      };
    }).filter((c) => c.id);

    res.status(200).json({ success: true, courses: myCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve enrolled courses.", error: error.message });
  }
};

export const addCourseFeedback = async (req, res) => {
  try {
    const { id } = req.params; // courseId
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    const validation = validateFeedback({ courseId: id, rating, comment });
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: validation.errors.join(", ") });
    }

    const newFeedback = {
      id: `fb-${uuidv4().substring(0, 8)}`,
      courseId: id,
      userId,
      userName,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };

    await dataService.createFeedback(newFeedback);

    // recalculate course average rating
    const allFeedbacks = await dataService.getFeedbacksByCourse(id);
    const avgRating = (allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / allFeedbacks.length).toFixed(1);
    await dataService.updateCourse(id, { rating: parseFloat(avgRating) });

    res.status(201).json({
      success: true,
      message: "Thank you for your valuable feedback!",
      feedback: newFeedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to submit feedback.", error: error.message });
  }
};

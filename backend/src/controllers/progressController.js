import { dataService } from "../services/dataService.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await dataService.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    const enrollment = await dataService.getEnrollment(userId, courseId);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "You are not enrolled in this course." });
    }

    res.status(200).json({
      success: true,
      progress: {
        courseId,
        userId,
        progressPercentage: enrollment.progressPercentage,
        completedModules: enrollment.completedModules || [],
        completedLessons: enrollment.completedLessons || [],
        status: enrollment.status,
        lastActive: new Date().toISOString()
      },
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve course progress.", error: error.message });
  }
};

export const updateCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { moduleId, lessonId, percentage } = req.body;
    const userId = req.user.id;

    const course = await dataService.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    const enrollment = await dataService.getEnrollment(userId, courseId);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "You are not enrolled in this course." });
    }

    let completedModules = enrollment.completedModules || [];
    let completedLessons = enrollment.completedLessons || [];

    if (moduleId && !completedModules.includes(moduleId)) {
      completedModules.push(moduleId);
    }
    if (lessonId && !completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    const totalModules = (course.modules && course.modules.length) || 1;
    const calculatedPercentage = percentage !== undefined
      ? Number(percentage)
      : Math.min(100, Math.round((completedModules.length / totalModules) * 100));

    const status = calculatedPercentage >= 100 ? "completed" : "in-progress";

    const updated = await dataService.updateEnrollment(enrollment.id, {
      completedModules,
      completedLessons,
      progressPercentage: calculatedPercentage,
      status
    });

    res.status(200).json({
      success: true,
      message: "Progress recorded successfully.",
      enrollment: updated,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update progress.", error: error.message });
  }
};

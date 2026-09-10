import { v4 as uuidv4 } from "uuid";
import { dataService } from "../services/dataService.js";
import { emailService } from "../services/emailService.js";

export const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.body.courseId || req.params.courseId || req.params.id;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID is required to enroll." });
    }

    const course = await dataService.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    const existingEnrollment = await dataService.getEnrollment(userId, courseId);
    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course.",
        enrollment: existingEnrollment
      });
    }

    const newEnrollment = {
      id: `enr-${uuidv4().substring(0, 8)}`,
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      completedModules: [],
      completedLessons: [],
      progressPercentage: 0,
      status: "in-progress"
    };

    await dataService.createEnrollment(newEnrollment);
    await emailService.sendEnrollmentConfirmation(req.user, course);

    res.status(201).json({
      success: true,
      message: `Successfully enrolled in ${course.title}!`,
      enrollment: newEnrollment,
      data: newEnrollment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Enrollment failed.", error: error.message });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await dataService.getEnrollmentsByUser(userId);
    const allCourses = await dataService.getCourses();

    const enrolledCourses = enrollments.map((enr) => {
      const course = allCourses.find((c) => c.id === enr.courseId);
      return {
        ...course,
        enrollment: enr
      };
    }).filter((c) => c.id);

    res.status(200).json({
      success: true,
      count: enrolledCourses.length,
      courses: enrolledCourses,
      data: enrolledCourses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve enrollments.", error: error.message });
  }
};

export const getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollments = await dataService.getEnrollments();
    const enrollment = enrollments.find((e) => e.id === id);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment record not found." });
    }

    // Trainees can only view their own enrollment, trainers/admins can view any
    if (req.user.role === "trainee" && enrollment.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden: Cannot view another trainee's enrollment." });
    }

    const course = await dataService.getCourseById(enrollment.courseId);

    res.status(200).json({
      success: true,
      enrollment: { ...enrollment, course },
      data: { ...enrollment, course }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch enrollment.", error: error.message });
  }
};

import { dataService } from "../services/dataService.js";

export const getTraineeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await dataService.getEnrollmentsByUser(userId);
    const allCourses = await dataService.getCourses();
    const submissions = await dataService.getSubmissionsByUser(userId);
    const announcements = await dataService.getAnnouncements();
    const library = await dataService.getLibraryResources();

    const enrolledCourses = enrollments.map((enr) => {
      const course = allCourses.find((c) => c.id === enr.courseId);
      return { ...course, enrollment: enr };
    }).filter((c) => c.id);

    const completed = enrollments.filter((e) => e.status === "completed").length;
    const inProgress = enrollments.filter((e) => e.status === "in-progress").length;
    const certificates = req.user.certificates || [];

    res.status(200).json({
      success: true,
      stats: {
        enrolledCount: enrollments.length,
        completedCount: completed,
        inProgressCount: inProgress,
        certificatesCount: certificates.length
      },
      enrolledCourses,
      recentAnnouncements: announcements.slice(0, 3),
      recentLibrary: library.slice(0, 2),
      submissions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch trainee dashboard.", error: error.message });
  }
};

export const getTraineeCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await dataService.getUserById(userId);
    res.status(200).json({
      success: true,
      certificates: user?.certificates || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch certificates.", error: error.message });
  }
};

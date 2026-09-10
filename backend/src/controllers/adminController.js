import { v4 as uuidv4 } from "uuid";
import { dataService } from "../services/dataService.js";

export const getDashboardStats = async (req, res) => {
  try {
    const users = await dataService.getUsers();
    const courses = await dataService.getCourses();
    const enrollments = await dataService.getEnrollments();
    const submissions = await dataService.getSubmissions();
    const announcements = await dataService.getAnnouncements();

    const trainees = users.filter((u) => u.role === "trainee");
    const trainers = users.filter((u) => u.role === "trainer");
    const pendingUsers = users.filter((u) => u.status === "pending");

    const completedEnrollments = enrollments.filter((e) => e.status === "completed");
    const completionRate = enrollments.length > 0
      ? Math.round((completedEnrollments.length / enrollments.length) * 100)
      : 0;

    const totalCertificatesIssued = submissions.filter((s) => s.passed).length;
    const avgQuizScore = submissions.length > 0
      ? Math.round(submissions.reduce((sum, s) => sum + s.percentage, 0) / submissions.length)
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalTrainees: trainees.length,
        totalTrainers: trainers.length,
        pendingApprovals: pendingUsers.length,
        totalCourses: courses.length,
        totalEnrollments: enrollments.length,
        completedEnrollments: completedEnrollments.length,
        completionRate,
        totalCertificatesIssued,
        avgQuizScore,
        activeAnnouncements: announcements.length
      },
      recentUsers: users.slice(-5).reverse().map((u) => {
        const { password, ...safe } = u;
        return safe;
      }),
      recentEnrollments: enrollments.slice(-5).reverse()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load dashboard stats.", error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    let users = await dataService.getUsers();

    if (role && role !== "all") {
      users = users.filter((u) => u.role === role);
    }
    if (status && status !== "all") {
      users = users.filter((u) => u.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter((u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.organization && u.organization.toLowerCase().includes(q)) ||
        (u.department && u.department.toLowerCase().includes(q))
      );
    }

    const safeUsers = users.map((u) => {
      const { password, ...safe } = u;
      return safe;
    });

    res.status(200).json({ success: true, count: safeUsers.length, users: safeUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users.", error: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body;

    const user = await dataService.getUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const updates = {};
    if (status) updates.status = status;
    if (role) updates.role = role;

    const updated = await dataService.updateUser(id, updates);
    const { password, ...safe } = updated;

    res.status(200).json({
      success: true,
      message: `User ${safe.name} status updated to '${safe.status}' (Role: ${safe.role}).`,
      user: safe
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update user status.", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot delete your own administrative account." });
    }
    await dataService.deleteUser(id);
    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user.", error: error.message });
  }
};

// Competency Mapping Engine for MoES / IMD
export const getCompetencyMapping = async (req, res) => {
  try {
    const { subject, minExperience } = req.query;
    const users = await dataService.getUsers();
    const trainers = users.filter((u) => u.role === "trainer" && u.status === "approved");
    const courses = await dataService.getCourses();

    const mappedTrainers = trainers.map((tr) => {
      const trainerCourses = courses.filter((c) => c.trainerId === tr.id);
      const avgCourseRating = trainerCourses.length > 0
        ? (trainerCourses.reduce((sum, c) => sum + (c.rating || 4.5), 0) / trainerCourses.length).toFixed(1)
        : "4.8";

      // Calculate matching score if subject search is present
      let matchScore = 75; // baseline qualified score
      if (subject) {
        const subLower = subject.toLowerCase();
        const skillsString = (tr.skills || []).join(" ").toLowerCase();
        const qualString = (tr.qualifications || "").toLowerCase();
        const expString = (tr.experience || "").toLowerCase();

        let matches = 0;
        if (skillsString.includes(subLower)) matches += 20;
        if (qualString.includes(subLower)) matches += 15;
        if (expString.includes(subLower)) matches += 10;
        matchScore = Math.min(99, matchScore + matches);
      }

      return {
        id: tr.id,
        name: tr.name,
        email: tr.email,
        organization: tr.organization,
        department: tr.department,
        designation: tr.designation,
        skills: tr.skills || [],
        qualifications: tr.qualifications || "Not specified",
        experience: tr.experience || "Not specified",
        interests: tr.interests || [],
        coursesTaughtCount: trainerCourses.length,
        avgRating: parseFloat(avgCourseRating),
        matchScore
      };
    });

    // Sort by match score descending
    mappedTrainers.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      querySubject: subject || "All Competencies",
      totalTrainers: mappedTrainers.length,
      trainers: mappedTrainers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Competency mapping search failed.", error: error.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await dataService.getAnnouncements();
    res.status(200).json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch announcements.", error: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required." });
    }

    const newAnnouncement = {
      id: `anc-${uuidv4().substring(0, 8)}`,
      title,
      content,
      category: category || "General",
      priority: priority || "medium",
      authorName: req.user.name,
      publishedAt: new Date().toISOString(),
      active: true
    };

    await dataService.createAnnouncement(newAnnouncement);

    res.status(201).json({
      success: true,
      message: "Announcement broadcasted successfully to all trainees and trainers.",
      announcement: newAnnouncement
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to broadcast announcement.", error: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await dataService.deleteAnnouncement(id);
    res.status(200).json({ success: true, message: "Announcement removed." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete announcement.", error: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const courses = await dataService.getCourses();
    const enrollments = await dataService.getEnrollments();
    const submissions = await dataService.getSubmissions();
    const users = await dataService.getUsers();

    // Grouping stats by course category
    const categoryStats = {};
    courses.forEach((c) => {
      if (!categoryStats[c.category]) {
        categoryStats[c.category] = { category: c.category, courses: 0, enrollments: 0 };
      }
      categoryStats[c.category].courses += 1;
      categoryStats[c.category].enrollments += (c.enrolledCount || 0);
    });

    res.status(200).json({
      success: true,
      reportDate: new Date().toISOString(),
      executiveSummary: {
        totalEnrolledTrainees: enrollments.length,
        certifiedCandidates: submissions.filter((s) => s.passed).length,
        overallPassingRate: submissions.length > 0
          ? `${Math.round((submissions.filter((s) => s.passed).length / submissions.length) * 100)}%`
          : "N/A"
      },
      categoryBreakdown: Object.values(categoryStats),
      topPerformingCourses: courses.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        enrolledCount: c.enrolledCount,
        rating: c.rating
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to generate report.", error: error.message });
  }
};

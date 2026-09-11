const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.data = data.data;
    error.verification = data.verification;
    throw error;
  }

  return data;
};

export const api = {
  // Auth
  login: (credentials) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  signup: (userData) => apiRequest("/auth/signup", { method: "POST", body: JSON.stringify(userData) }),
  getProfile: () => apiRequest("/auth/me"),
  updateProfile: (profileData) => apiRequest("/auth/profile", { method: "PUT", body: JSON.stringify(profileData) }),

  // Courses
  getCourses: (params = "") => apiRequest(`/courses${params ? `?${params}` : ""}`),
  getCourseDetails: (id) => apiRequest(`/courses/${id}`),
  enrollCourse: (id) => apiRequest(`/courses/${id}/enroll`, { method: "POST" }),
  updateCourseProgress: (id, moduleId) => apiRequest(`/courses/${id}/progress`, { method: "POST", body: JSON.stringify({ moduleId }) }),
  getMyCourses: () => apiRequest("/courses/my-courses"),
  submitCourseFeedback: (id, feedback) => apiRequest(`/courses/${id}/feedback`, { method: "POST", body: JSON.stringify(feedback) }),

  // Assessments
  getAssessment: (id) => apiRequest(`/assessments/${id}`),
  submitAssessment: (id, answers) => apiRequest(`/assessments/${id}/submit`, { method: "POST", body: JSON.stringify({ answers }) }),
  getMySubmissions: () => apiRequest("/assessments/my-submissions"),
  downloadCertificate: async (certificateId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/certificates/${encodeURIComponent(certificateId)}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Certificate download failed.");
    }
    return response.blob();
  },

  // Trainer
  getTrainerCourses: () => apiRequest("/trainer/courses"),
  verifyVideo: (video) => apiRequest("/trainer/verify-video", { method: "POST", body: JSON.stringify(video) }),
  getYouTubeMetadata: (url) => apiRequest(`/trainer/youtube-metadata?url=${encodeURIComponent(url)}`),
  createCourse: (course) => apiRequest("/trainer/courses", { method: "POST", body: JSON.stringify(course) }),
  updateCourse: (id, course) => apiRequest(`/trainer/courses/${id}`, { method: "PUT", body: JSON.stringify(course) }),
  getTrainerAssessments: () => apiRequest("/trainer/assessments"),
  createAssessment: (assessment) => apiRequest("/trainer/assessments", { method: "POST", body: JSON.stringify(assessment) }),
  getTraineeProgress: () => apiRequest("/trainer/trainee-progress"),
  getLibrary: () => apiRequest("/trainer/library"),
  uploadLibraryResource: (resource) => apiRequest("/trainer/library", { method: "POST", body: JSON.stringify(resource) }),
  deleteLibraryResource: (id) => apiRequest(`/trainer/library/${id}`, { method: "DELETE" }),

  // Upload
  uploadFile: (formData) => apiRequest("/upload", { method: "POST", body: formData }),

  // Progress & Trainee
  getProgress: (courseId) => apiRequest(`/progress/${courseId}`),
  updateProgress: (courseId, progressData) => apiRequest(`/progress/${courseId}`, { method: "PUT", body: JSON.stringify(progressData) }),
  getEnrollments: () => apiRequest("/enrollments/my-courses"),
  getTraineeDashboard: () => apiRequest("/trainee/dashboard"),

  // Admin
  getAdminStats: () => apiRequest("/admin/stats"),
  getAdminUsers: (params = "") => apiRequest(`/admin/users${params ? `?${params}` : ""}`),
  updateUserStatus: (id, updates) => apiRequest(`/admin/users/${id}/status`, { method: "PUT", body: JSON.stringify(updates) }),
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, { method: "DELETE" }),
  getCompetencyMapping: (subject = "") => apiRequest(`/admin/competency-mapping${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`),
  getAnnouncements: () => apiRequest("/announcements"),
  createAnnouncement: (data) => apiRequest("/admin/announcements", { method: "POST", body: JSON.stringify(data) }),
  deleteAnnouncement: (id) => apiRequest(`/admin/announcements/${id}`, { method: "DELETE" }),
  getReports: () => apiRequest("/admin/reports")
};

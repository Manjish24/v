import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createSeedData } from "../utils/seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "../../data_store.json");

class DataService {
  constructor() {
    this.data = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
        this.data = JSON.parse(fileContent);
      } else {
        this.data = await createSeedData();
        this.save();
      }
    } catch (err) {
      console.warn("Failed to load data store file, re-initializing from seed data:", err.message);
      this.data = await createSeedData();
      this.save();
    }

    this.isInitialized = true;
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving data store:", err.message);
    }
  }

  // Users
  async getUsers() {
    await this.init();
    return this.data.users;
  }

  async getUserById(id) {
    await this.init();
    return this.data.users.find((u) => u.id === id);
  }

  async getUserByEmail(email) {
    await this.init();
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async createUser(userData) {
    await this.init();
    this.data.users.push(userData);
    this.save();
    return userData;
  }

  async updateUser(id, updates) {
    await this.init();
    const index = this.data.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.save();
    return this.data.users[index];
  }

  async deleteUser(id) {
    await this.init();
    this.data.users = this.data.users.filter((u) => u.id !== id);
    this.save();
    return true;
  }

  // Courses
  async getCourses() {
    await this.init();
    return this.data.courses;
  }

  async getCourseById(id) {
    await this.init();
    return this.data.courses.find((c) => c.id === id);
  }

  async createCourse(courseData) {
    await this.init();
    this.data.courses.unshift(courseData);
    this.save();
    return courseData;
  }

  async updateCourse(id, updates) {
    await this.init();
    const index = this.data.courses.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.data.courses[index] = { ...this.data.courses[index], ...updates };
    this.save();
    return this.data.courses[index];
  }

  async deleteCourse(id) {
    await this.init();
    this.data.courses = this.data.courses.filter((c) => c.id !== id);
    this.save();
    return true;
  }

  // Enrollments
  async getEnrollments() {
    await this.init();
    return this.data.enrollments;
  }

  async getEnrollment(userId, courseId) {
    await this.init();
    return this.data.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
  }

  async getEnrollmentsByUser(userId) {
    await this.init();
    return this.data.enrollments.filter((e) => e.userId === userId);
  }

  async getEnrollmentsByCourse(courseId) {
    await this.init();
    return this.data.enrollments.filter((e) => e.courseId === courseId);
  }

  async createEnrollment(enrollmentData) {
    await this.init();
    this.data.enrollments.push(enrollmentData);
    // increment course enrolledCount
    const course = this.data.courses.find((c) => c.id === enrollmentData.courseId);
    if (course) {
      course.enrolledCount = (course.enrolledCount || 0) + 1;
    }
    this.save();
    return enrollmentData;
  }

  async updateEnrollment(id, updates) {
    await this.init();
    const index = this.data.enrollments.findIndex((e) => e.id === id);
    if (index === -1) return null;
    this.data.enrollments[index] = { ...this.data.enrollments[index], ...updates };
    this.save();
    return this.data.enrollments[index];
  }

  // Assessments
  async getAssessments() {
    await this.init();
    return this.data.assessments;
  }

  async getAssessmentById(id) {
    await this.init();
    return this.data.assessments.find((a) => a.id === id);
  }

  async getAssessmentsByCourse(courseId) {
    await this.init();
    return this.data.assessments.filter((a) => a.courseId === courseId);
  }

  async createAssessment(assessmentData) {
    await this.init();
    this.data.assessments.unshift(assessmentData);
    this.save();
    return assessmentData;
  }

  // Submissions
  async getSubmissions() {
    await this.init();
    return this.data.submissions;
  }

  async getSubmissionsByUser(userId) {
    await this.init();
    return this.data.submissions.filter((s) => s.userId === userId);
  }

  async getSubmissionsByAssessment(assessmentId) {
    await this.init();
    return this.data.submissions.filter((s) => s.assessmentId === assessmentId);
  }

  async createSubmission(submissionData) {
    await this.init();
    this.data.submissions.push(submissionData);
    this.save();
    return submissionData;
  }

  // Trainer Library
  async getLibraryResources() {
    await this.init();
    return this.data.trainerLibrary;
  }

  async createLibraryResource(resourceData) {
    await this.init();
    this.data.trainerLibrary.unshift(resourceData);
    this.save();
    return resourceData;
  }

  async deleteLibraryResource(id) {
    await this.init();
    this.data.trainerLibrary = this.data.trainerLibrary.filter((r) => r.id !== id);
    this.save();
    return true;
  }

  // Announcements
  async getAnnouncements() {
    await this.init();
    return this.data.announcements;
  }

  async createAnnouncement(announcementData) {
    await this.init();
    this.data.announcements.unshift(announcementData);
    this.save();
    return announcementData;
  }

  async deleteAnnouncement(id) {
    await this.init();
    this.data.announcements = this.data.announcements.filter((a) => a.id !== id);
    this.save();
    return true;
  }

  // Feedbacks
  async getFeedbacks() {
    await this.init();
    return this.data.feedbacks;
  }

  async getFeedbacksByCourse(courseId) {
    await this.init();
    return this.data.feedbacks.filter((f) => f.courseId === courseId);
  }

  async createFeedback(feedbackData) {
    await this.init();
    this.data.feedbacks.unshift(feedbackData);
    this.save();
    return feedbackData;
  }
}

export const dataService = new DataService();

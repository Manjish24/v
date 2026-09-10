import { dataService } from "./dataService.js";

export const courseService = {
  getAllCourses: async (filters = {}) => {
    let courses = await dataService.getCourses();
    if (filters.category && filters.category !== "All") {
      courses = courses.filter((c) => c.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.level && filters.level !== "All") {
      courses = courses.filter((c) => c.level.toLowerCase() === filters.level.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      courses = courses.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.trainerName.toLowerCase().includes(q)
      );
    }
    return courses;
  },
  getCourseById: async (id) => {
    return await dataService.getCourseById(id);
  },
  createCourse: async (courseData) => {
    return await dataService.createCourse(courseData);
  },
  updateCourse: async (id, updates) => {
    return await dataService.updateCourse(id, updates);
  },
  deleteCourse: async (id) => {
    return await dataService.deleteCourse(id);
  }
};

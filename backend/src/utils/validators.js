export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return typeof password === "string" && password.length >= 6;
};

export const validateSignupInput = (data) => {
  const errors = [];
  if (!data.name || data.name.trim().length === 0) errors.push("Name is required");
  if (!data.email || !validateEmail(data.email)) errors.push("Valid email address is required");
  if (!data.password || !validatePassword(data.password)) errors.push("Password must be at least 6 characters long");
  if (data.role && !["trainee", "trainer", "admin"].includes(data.role)) {
    errors.push("Invalid role specified. Role must be trainee, trainer, or admin.");
  }
  return { isValid: errors.length === 0, errors };
};

export const validateCourseInput = (data) => {
  const errors = [];
  if (!data.title || data.title.trim().length === 0) errors.push("Course title is required");
  if (!data.category || data.category.trim().length === 0) errors.push("Category is required");
  return { isValid: errors.length === 0, errors };
};

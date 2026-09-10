// Feedback model schema
export const validateFeedback = (fb) => {
  const errors = [];
  if (!fb.courseId) errors.push("Course ID is required");
  if (!fb.rating || fb.rating < 1 || fb.rating > 5) errors.push("Rating must be between 1 and 5");
  if (!fb.comment) errors.push("Comment is required");
  return { isValid: errors.length === 0, errors };
};

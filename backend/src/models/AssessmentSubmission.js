// Assessment Submission model
export const calculateScore = (questions, answers) => {
  let score = 0;
  let totalMarks = 0;
  questions.forEach((q) => {
    totalMarks += (q.marks || 10);
    if (answers[q.id] !== undefined && Number(answers[q.id]) === q.correctOptionIndex) {
      score += (q.marks || 10);
    }
  });
  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
  return { score, totalMarks, percentage };
};

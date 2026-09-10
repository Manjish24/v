import { v4 as uuidv4 } from 'uuid';
import { memoryStore } from '../config/db.js';

export function getAssessmentById(req, res) {
  try {
    const { id } = req.params;
    const assessment = memoryStore.assessments.find(a => a.id === id);

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    const course = memoryStore.courses.find(c => c.id === assessment.course_id);
    const questions = memoryStore.questions.filter(q => q.assessment_id === assessment.id);

    // Check if current user already submitted
    let userResult = null;
    if (req.user) {
      userResult = memoryStore.assessmentResults.find(r => r.assessment_id === id && r.trainee_id === req.user.id);
    }

    // Critical Security Rule (Section 15): Strip correct_option for trainees who haven't submitted yet!
    const sanitizedQuestions = questions.map(q => {
      const isPrivileged = req.user && (req.user.role === 'TRAINER' || req.user.role === 'ADMIN');
      const canSeeAnswer = isPrivileged || (userResult !== null);

      return {
        id: q.id,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        marks: q.marks,
        ...(canSeeAnswer ? { correct_option: q.correct_option } : {})
      };
    });

    return res.json({
      success: true,
      data: {
        ...assessment,
        course_title: course?.title || 'Course',
        questions: sanitizedQuestions,
        already_submitted: !!userResult,
        user_result: userResult
      }
    });
  } catch (error) {
    console.error('getAssessmentById error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving assessment.' });
  }
}

export function submitAssessment(req, res) {
  try {
    const { id } = req.params;
    const traineeId = req.user.id;
    const { answers } = req.body; // e.g. { "q1_id": "B", "q2_id": "C" }

    const assessment = memoryStore.assessments.find(a => a.id === id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    // Rule 1: Deadline Validation Server-Side (Section 15 & 58)
    const deadline = new Date(assessment.deadline);
    const now = new Date();
    if (now > deadline) {
      return res.status(400).json({
        success: false,
        message: 'The submission deadline for this assessment has passed. Submissions are closed.'
      });
    }

    // Rule 2: Prevent duplicate submission
    const existing = memoryStore.assessmentResults.find(r => r.assessment_id === id && r.trainee_id === traineeId);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this assessment. Multiple attempts are not permitted.'
      });
    }

    // Rule 3: Server-side scoring (Section 15)
    const questions = memoryStore.questions.filter(q => q.assessment_id === assessment.id);
    let score = 0;
    let totalMarks = 0;

    questions.forEach(q => {
      const qMarks = Number(q.marks) || 10;
      totalMarks += qMarks;

      const submittedAnswer = (answers && answers[q.id]) ? String(answers[q.id]).toUpperCase() : null;
      if (submittedAnswer === q.correct_option) {
        score += qMarks;
      }
    });

    const percentage = totalMarks > 0 ? parseFloat(((score / totalMarks) * 100).toFixed(1)) : 0;

    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 50) grade = 'C';

    const result = {
      id: uuidv4(),
      assessment_id: assessment.id,
      trainee_id: traineeId,
      score,
      total_marks: totalMarks,
      percentage,
      grade,
      answers: answers || {},
      submitted_at: new Date().toISOString()
    };

    memoryStore.assessmentResults.push(result);

    // Update enrollment completion if passing
    const enrollment = memoryStore.enrollments.find(e => e.course_id === assessment.course_id && e.trainee_id === traineeId);
    if (enrollment) {
      enrollment.completion_percentage = 100;
      enrollment.status = 'COMPLETED';
      enrollment.completed_at = new Date().toISOString();
    }

    return res.status(201).json({
      success: true,
      message: 'Assessment submitted and scored successfully.',
      data: {
        result,
        passed: score >= (assessment.passing_marks || Math.round(totalMarks * 0.5)),
        passing_marks: assessment.passing_marks || Math.round(totalMarks * 0.5)
      }
    });
  } catch (error) {
    console.error('submitAssessment error:', error);
    res.status(500).json({ success: false, message: 'Server error scoring assessment.' });
  }
}

export function getAssessmentResult(req, res) {
  try {
    const { id } = req.params;
    const traineeId = req.query.trainee_id || req.user.id;

    const result = memoryStore.assessmentResults.find(r => r.assessment_id === id && r.trainee_id === traineeId);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found.' });
    }

    const assessment = memoryStore.assessments.find(a => a.id === id);
    const course = assessment ? memoryStore.courses.find(c => c.id === assessment.course_id) : null;

    return res.json({
      success: true,
      data: {
        ...result,
        assessment_title: assessment?.title,
        course_title: course?.title
      }
    });
  } catch (error) {
    console.error('getAssessmentResult error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving assessment result.' });
  }
}

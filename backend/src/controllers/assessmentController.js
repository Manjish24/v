import { v4 as uuidv4 } from "uuid";
import { dataService } from "../services/dataService.js";
import { calculateScore } from "../models/AssessmentSubmission.js";

const createCertificateId = () =>
  `CERT-IMD-${new Date().getFullYear()}-${uuidv4().replace(/-/g, "").slice(0, 8).toUpperCase()}`;

export const getAssessmentForTaking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const assessment = await dataService.getAssessmentById(id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found." });
    }

    const enrollment = await dataService.getEnrollment(userId, assessment.courseId);
    if (!enrollment) {
      return res.status(403).json({ success: false, message: "Enroll in this course before taking its assessment." });
    }
    if (enrollment.status !== "completed" || enrollment.progressPercentage < 100) {
      return res.status(403).json({
        success: false,
        message: "Complete every course module before taking the certification assessment."
      });
    }

    // Check if user has already submitted this assessment
    const submissions = await dataService.getSubmissionsByUser(req.user.id);
    const existingSubmission = submissions.find((s) => s.assessmentId === id);

    // If trainee and not submitted, strip the correctOptionIndex and explanations
    const safeQuestions = assessment.questions.map((q) => {
      if (req.user.role === "trainee" && !existingSubmission) {
        const { correctOptionIndex, explanation, ...publicQ } = q;
        return publicQ;
      }
      return q;
    });

    res.status(200).json({
      success: true,
      assessment: {
        ...assessment,
        questions: safeQuestions
      },
      existingSubmission: existingSubmission || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load assessment.", error: error.message });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // map of questionId -> selectedOptionIndex
    const userId = req.user.id;
    const traineeName = req.user.name;

    const assessment = await dataService.getAssessmentById(id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found." });
    }

    const enrollment = await dataService.getEnrollment(userId, assessment.courseId);
    if (!enrollment || enrollment.status !== "completed" || enrollment.progressPercentage < 100) {
      return res.status(403).json({
        success: false,
        message: "Complete every course module before taking the certification assessment."
      });
    }

    // Check if already passed
    const userSubmissions = await dataService.getSubmissionsByUser(userId);
    const prevPassed = userSubmissions.find((s) => s.assessmentId === id && s.passed);
    if (prevPassed) {
      return res.status(400).json({
        success: false,
        message: "You have already passed this assessment and received certification.",
        submission: prevPassed
      });
    }

    const { score, totalMarks, percentage } = calculateScore(assessment.questions, answers || {});
    const passingPercentage = assessment.passingPercentage || 60;
    const passed = percentage >= passingPercentage;

    let certificateId = null;
    if (passed) {
      certificateId = enrollment.certificateId || createCertificateId();
      const issuedAt = enrollment.certificateIssuedAt || new Date().toISOString();
      const course = await dataService.getCourseById(assessment.courseId);

      // Store the credential with the enrollment so it remains tied to this completed course.
      await dataService.updateEnrollment(enrollment.id, {
        certificateId,
        certificateIssuedAt: issuedAt,
        certificateScore: percentage,
        assessmentId: assessment.id
      });

      // Keep the profile credential list in sync without creating duplicates.
      const user = await dataService.getUserById(userId);
      const certificates = user.certificates || [];
      const certificate = {
        certificateId,
        title: `${course?.title || assessment.courseTitle} - Competency Certification`,
        courseTitle: course?.title || assessment.courseTitle,
        assessmentTitle: assessment.title,
        issuer: "Ministry of Earth Sciences & India Meteorological Department",
        score: percentage,
        issueDate: issuedAt,
        courseId: assessment.courseId
      };
      const existingCertificateIndex = certificates.findIndex((item) => item.certificateId === certificateId);
      if (existingCertificateIndex >= 0) certificates[existingCertificateIndex] = certificate;
      else certificates.push(certificate);
      await dataService.updateUser(userId, { certificates });
    }

    const submissionRecord = {
      id: `sub-${uuidv4().substring(0, 8)}`,
      assessmentId: id,
      courseId: assessment.courseId,
      courseTitle: assessment.courseTitle,
      assessmentTitle: assessment.title,
      userId,
      traineeName,
      score,
      totalMarks,
      percentage,
      passed,
      certificateId,
      submittedAt: new Date().toISOString(),
      answers: answers || {}
    };

    await dataService.createSubmission(submissionRecord);

    res.status(201).json({
      success: true,
      message: passed
        ? `Congratulations! You scored ${percentage}% and earned your MoES/IMD Competency Certificate.`
        : `You scored ${percentage}%. The passing threshold is ${passingPercentage}%. Review the explanations and try again.`,
      submission: submissionRecord,
      reviewQuestions: assessment.questions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Submission failed.", error: error.message });
  }
};

export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await dataService.getSubmissionsByUser(req.user.id);
    res.status(200).json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load submissions.", error: error.message });
  }
};

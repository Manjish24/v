import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { memoryStore } from '../config/db.js';

/**
 * Certificate issuance endpoint
 * Verifies all eligibility conditions server-side before issuing
 */
export function issueCertificate(req, res) {
  try {
    const { course_id } = req.body;
    const traineeId = req.user.id;

    if (!course_id) {
      return res.status(400).json({ success: false, message: 'Course ID is required.' });
    }

    const course = memoryStore.courses.find(c => c.id === course_id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Eligibility Check 1: Enrolled in course
    const enrollment = memoryStore.enrollments.find(e => e.course_id === course_id && e.trainee_id === traineeId);
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Eligibility failed: You are not enrolled in this course.'
      });
    }

    // Eligibility Check 2: Course must be marked completed (or 100% progress)
    if (enrollment.status !== 'COMPLETED' && enrollment.completion_percentage < 100) {
      return res.status(403).json({
        success: false,
        message: 'Eligibility failed: You must complete 100% of the course modules before requesting a certificate.'
      });
    }

    // Eligibility Check 3: Passing required assessments
    const courseAssessments = memoryStore.assessments.filter(a => a.course_id === course_id);
    if (courseAssessments.length > 0) {
      const assessmentIds = courseAssessments.map(a => a.id);
      const passedResults = memoryStore.assessmentResults.filter(r =>
        assessmentIds.includes(r.assessment_id) &&
        r.trainee_id === traineeId &&
        r.score >= (courseAssessments.find(a => a.id === r.assessment_id)?.passing_marks || 0)
      );

      if (passedResults.length < courseAssessments.length) {
        return res.status(403).json({
          success: false,
          message: 'Eligibility failed: You must pass all required assessments for this course with qualifying marks.'
        });
      }
    }

    // Check if certificate already exists
    const existing = memoryStore.certificates.find(c => c.course_id === course_id && c.trainee_id === traineeId);
    if (existing) {
      return res.json({
        success: true,
        message: 'Certificate already issued for this course.',
        data: existing
      });
    }

    // Generate high-entropy verification token and sequential-style certificate number
    const randomHex = crypto.randomBytes(12).toString('hex');
    const verificationToken = `cc_token_${randomHex}`;
    const certSerial = String(memoryStore.certificates.length + 109).padStart(6, '0');
    const certificateNumber = `CC-2026-${certSerial}`;

    const trainer = memoryStore.users.find(u => u.id === course.trainer_id);

    const certificate = {
      id: uuidv4(),
      certificate_number: certificateNumber,
      trainee_id: traineeId,
      trainee_name: req.user.name,
      course_id: course_id,
      course_title: course.title,
      trainer_name: trainer ? trainer.name : 'Master Instructor',
      issued_at: new Date().toISOString(),
      verification_token: verificationToken,
      certificate_url: `/verify/${verificationToken}`
    };

    memoryStore.certificates.push(certificate);

    return res.status(201).json({
      success: true,
      message: 'Certificate issued successfully!',
      data: certificate
    });
  } catch (error) {
    console.error('issueCertificate error:', error);
    res.status(500).json({ success: false, message: 'Server error issuing certificate.' });
  }
}

/**
 * Public Certificate Verification Endpoint
 * Validates authentic certificate records against the database
 */
export function verifyCertificate(req, res) {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token is required.' });
    }

    const certificate = memoryStore.certificates.find(c =>
      c.verification_token === token || c.certificate_number === token
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'Certificate could not be verified. This certificate record does not exist or may be invalid.'
      });
    }

    const trainee = memoryStore.users.find(u => u.id === certificate.trainee_id);
    const course = memoryStore.courses.find(c => c.id === certificate.course_id);
    const trainer = course ? memoryStore.users.find(u => u.id === course.trainer_id) : null;

    return res.json({
      success: true,
      verified: true,
      message: 'Official Certificate Verified Authentically on Capacity Connect Platform.',
      data: {
        certificate_number: certificate.certificate_number,
        trainee_name: certificate.trainee_name || trainee?.name,
        course_title: certificate.course_title || course?.title,
        course_subject: course?.subject,
        trainer_name: certificate.trainer_name || trainer?.name,
        issued_at: certificate.issued_at,
        verification_token: certificate.verification_token,
        issuing_authority: 'Smart India Hackathon - Capacity Connect Portal',
        status: 'VALID & AUTHENTIC'
      }
    });
  } catch (error) {
    console.error('verifyCertificate error:', error);
    res.status(500).json({ success: false, message: 'Server error during certificate verification.' });
  }
}

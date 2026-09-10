import { v4 as uuidv4 } from 'uuid';
import { memoryStore } from '../config/db.js';

export function getTraineeProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = memoryStore.users.find(u => u.id === userId);
    let profile = memoryStore.traineeProfiles.find(p => p.user_id === userId);

    if (!profile) {
      profile = {
        id: uuidv4(),
        user_id: userId,
        qualification: '',
        work_experience: '',
        interests: [],
        bio: '',
        skills: [],
        created_at: new Date().toISOString()
      };
      memoryStore.traineeProfiles.push(profile);
    }

    // Calculate profile completion percentage
    let completedFields = 0;
    const totalFields = 6;
    if (user.name) completedFields++;
    if (profile.qualification) completedFields++;
    if (profile.work_experience) completedFields++;
    if (profile.interests && profile.interests.length > 0) completedFields++;
    if (profile.skills && profile.skills.length > 0) completedFields++;
    if (profile.bio) completedFields++;

    const completionPercentage = Math.round((completedFields / totalFields) * 100);

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url
        },
        profile,
        profile_completion_percentage: completionPercentage
      }
    });
  } catch (error) {
    console.error('getTraineeProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving trainee profile.' });
  }
}

export function updateTraineeProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name, bio, qualification, work_experience, interests, skills, avatar_url } = req.body;

    const user = memoryStore.users.find(u => u.id === userId);
    if (name) user.name = name;
    if (avatar_url) user.avatar_url = avatar_url;
    if (bio !== undefined) user.bio = bio;

    let profile = memoryStore.traineeProfiles.find(p => p.user_id === userId);
    if (!profile) {
      profile = { id: uuidv4(), user_id: userId, created_at: new Date().toISOString() };
      memoryStore.traineeProfiles.push(profile);
    }

    if (qualification !== undefined) profile.qualification = qualification;
    if (work_experience !== undefined) profile.work_experience = work_experience;
    if (interests !== undefined) profile.interests = Array.isArray(interests) ? interests : [];
    if (skills !== undefined) profile.skills = Array.isArray(skills) ? skills : [];
    if (bio !== undefined) profile.bio = bio;
    profile.updated_at = new Date().toISOString();

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user, profile }
    });
  } catch (error) {
    console.error('updateTraineeProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
}

export function getMyCourses(req, res) {
  try {
    const traineeId = req.user.id;
    const enrollments = memoryStore.enrollments.filter(e => e.trainee_id === traineeId);

    const ongoing = [];
    const completed = [];

    enrollments.forEach(en => {
      const course = memoryStore.courses.find(c => c.id === en.course_id);
      if (!course) return;

      const trainer = memoryStore.users.find(u => u.id === course.trainer_id);
      const certificate = memoryStore.certificates.find(cert => cert.course_id === course.id && cert.trainee_id === traineeId);
      const feedback = memoryStore.feedback.find(f => f.course_id === course.id && f.trainee_id === traineeId);
      const assessments = memoryStore.assessments.filter(a => a.course_id === course.id);
      const results = memoryStore.assessmentResults.filter(r => r.trainee_id === traineeId && assessments.some(a => a.id === r.assessment_id));

      const courseData = {
        enrollment_id: en.id,
        course_id: course.id,
        title: course.title,
        description: course.description,
        subject: course.subject,
        difficulty: course.difficulty,
        duration: course.duration,
        thumbnail_url: course.thumbnail_url,
        trainer_name: trainer ? trainer.name : 'Instructor',
        completion_percentage: en.completion_percentage,
        enrolled_at: en.enrolled_at,
        completed_at: en.completed_at,
        status: en.status,
        has_certificate: !!certificate,
        certificate_token: certificate?.verification_token || null,
        certificate_number: certificate?.certificate_number || null,
        has_feedback: !!feedback,
        assessments_total: assessments.length,
        assessments_completed: results.length
      };

      if (en.status === 'COMPLETED' || en.completion_percentage >= 100) {
        completed.push(courseData);
      } else {
        ongoing.push(courseData);
      }
    });

    return res.json({
      success: true,
      data: { ongoing, completed }
    });
  } catch (error) {
    console.error('getMyCourses error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving enrolled courses.' });
  }
}

export function getAvailableCourses(req, res) {
  try {
    const traineeId = req.user.id;
    const published = memoryStore.courses.filter(c => c.status === 'PUBLISHED');
    const myEnrollments = memoryStore.enrollments.filter(e => e.trainee_id === traineeId);

    const available = published.map(course => {
      const enrollment = myEnrollments.find(e => e.course_id === course.id);
      const trainer = memoryStore.users.find(u => u.id === course.trainer_id);

      return {
        ...course,
        trainer_name: trainer ? trainer.name : 'Instructor',
        is_enrolled: !!enrollment,
        enrollment_status: enrollment ? enrollment.status : null,
        completion_percentage: enrollment ? enrollment.completion_percentage : 0
      };
    });

    return res.json({
      success: true,
      data: available
    });
  } catch (error) {
    console.error('getAvailableCourses error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving available courses.' });
  }
}

export function enrollInCourse(req, res) {
  try {
    const { courseId } = req.params;
    const traineeId = req.user.id;

    const course = memoryStore.courses.find(c => c.id === courseId && c.status === 'PUBLISHED');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Published course not found.' });
    }

    const existing = memoryStore.enrollments.find(e => e.course_id === courseId && e.trainee_id === traineeId);
    if (existing) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this course.' });
    }

    const enrollment = {
      id: uuidv4(),
      trainee_id: traineeId,
      course_id: courseId,
      status: 'ACTIVE',
      completion_percentage: 0,
      enrolled_at: new Date().toISOString(),
      completed_at: null
    };

    memoryStore.enrollments.push(enrollment);

    return res.status(201).json({
      success: true,
      message: `Successfully enrolled in ${course.title}!`,
      data: enrollment
    });
  } catch (error) {
    console.error('enrollInCourse error:', error);
    res.status(500).json({ success: false, message: 'Server error during course enrollment.' });
  }
}

export function updateCourseProgress(req, res) {
  try {
    const { courseId } = req.params;
    const traineeId = req.user.id;
    const { completion_percentage } = req.body;

    const enrollment = memoryStore.enrollments.find(e => e.course_id === courseId && e.trainee_id === traineeId);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found.' });
    }

    const newPercentage = Math.min(100, Math.max(0, Number(completion_percentage)));
    enrollment.completion_percentage = newPercentage;

    if (newPercentage >= 100 && enrollment.status !== 'COMPLETED') {
      enrollment.status = 'COMPLETED';
      enrollment.completed_at = new Date().toISOString();
    }

    return res.json({
      success: true,
      message: 'Course progress updated.',
      data: enrollment
    });
  } catch (error) {
    console.error('updateCourseProgress error:', error);
    res.status(500).json({ success: false, message: 'Server error updating course progress.' });
  }
}

export function getPendingAssessments(req, res) {
  try {
    const traineeId = req.user.id;
    const enrollments = memoryStore.enrollments.filter(e => e.trainee_id === traineeId);
    const enrolledCourseIds = enrollments.map(e => e.course_id);

    const now = new Date();
    const assessments = memoryStore.assessments.filter(a =>
      enrolledCourseIds.includes(a.course_id) && a.status === 'PUBLISHED'
    );

    const existingResults = memoryStore.assessmentResults.filter(r => r.trainee_id === traineeId);
    const attemptedAssessmentIds = existingResults.map(r => r.assessment_id);

    const pending = [];
    const upcoming = [];
    const completed = [];
    const expired = [];

    assessments.forEach(a => {
      const course = memoryStore.courses.find(c => c.id === a.course_id);
      const result = existingResults.find(r => r.assessment_id === a.id);
      const deadline = new Date(a.deadline);
      const isExpired = deadline < now;

      const item = {
        id: a.id,
        course_id: a.course_id,
        course_title: course ? course.title : 'Course',
        title: a.title,
        description: a.description,
        deadline: a.deadline,
        duration_minutes: a.duration_minutes,
        total_marks: a.total_marks,
        passing_marks: a.passing_marks,
        result: result || null
      };

      if (result) {
        completed.push(item);
      } else if (isExpired) {
        expired.push(item);
      } else {
        pending.push(item);
      }
    });

    return res.json({
      success: true,
      data: { pending, upcoming, completed, expired }
    });
  } catch (error) {
    console.error('getPendingAssessments error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving assessments.' });
  }
}

export function getMyResults(req, res) {
  try {
    const traineeId = req.user.id;
    const results = memoryStore.assessmentResults.filter(r => r.trainee_id === traineeId);

    const enriched = results.map(r => {
      const assessment = memoryStore.assessments.find(a => a.id === r.assessment_id);
      const course = assessment ? memoryStore.courses.find(c => c.id === assessment.course_id) : null;
      return {
        ...r,
        assessment_title: assessment ? assessment.title : 'Assessment',
        course_title: course ? course.title : 'Course',
        passing_marks: assessment?.passing_marks || 50,
        passed: r.score >= (assessment?.passing_marks || 50)
      };
    });

    return res.json({
      success: true,
      data: enriched
    });
  } catch (error) {
    console.error('getMyResults error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving results.' });
  }
}

export function getMyCertificates(req, res) {
  try {
    const traineeId = req.user.id;
    const certificates = memoryStore.certificates.filter(c => c.trainee_id === traineeId);
    return res.json({
      success: true,
      data: certificates
    });
  } catch (error) {
    console.error('getMyCertificates error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving certificates.' });
  }
}

export function raiseQuery(req, res) {
  try {
    const traineeId = req.user.id;
    const { course_id, subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required.' });
    }

    let assignedTo = null;
    let assignedName = 'Platform Administrator';
    let courseTitle = null;

    if (course_id) {
      const course = memoryStore.courses.find(c => c.id === course_id);
      if (course) {
        assignedTo = course.trainer_id;
        const trainer = memoryStore.users.find(u => u.id === course.trainer_id);
        assignedName = trainer ? trainer.name : 'Course Instructor';
        courseTitle = course.title;
      }
    }

    const newQuery = {
      id: uuidv4(),
      raised_by: traineeId,
      trainee_name: req.user.name,
      assigned_to: assignedTo,
      assigned_to_name: assignedName,
      course_id: course_id || null,
      course_title: courseTitle,
      subject,
      message,
      response: null,
      status: 'OPEN',
      created_at: new Date().toISOString(),
      resolved_at: null
    };

    memoryStore.queries.push(newQuery);

    return res.status(201).json({
      success: true,
      message: 'Query submitted successfully. The instructor or admin will respond shortly.',
      data: newQuery
    });
  } catch (error) {
    console.error('raiseQuery error:', error);
    res.status(500).json({ success: false, message: 'Server error creating query.' });
  }
}

export function getMyQueries(req, res) {
  try {
    const traineeId = req.user.id;
    const queries = memoryStore.queries.filter(q => q.raised_by === traineeId);
    return res.json({
      success: true,
      data: queries
    });
  } catch (error) {
    console.error('getMyQueries error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving queries.' });
  }
}

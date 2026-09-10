import { v4 as uuidv4 } from 'uuid';
import { memoryStore } from '../config/db.js';
import { extractYouTubeVideoId, isValidYouTubeUrl } from '../utils/youtube.js';

export function getTrainerProfile(req, res) {
  try {
    const trainerId = req.user.id;
    const user = memoryStore.users.find(u => u.id === trainerId);
    let profile = memoryStore.trainerProfiles.find(p => p.user_id === trainerId);

    if (!profile) {
      profile = {
        id: uuidv4(),
        user_id: trainerId,
        qualification: '',
        work_experience: '',
        bio: '',
        skills: [],
        competencies: [],
        created_at: new Date().toISOString()
      };
      memoryStore.trainerProfiles.push(profile);
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url,
          bio: user.bio
        },
        profile
      }
    });
  } catch (error) {
    console.error('getTrainerProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving trainer profile.' });
  }
}

export function updateTrainerProfile(req, res) {
  try {
    const trainerId = req.user.id;
    const { name, bio, qualification, work_experience, skills, competencies, avatar_url } = req.body;

    const user = memoryStore.users.find(u => u.id === trainerId);
    if (name) user.name = name;
    if (avatar_url) user.avatar_url = avatar_url;
    if (bio !== undefined) user.bio = bio;

    let profile = memoryStore.trainerProfiles.find(p => p.user_id === trainerId);
    if (!profile) {
      profile = { id: uuidv4(), user_id: trainerId, created_at: new Date().toISOString() };
      memoryStore.trainerProfiles.push(profile);
    }

    if (qualification !== undefined) profile.qualification = qualification;
    if (work_experience !== undefined) profile.work_experience = work_experience;
    if (skills !== undefined) profile.skills = Array.isArray(skills) ? skills : [];
    if (competencies !== undefined) profile.competencies = Array.isArray(competencies) ? competencies : [];
    if (bio !== undefined) profile.bio = bio;
    profile.updated_at = new Date().toISOString();

    return res.json({
      success: true,
      message: 'Trainer profile updated successfully.',
      data: { user, profile }
    });
  } catch (error) {
    console.error('updateTrainerProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error updating trainer profile.' });
  }
}

export function getTrainerCourses(req, res) {
  try {
    const trainerId = req.user.id;
    const courses = memoryStore.courses.filter(c => c.trainer_id === trainerId);

    const enriched = courses.map(course => {
      const enrollments = memoryStore.enrollments.filter(e => e.course_id === course.id);
      const completedCount = enrollments.filter(e => e.status === 'COMPLETED' || e.completion_percentage >= 100).length;
      const feedbackList = memoryStore.feedback.filter(f => f.course_id === course.id);
      const avgRating = feedbackList.length > 0
        ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length).toFixed(1)
        : null;

      return {
        ...course,
        total_enrolled: enrollments.length,
        total_completed: completedCount,
        average_rating: avgRating ? parseFloat(avgRating) : 5.0,
        materials_count: memoryStore.materials.filter(m => m.course_id === course.id).length,
        assessments_count: memoryStore.assessments.filter(a => a.course_id === course.id).length
      };
    });

    return res.json({
      success: true,
      data: enriched
    });
  } catch (error) {
    console.error('getTrainerCourses error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving trainer courses.' });
  }
}

export function createCourse(req, res) {
  try {
    const trainerId = req.user.id;
    const {
      title,
      description,
      subject,
      difficulty,
      duration,
      learning_objectives,
      prerequisites,
      status,
      thumbnail_url
    } = req.body;

    if (!title || !description || !subject || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, subject, and difficulty are required.'
      });
    }

    const courseId = uuidv4();
    const newCourse = {
      id: courseId,
      trainer_id: trainerId,
      trainer_name: req.user.name,
      title,
      description,
      subject,
      difficulty,
      duration: duration || '4 Weeks',
      learning_objectives: Array.isArray(learning_objectives) ? learning_objectives : [],
      prerequisites: Array.isArray(prerequisites) ? prerequisites : [],
      status: status || 'DRAFT',
      thumbnail_url: thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryStore.courses.push(newCourse);

    return res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      data: newCourse
    });
  } catch (error) {
    console.error('createCourse error:', error);
    res.status(500).json({ success: false, message: 'Server error creating course.' });
  }
}

export function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const trainerId = req.user.id;

    const course = memoryStore.courses.find(c => c.id === id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Security Rule (Section 45 & 58): Trainers cannot edit another trainer's course
    if (course.trainer_id !== trainerId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this course.'
      });
    }

    const {
      title,
      description,
      subject,
      difficulty,
      duration,
      learning_objectives,
      prerequisites,
      status,
      thumbnail_url
    } = req.body;

    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (subject !== undefined) course.subject = subject;
    if (difficulty !== undefined) course.difficulty = difficulty;
    if (duration !== undefined) course.duration = duration;
    if (learning_objectives !== undefined) course.learning_objectives = Array.isArray(learning_objectives) ? learning_objectives : [];
    if (prerequisites !== undefined) course.prerequisites = Array.isArray(prerequisites) ? prerequisites : [];
    if (status !== undefined) course.status = status;
    if (thumbnail_url !== undefined) course.thumbnail_url = thumbnail_url;
    course.updated_at = new Date().toISOString();

    return res.json({
      success: true,
      message: 'Course updated successfully.',
      data: course
    });
  } catch (error) {
    console.error('updateCourse error:', error);
    res.status(500).json({ success: false, message: 'Server error updating course.' });
  }
}

export function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    const trainerId = req.user.id;

    const index = memoryStore.courses.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const course = memoryStore.courses[index];
    if (course.trainer_id !== trainerId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this course.'
      });
    }

    memoryStore.courses.splice(index, 1);

    return res.json({
      success: true,
      message: 'Course deleted successfully.'
    });
  } catch (error) {
    console.error('deleteCourse error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting course.' });
  }
}

export function addCourseMaterial(req, res) {
  try {
    const { id: courseId } = req.params;
    const trainerId = req.user.id;
    const { title, type, file_url, youtube_url, description, sort_order } = req.body;

    const course = memoryStore.courses.find(c => c.id === courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.trainer_id !== trainerId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to add material to this course.' });
    }

    if (!title || !type) {
      return res.status(400).json({ success: false, message: 'Title and type are required.' });
    }

    let youtube_video_id = null;
    let final_youtube_url = null;

    if (type === 'VIDEO') {
      if (!youtube_url) {
        return res.status(400).json({ success: false, message: 'YouTube URL is required for video materials.' });
      }
      youtube_video_id = extractYouTubeVideoId(youtube_url);
      if (!youtube_video_id) {
        return res.status(400).json({
          success: false,
          message: 'Invalid YouTube URL. Please provide a valid YouTube video link.'
        });
      }
      final_youtube_url = youtube_url;
    }

    const newMaterial = {
      id: uuidv4(),
      course_id: courseId,
      trainer_id: trainerId,
      title,
      type,
      file_url: file_url || null,
      youtube_video_id,
      youtube_url: final_youtube_url,
      description: description || '',
      sort_order: sort_order || (memoryStore.materials.filter(m => m.course_id === courseId).length + 1),
      created_at: new Date().toISOString()
    };

    memoryStore.materials.push(newMaterial);

    return res.status(201).json({
      success: true,
      message: 'Course material added successfully.',
      data: newMaterial
    });
  } catch (error) {
    console.error('addCourseMaterial error:', error);
    res.status(500).json({ success: false, message: 'Server error adding course material.' });
  }
}

export function deleteCourseMaterial(req, res) {
  try {
    const { id } = req.params;
    const trainerId = req.user.id;

    const index = memoryStore.materials.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Material not found.' });
    }

    const material = memoryStore.materials[index];
    if (material.trainer_id !== trainerId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this material.' });
    }

    memoryStore.materials.splice(index, 1);

    return res.json({
      success: true,
      message: 'Material deleted successfully.'
    });
  } catch (error) {
    console.error('deleteCourseMaterial error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting material.' });
  }
}

export function createAssessment(req, res) {
  try {
    const trainerId = req.user.id;
    const {
      course_id,
      title,
      description,
      deadline,
      duration_minutes,
      passing_marks,
      questions
    } = req.body;

    if (!course_id || !title || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Course, title, and deadline are required.'
      });
    }

    const course = memoryStore.courses.find(c => c.id === course_id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.trainer_id !== trainerId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to add assessment for this course.' });
    }

    const assessmentId = uuidv4();
    const parsedQuestions = Array.isArray(questions) ? questions : [];
    const calculatedTotalMarks = parsedQuestions.reduce((acc, q) => acc + (Number(q.marks) || 10), 0);

    const newAssessment = {
      id: assessmentId,
      course_id,
      trainer_id: trainerId,
      title,
      description: description || '',
      deadline: new Date(deadline).toISOString(),
      duration_minutes: Number(duration_minutes) || 30,
      total_marks: calculatedTotalMarks || 100,
      passing_marks: Number(passing_marks) || Math.round((calculatedTotalMarks || 100) * 0.5),
      status: 'PUBLISHED',
      created_at: new Date().toISOString()
    };

    memoryStore.assessments.push(newAssessment);

    // Add questions
    parsedQuestions.forEach(q => {
      memoryStore.questions.push({
        id: uuidv4(),
        assessment_id: assessmentId,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: (q.correct_option || 'A').toUpperCase(),
        marks: Number(q.marks) || 10
      });
    });

    return res.status(201).json({
      success: true,
      message: 'Assessment created successfully.',
      data: newAssessment
    });
  } catch (error) {
    console.error('createAssessment error:', error);
    res.status(500).json({ success: false, message: 'Server error creating assessment.' });
  }
}

export function getCoursePerformance(req, res) {
  try {
    const { id: courseId } = req.params;
    const trainerId = req.user.id;

    const course = memoryStore.courses.find(c => c.id === courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.trainer_id !== trainerId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to view performance for this course.' });
    }

    const enrollments = memoryStore.enrollments.filter(e => e.course_id === courseId);
    const assessments = memoryStore.assessments.filter(a => a.course_id === courseId);
    const assessmentIds = assessments.map(a => a.id);
    const results = memoryStore.assessmentResults.filter(r => assessmentIds.includes(r.assessment_id));
    const feedbackList = memoryStore.feedback.filter(f => f.course_id === courseId);

    const totalEnrolled = enrollments.length;
    const activeParticipants = enrollments.filter(e => e.status === 'ACTIVE').length;
    const completedTrainees = enrollments.filter(e => e.status === 'COMPLETED' || e.completion_percentage >= 100).length;

    const avgScore = results.length > 0
      ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)
      : 0;

    const passingCount = results.filter(r => r.percentage >= 50).length;
    const passRate = results.length > 0 ? Math.round((passingCount / results.length) * 100) : 100;

    const avgRating = feedbackList.length > 0
      ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length).toFixed(1)
      : 5.0;

    return res.json({
      success: true,
      data: {
        course: { id: course.id, title: course.title },
        metrics: {
          totalEnrolled,
          activeParticipants,
          completedTrainees,
          completionRate: totalEnrolled > 0 ? Math.round((completedTrainees / totalEnrolled) * 100) : 0,
          averageAssessmentScore: avgScore,
          passRate,
          averageRating: parseFloat(avgRating),
          feedbackCount: feedbackList.length
        },
        trainee_records: enrollments.map(en => {
          const trainee = memoryStore.users.find(u => u.id === en.trainee_id);
          const traineeResults = results.filter(r => r.trainee_id === en.trainee_id);
          return {
            trainee_id: en.trainee_id,
            name: trainee?.name || 'Trainee',
            email: trainee?.email || '',
            completion_percentage: en.completion_percentage,
            status: en.status,
            enrolled_at: en.enrolled_at,
            results: traineeResults
          };
        }),
        feedback: feedbackList
      }
    });
  } catch (error) {
    console.error('getCoursePerformance error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving course performance.' });
  }
}

export function getTrainerLibrary(req, res) {
  try {
    const trainerId = req.user.id;
    const courses = memoryStore.courses.filter(c => c.trainer_id === trainerId);
    const courseIds = courses.map(c => c.id);

    const materials = memoryStore.materials.filter(m => courseIds.includes(m.course_id));

    const enriched = materials.map(m => {
      const course = courses.find(c => c.id === m.course_id);
      return {
        ...m,
        course_title: course?.title || 'Unknown Course'
      };
    });

    return res.json({
      success: true,
      data: enriched
    });
  } catch (error) {
    console.error('getTrainerLibrary error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving trainer library.' });
  }
}

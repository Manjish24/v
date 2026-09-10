import { v4 as uuidv4 } from 'uuid';
import { memoryStore } from '../config/db.js';

export function getAllCourses(req, res) {
  try {
    const { search, subject, difficulty, status } = req.query;

    let courses = [...memoryStore.courses];

    // Guests / Trainees only see PUBLISHED courses by default
    if (!status) {
      courses = courses.filter(c => c.status === 'PUBLISHED');
    } else if (status !== 'ALL') {
      courses = courses.filter(c => c.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q)
      );
    }

    if (subject && subject !== 'All') {
      courses = courses.filter(c => c.subject.toLowerCase() === subject.toLowerCase());
    }

    if (difficulty && difficulty !== 'All') {
      courses = courses.filter(c => c.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // Attach trainer info and enrollment count
    const enriched = courses.map(course => {
      const trainer = memoryStore.users.find(u => u.id === course.trainer_id);
      const enrollmentsCount = memoryStore.enrollments.filter(e => e.course_id === course.id).length;
      const feedbackList = memoryStore.feedback.filter(f => f.course_id === course.id);
      const avgRating = feedbackList.length > 0
        ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length).toFixed(1)
        : null;

      return {
        ...course,
        trainer_name: trainer ? trainer.name : (course.trainer_name || 'Expert Trainer'),
        trainer_avatar: trainer ? trainer.avatar_url : null,
        enrollment_count: enrollmentsCount,
        average_rating: avgRating ? parseFloat(avgRating) : 5.0,
        ratings_count: feedbackList.length
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      data: enriched
    });
  } catch (error) {
    console.error('getAllCourses error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving courses.' });
  }
}

export function getCourseById(req, res) {
  try {
    const { id } = req.params;
    const course = memoryStore.courses.find(c => c.id === id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const trainer = memoryStore.users.find(u => u.id === course.trainer_id);
    const trainerProfile = trainer ? memoryStore.trainerProfiles.find(p => p.user_id === trainer.id) : null;
    const materials = memoryStore.materials.filter(m => m.course_id === course.id).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const assessments = memoryStore.assessments.filter(a => a.course_id === course.id);
    const feedbackList = memoryStore.feedback.filter(f => f.course_id === course.id);

    return res.json({
      success: true,
      data: {
        ...course,
        trainer: {
          id: trainer?.id,
          name: trainer?.name,
          avatar_url: trainer?.avatar_url,
          bio: trainer?.bio,
          qualification: trainerProfile?.qualification,
          work_experience: trainerProfile?.work_experience
        },
        materials,
        assessments: assessments.map(a => ({
          id: a.id,
          title: a.title,
          description: a.description,
          deadline: a.deadline,
          duration_minutes: a.duration_minutes,
          total_marks: a.total_marks
        })),
        feedback: feedbackList
      }
    });
  } catch (error) {
    console.error('getCourseById error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving course details.' });
  }
}

export function submitCourseFeedback(req, res) {
  try {
    const { id: courseId } = req.params;
    const traineeId = req.user.id;
    const { rating, comment, academic_relevance, suggestions } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required.'
      });
    }

    // Business Rule (Section 19): Verify course completion before allowing feedback
    const enrollment = memoryStore.enrollments.find(e =>
      e.course_id === courseId && e.trainee_id === traineeId
    );

    if (!enrollment || enrollment.status !== 'COMPLETED') {
      return res.status(403).json({
        success: false,
        message: 'Course feedback can only be submitted after verified course completion.'
      });
    }

    const existingFeedback = memoryStore.feedback.find(f =>
      f.course_id === courseId && f.trainee_id === traineeId
    );

    if (existingFeedback) {
      existingFeedback.rating = Number(rating);
      existingFeedback.comment = comment;
      existingFeedback.academic_relevance = academic_relevance ? Number(academic_relevance) : 5;
      existingFeedback.suggestions = suggestions || '';
      return res.json({
        success: true,
        message: 'Feedback updated successfully.',
        data: existingFeedback
      });
    }

    const newFeedback = {
      id: uuidv4(),
      course_id: courseId,
      trainee_id: traineeId,
      trainee_name: req.user.name,
      rating: Number(rating),
      comment,
      academic_relevance: academic_relevance ? Number(academic_relevance) : 5,
      suggestions: suggestions || '',
      created_at: new Date().toISOString()
    };

    memoryStore.feedback.push(newFeedback);

    return res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback!',
      data: newFeedback
    });
  } catch (error) {
    console.error('submitCourseFeedback error:', error);
    res.status(500).json({ success: false, message: 'Server error submitting feedback.' });
  }
}

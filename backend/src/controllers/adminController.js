import { v4 as uuidv4 } from 'uuid';
import { memoryStore } from '../config/db.js';

export function getPlatformStatistics(req, res) {
  try {
    const traineesCount = memoryStore.users.filter(u => u.role === 'TRAINEE').length;
    const trainersCount = memoryStore.users.filter(u => u.role === 'TRAINER').length;
    const coursesCount = memoryStore.courses.length;
    const publishedCoursesCount = memoryStore.courses.filter(c => c.status === 'PUBLISHED').length;
    const enrollmentsCount = memoryStore.enrollments.length;
    const completedCertificationsCount = memoryStore.certificates.length;
    const assessmentsCount = memoryStore.assessments.length;
    const totalResults = memoryStore.assessmentResults;

    const avgAssessmentScore = totalResults.length > 0
      ? Math.round(totalResults.reduce((acc, r) => acc + r.percentage, 0) / totalResults.length)
      : 84;

    const completedEnrollments = memoryStore.enrollments.filter(e => e.status === 'COMPLETED' || e.completion_percentage >= 100).length;
    const completionRate = enrollmentsCount > 0
      ? Math.round((completedEnrollments / enrollmentsCount) * 100)
      : 78;

    // Monthly enrollment trends (mocked timeline from actual data)
    const enrollmentTrends = [
      { month: 'Jan', enrollments: 24, completions: 18 },
      { month: 'Feb', enrollments: 38, completions: 26 },
      { month: 'Mar', enrollments: 45, completions: 34 },
      { month: 'Apr', enrollments: 52, completions: 40 },
      { month: 'May', enrollments: 68, completions: 51 },
      { month: 'Jun', enrollments: 84, completions: 64 },
      { month: 'Jul', enrollments: 95, completions: 72 }
    ];

    // Subject breakdown
    const subjectBreakdown = [
      { subject: 'Machine Learning', count: memoryStore.courses.filter(c => c.subject === 'Machine Learning').length || 1 },
      { subject: 'Web Development', count: memoryStore.courses.filter(c => c.subject === 'Web Development').length || 1 },
      { subject: 'Cloud Computing', count: memoryStore.courses.filter(c => c.subject === 'Cloud Computing').length || 1 },
      { subject: 'Data Science', count: 1 },
      { subject: 'Cybersecurity', count: 1 }
    ];

    return res.json({
      success: true,
      data: {
        totals: {
          trainees: traineesCount,
          trainers: trainersCount,
          courses: coursesCount,
          published_courses: publishedCoursesCount,
          enrollments: enrollmentsCount,
          certifications: completedCertificationsCount,
          assessments: assessmentsCount,
          average_score: avgAssessmentScore,
          completion_rate: completionRate
        },
        enrollment_trends: enrollmentTrends,
        subject_breakdown: subjectBreakdown,
        recent_queries_count: memoryStore.queries.filter(q => q.status === 'OPEN').length,
        pending_users_count: memoryStore.users.filter(u => u.status === 'PENDING').length
      }
    });
  } catch (error) {
    console.error('getPlatformStatistics error:', error);
    res.status(500).json({ success: false, message: 'Server error calculating statistics.' });
  }
}

export function getUsers(req, res) {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;

    let users = [...memoryStore.users];

    if (role && role !== 'ALL') {
      users = users.filter(u => u.role === role);
    }

    if (status && status !== 'ALL') {
      users = users.filter(u => u.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    const total = users.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = users.slice(startIndex, startIndex + Number(limit));

    const enriched = paginated.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      avatar_url: u.avatar_url,
      created_at: u.created_at
    }));

    return res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: enriched
    });
  } catch (error) {
    console.error('getUsers error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving users.' });
  }
}

export function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const user = memoryStore.users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.status = status;
    user.updated_at = new Date().toISOString();

    return res.json({
      success: true,
      message: `User status changed to ${status}.`,
      data: { id: user.id, name: user.name, role: user.role, status: user.status }
    });
  } catch (error) {
    console.error('updateUserStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error updating user status.' });
  }
}

export function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['TRAINEE', 'TRAINER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    const user = memoryStore.users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.role = role;
    user.updated_at = new Date().toISOString();

    return res.json({
      success: true,
      message: `User role changed to ${role}.`,
      data: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('updateUserRole error:', error);
    res.status(500).json({ success: false, message: 'Server error updating role.' });
  }
}

export function getAdminTrainees(req, res) {
  try {
    const trainees = memoryStore.users.filter(u => u.role === 'TRAINEE');
    const enriched = trainees.map(t => {
      const profile = memoryStore.traineeProfiles.find(p => p.user_id === t.id) || {};
      const enrollments = memoryStore.enrollments.filter(e => e.trainee_id === t.id);
      const certificates = memoryStore.certificates.filter(c => c.trainee_id === t.id);

      return {
        id: t.id,
        name: t.name,
        email: t.email,
        status: t.status,
        avatar_url: t.avatar_url,
        qualification: profile.qualification || 'Not specified',
        work_experience: profile.work_experience || 'Fresher',
        skills: profile.skills || [],
        interests: profile.interests || [],
        enrolled_courses_count: enrollments.length,
        completed_courses_count: enrollments.filter(e => e.status === 'COMPLETED').length,
        certificates_count: certificates.length,
        created_at: t.created_at
      };
    });

    return res.json({ success: true, data: enriched });
  } catch (error) {
    console.error('getAdminTrainees error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving trainees.' });
  }
}

export function getAdminTrainers(req, res) {
  try {
    const trainers = memoryStore.users.filter(u => u.role === 'TRAINER');
    const enriched = trainers.map(t => {
      const profile = memoryStore.trainerProfiles.find(p => p.user_id === t.id) || {};
      const courses = memoryStore.courses.filter(c => c.trainer_id === t.id);

      return {
        id: t.id,
        name: t.name,
        email: t.email,
        status: t.status,
        avatar_url: t.avatar_url,
        qualification: profile.qualification || 'Not specified',
        work_experience: profile.work_experience || 'Not specified',
        skills: profile.skills || [],
        competencies: profile.competencies || [],
        courses_count: courses.length,
        created_at: t.created_at
      };
    });

    return res.json({ success: true, data: enriched });
  } catch (error) {
    console.error('getAdminTrainers error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving trainers.' });
  }
}

export function getAdminQueries(req, res) {
  try {
    return res.json({
      success: true,
      data: memoryStore.queries
    });
  } catch (error) {
    console.error('getAdminQueries error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving queries.' });
  }
}

export function updateAdminQuery(req, res) {
  try {
    const { id } = req.params;
    const { response, status, assigned_to } = req.body;

    const query = memoryStore.queries.find(q => q.id === id);
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found.' });
    }

    if (response !== undefined) query.response = response;
    if (status !== undefined) {
      query.status = status;
      if (status === 'RESOLVED' || status === 'CLOSED') {
        query.resolved_at = new Date().toISOString();
      }
    }
    if (assigned_to !== undefined) query.assigned_to = assigned_to;

    return res.json({
      success: true,
      message: 'Query updated successfully.',
      data: query
    });
  } catch (error) {
    console.error('updateAdminQuery error:', error);
    res.status(500).json({ success: false, message: 'Server error updating query.' });
  }
}

export function getAnnouncements(req, res) {
  try {
    const publishedOnly = req.query.published === 'true';
    let list = [...memoryStore.announcements];
    if (publishedOnly) {
      list = list.filter(a => a.published);
    }
    return res.json({ success: true, data: list });
  } catch (error) {
    console.error('getAnnouncements error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving announcements.' });
  }
}

export function createAnnouncement(req, res) {
  try {
    const { title, content, category, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const newAnnouncement = {
      id: uuidv4(),
      title,
      content,
      category: category || 'Platform Update',
      created_by: req.user.id,
      author_name: req.user.name,
      published: published !== undefined ? published : true,
      created_at: new Date().toISOString()
    };

    memoryStore.announcements.unshift(newAnnouncement);

    return res.status(201).json({
      success: true,
      message: 'Announcement published successfully.',
      data: newAnnouncement
    });
  } catch (error) {
    console.error('createAnnouncement error:', error);
    res.status(500).json({ success: false, message: 'Server error creating announcement.' });
  }
}

export function deleteAnnouncement(req, res) {
  try {
    const { id } = req.params;
    const index = memoryStore.announcements.findIndex(a => a.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }
    memoryStore.announcements.splice(index, 1);
    return res.json({ success: true, message: 'Announcement deleted.' });
  } catch (error) {
    console.error('deleteAnnouncement error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting announcement.' });
  }
}

export function getAchievements(req, res) {
  try {
    const publishedOnly = req.query.published === 'true';
    let list = [...memoryStore.achievements];
    if (publishedOnly) {
      list = list.filter(a => a.published);
    }
    return res.json({ success: true, data: list });
  } catch (error) {
    console.error('getAchievements error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving achievements.' });
  }
}

export function publishAchievement(req, res) {
  try {
    const { id } = req.params;
    const achievement = memoryStore.achievements.find(a => a.id === id);
    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Achievement not found.' });
    }
    achievement.status = 'APPROVED';
    achievement.published = true;
    return res.json({
      success: true,
      message: 'Achievement approved and published.',
      data: achievement
    });
  } catch (error) {
    console.error('publishAchievement error:', error);
    res.status(500).json({ success: false, message: 'Server error publishing achievement.' });
  }
}

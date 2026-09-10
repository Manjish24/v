import { matchCompetency } from '../services/competencyService.js';
import { memoryStore } from '../config/db.js';

export async function matchTrainerCompetency(req, res) {
  try {
    const { subject, query, weights } = req.body;
    const searchTarget = subject || query || '';

    if (!searchTarget.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A subject or competency requirement query is required.'
      });
    }

    const results = await matchCompetency({
      subjectQuery: searchTarget,
      customWeights: weights || {}
    });

    return res.json({
      success: true,
      message: 'Capacity Competency match completed successfully.',
      data: results
    });
  } catch (error) {
    console.error('matchTrainerCompetency error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error running Capacity Competency algorithm.'
    });
  }
}

export function getAllTrainerCompetencies(req, res) {
  try {
    const trainers = memoryStore.users.filter(u => u.role === 'TRAINER');
    const data = trainers.map(t => {
      const profile = memoryStore.trainerProfiles.find(p => p.user_id === t.id) || {};
      return {
        trainer_id: t.id,
        name: t.name,
        email: t.email,
        avatar_url: t.avatar_url,
        qualification: profile.qualification,
        work_experience: profile.work_experience,
        competencies: profile.competencies || [],
        skills: profile.skills || []
      };
    });

    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('getAllTrainerCompetencies error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving competencies.' });
  }
}

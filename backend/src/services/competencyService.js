import { memoryStore } from '../config/db.js';
import { explainCompetencyMatch } from './aiService.js';

/**
 * Capacity Competency Matching Service
 * Algorithmic, weighted multi-criteria decision engine paired with Gemini AI semantic explanation.
 */
export async function matchCompetency({
  subjectQuery,
  customWeights = {}
}) {
  const query = (subjectQuery || '').trim().toLowerCase();

  // Default weights from Specification (Section 36)
  const weights = {
    skill: customWeights.skill !== undefined ? Number(customWeights.skill) : 35,
    experience: customWeights.experience !== undefined ? Number(customWeights.experience) : 25,
    qualification: customWeights.qualification !== undefined ? Number(customWeights.qualification) : 15,
    certification: customWeights.certification !== undefined ? Number(customWeights.certification) : 15,
    performance: customWeights.performance !== undefined ? Number(customWeights.performance) : 10
  };

  const totalWeight = weights.skill + weights.experience + weights.qualification + weights.certification + weights.performance || 100;

  // Retrieve trainers from database
  const trainers = memoryStore.users.filter(u => u.role === 'TRAINER' && u.status === 'APPROVED');

  const rankedTrainers = await Promise.all(trainers.map(async (trainer) => {
    const profile = memoryStore.trainerProfiles.find(p => p.user_id === trainer.id) || {};
    const competencies = profile.competencies || [];
    const skills = profile.skills || [];
    const taughtCourses = memoryStore.courses.filter(c => c.trainer_id === trainer.id);

    // 1. Skill & Subject Relevance (0-100)
    let skillMatchPoints = 0;
    const queryTokens = query.split(/\s+/).filter(t => t.length > 2);

    // Check competencies
    competencies.forEach(comp => {
      const compText = `${comp.subject} ${comp.proficiency_level}`.toLowerCase();
      if (compText.includes(query) || (query && query.includes(comp.subject.toLowerCase()))) {
        skillMatchPoints = Math.max(skillMatchPoints, comp.proficiency_level === 'Expert' ? 100 : 85);
      }
      queryTokens.forEach(token => {
        if (compText.includes(token)) skillMatchPoints = Math.max(skillMatchPoints, 75);
      });
    });

    // Check skills
    skills.forEach(skill => {
      const skillName = (skill.name || '').toLowerCase();
      if (skillName.includes(query) || (query && query.includes(skillName))) {
        skillMatchPoints = Math.max(skillMatchPoints, skill.level === 'Expert' ? 95 : 80);
      }
      queryTokens.forEach(token => {
        if (skillName.includes(token)) skillMatchPoints = Math.max(skillMatchPoints, 70);
      });
    });

    // Baseline fallback if generic domain match
    if (skillMatchPoints === 0) {
      skillMatchPoints = 40;
    }

    // 2. Experience Score (0-100)
    // Max 10 years experience = 100
    let maxExp = 0;
    competencies.forEach(c => {
      if (c.experience_years && c.experience_years > maxExp) maxExp = c.experience_years;
    });
    if (maxExp === 0 && profile.work_experience) {
      const match = profile.work_experience.match(/(\d+)\s*years?/i);
      if (match) maxExp = parseInt(match[1], 10);
    }
    const experiencePoints = Math.min(100, Math.round((maxExp / 10) * 100));

    // 3. Qualification Score (0-100)
    const qualText = (profile.qualification || '').toLowerCase();
    let qualPoints = 60;
    if (qualText.includes('ph.d') || qualText.includes('doctorate')) qualPoints = 100;
    else if (qualText.includes('m.tech') || qualText.includes('m.s') || qualText.includes('master')) qualPoints = 85;
    else if (qualText.includes('b.tech') || qualText.includes('bachelor')) qualPoints = 70;

    // 4. Certification Score (0-100)
    let certPoints = 50;
    let certList = competencies.map(c => c.certification).filter(Boolean);
    if (certList.length > 0) {
      certPoints = 85;
      if (certList.some(c => c.toLowerCase().includes('google') || c.toLowerCase().includes('aws') || c.toLowerCase().includes('meta'))) {
        certPoints = 100;
      }
    }

    // 5. Past Teaching Performance (0-100)
    let perfScore = 4.5;
    if (competencies.length > 0 && competencies[0].past_performance_score) {
      perfScore = competencies[0].past_performance_score;
    }
    const performancePoints = Math.min(100, Math.round((perfScore / 5.0) * 100));

    // Calculate overall weighted score
    const weightedTotal = (
      (skillMatchPoints * weights.skill) +
      (experiencePoints * weights.experience) +
      (qualPoints * weights.qualification) +
      (certPoints * weights.certification) +
      (performancePoints * weights.performance)
    ) / totalWeight;

    const roundedScore = Math.round(weightedTotal);

    return {
      trainer_id: trainer.id,
      name: trainer.name,
      email: trainer.email,
      avatar_url: trainer.avatar_url,
      qualification: profile.qualification || 'Not specified',
      work_experience: profile.work_experience || `${maxExp} years experience`,
      skills: profile.skills || [],
      competencies,
      courses_taught_count: taughtCourses.length,
      past_performance_score: perfScore,
      score: roundedScore,
      score_breakdown: {
        totalScore: roundedScore,
        skillScore: skillMatchPoints,
        experienceScore: experiencePoints,
        qualificationScore: qualPoints,
        certScore: certPoints,
        performanceScore: performancePoints
      }
    };
  }));

  // Sort by highest score descending
  rankedTrainers.sort((a, b) => b.score - a.score);

  // Generate AI explanation for the top matched trainer
  let aiExplanation = '';
  if (rankedTrainers.length > 0) {
    const top = rankedTrainers[0];
    aiExplanation = await explainCompetencyMatch({
      requirement: subjectQuery,
      topTrainer: top,
      scoreBreakdown: top.score_breakdown
    });
  }

  return {
    query: subjectQuery,
    appliedWeights: weights,
    topMatch: rankedTrainers[0] || null,
    explanation: aiExplanation,
    rankedTrainers
  };
}

import {
  getCourseRecommendations,
  summarizeYouTubeContent,
  assistQuery
} from '../services/aiService.js';
import { memoryStore } from '../config/db.js';
import { extractYouTubeVideoId } from '../utils/youtube.js';

export async function getAICourseRecommendations(req, res) {
  try {
    const traineeId = req.user.id;
    const profile = memoryStore.traineeProfiles.find(p => p.user_id === traineeId) || {};
    const publishedCourses = memoryStore.courses.filter(c => c.status === 'PUBLISHED');

    const recommendations = await getCourseRecommendations({
      trainee: profile,
      availableCourses: publishedCourses
    });

    const enriched = recommendations.map(rec => {
      const course = publishedCourses.find(c => c.id === rec.course_id);
      return {
        ...rec,
        course: course || null
      };
    }).filter(r => r.course !== null);

    return res.json({
      success: true,
      data: enriched
    });
  } catch (error) {
    console.error('getAICourseRecommendations error:', error);
    res.status(500).json({ success: false, message: 'Server error generating recommendations.' });
  }
}

export async function getAIYouTubeSummary(req, res) {
  try {
    const { youtube_url, course_title, description } = req.body;

    if (!youtube_url) {
      return res.status(400).json({ success: false, message: 'YouTube URL is required.' });
    }

    const videoId = extractYouTubeVideoId(youtube_url);
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Invalid YouTube URL.' });
    }

    const summaryData = await summarizeYouTubeContent({
      videoId,
      youtubeUrl: youtube_url,
      courseTitle: course_title,
      description
    });

    return res.json({
      success: true,
      data: {
        videoId,
        ...summaryData
      }
    });
  } catch (error) {
    console.error('getAIYouTubeSummary error:', error);
    res.status(500).json({ success: false, message: 'Server error analyzing YouTube video.' });
  }
}

export async function getAIQueryAssistant(req, res) {
  try {
    const { course_id, query_text } = req.body;

    if (!query_text) {
      return res.status(400).json({ success: false, message: 'Query text is required.' });
    }

    const course = course_id
      ? memoryStore.courses.find(c => c.id === course_id)
      : { title: 'Capacity Building Portal', subject: 'General', description: 'Platform capacity courses', learning_objectives: [] };

    const answer = await assistQuery({
      course: course || {},
      queryText: query_text
    });

    return res.json({
      success: true,
      data: {
        answer
      }
    });
  } catch (error) {
    console.error('getAIQueryAssistant error:', error);
    res.status(500).json({ success: false, message: 'Server error assisting query.' });
  }
}

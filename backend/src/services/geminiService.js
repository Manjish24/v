/**
 * geminiService.js
 * Gemini AI integration for academic video & content verification.
 *
 * verifyYouTubeVideo — Analyzes a public YouTube URL using Gemini's
 *   native video understanding. The YouTube URL is passed as a fileData
 *   part (mimeType: "video/mp4"), which Gemini 2.5 Flash supports directly.
 *
 * verifyCourseContent — Evaluates text-based course content (transcript /
 *   description) against a course's academic topics.
 */

import { GoogleGenAI } from "@google/genai";

// --------------------------------------------------------------------------
// Client factory
// --------------------------------------------------------------------------
const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the backend.");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const MODEL = () => process.env.GEMINI_MODEL || "gemini-2.5-flash";

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------
const normalizeVerification = (result) => {
  const mappingPercentage = Math.max(
    0,
    Math.min(100, Number(result.mappingPercentage) || 0)
  );

  return {
    summary: String(result.summary || "").trim(),
    conceptsCovered: Array.isArray(result.conceptsCovered)
      ? result.conceptsCovered
          .map((c) => String(c).trim())
          .filter(Boolean)
      : [],
    topicAnalysis: Array.isArray(result.topicAnalysis)
      ? result.topicAnalysis
      : [],
    competencyMapping: Array.isArray(result.competencyMapping)
      ? result.competencyMapping
      : [],
    competencyPercentage: Math.max(
      0,
      Math.min(100, Number(result.competencyPercentage) || mappingPercentage)
    ),
    courseRelevance: String(result.courseRelevance || "").trim(),
    mappingPercentage,
    status: mappingPercentage >= 85 ? "VERIFIED" : "REJECTED",
    reason: String(result.reason || "").trim(),
  };
};

const parseJsonResponse = (text) => {
  const cleaned = String(text || "")
    .replace(/^```json\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Gemini returned an invalid JSON response.");
  }
};

// --------------------------------------------------------------------------
// Prompt builder
// --------------------------------------------------------------------------
const buildVideoVerificationPrompt = ({ courseName, videoTitle, topics, competencies, videoUrl }) => `
You are an academic video verification system for CAPACITY CONNECT — an e-learning
portal for the Ministry of Earth Sciences (MoES) / Indian Meteorological Department (IMD).

Your task is to analyze the educational content of the YouTube video and verify whether
it is academically relevant to the specified course and its topics.

COURSE NAME  : ${courseName}
VIDEO TITLE  : ${videoTitle}
VIDEO URL    : ${videoUrl}
TOPICS       : ${topics.join(", ")}
COMPETENCIES : ${competencies.join(", ")}

INSTRUCTIONS:
1. Watch and analyze the actual content of the video — do NOT judge only from the title.
2. Summarize what the video teaches in academic terms.
3. Identify all scientific / technical concepts covered.
4. For each topic listed above, state whether it was covered and provide a brief explanation.
5. For each competency listed above, state whether the video develops it and provide evidence.
6. Assign a strict academic mapping percentage (0–100).
  - 85 or above → VERIFIED
  - Below 85    → REJECTED
7. Assign a competency mapping percentage (0–100) based on the listed competencies.
8. Provide a clear reason for the scores.

Return ONLY valid JSON in this exact shape (no markdown, no extra text):
{
  "summary": "Short academic summary of the video content",
  "conceptsCovered": ["Concept A", "Concept B"],
  "topicAnalysis": [
    { "topic": "Topic name", "covered": true, "explanation": "Why / how it was covered" }
  ],
  "competencyMapping": [
    { "competency": "Competency name", "mapped": true, "evidence": "How the video develops this competency" }
  ],
  "competencyPercentage": 85,
  "courseRelevance": "One-sentence academic relevance statement",
  "mappingPercentage": 85,
  "reason": "Detailed explanation of the academic mapping score",
  "status": "VERIFIED"
}
`.trim();

// --------------------------------------------------------------------------
// verifyYouTubeVideo
// Uses Gemini's native video understanding — YouTube URL supplied as fileData.
// --------------------------------------------------------------------------
export const verifyYouTubeVideo = async ({
  courseName,
  videoTitle,
  videoUrl,
  topics,
  competencies = topics,
}) => {
  const ai = getClient();

  const prompt = buildVideoVerificationPrompt({
    courseName,
    videoTitle,
    topics,
    competencies,
    videoUrl,
  });

  let responseText;

  try {
    // Gemini 2.5 Flash supports YouTube URLs directly via fileData parts.
    const response = await ai.models.generateContent({
      model: MODEL(),
      contents: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: "video/mp4",
                fileUri: videoUrl,
              },
            },
            { text: prompt },
          ],
        },
      ],
    });
    responseText = response.text;
  } catch (videoErr) {
    // Fallback: If the model cannot fetch the video directly (e.g., private
    // or restricted), fall back to title + URL text-only analysis.
    console.warn(
      "[geminiService] Video fileData fetch failed, falling back to text analysis:",
      videoErr.message
    );

    const fallbackPrompt = `${prompt}

NOTE: The video could not be fetched directly. Analyze based on the video title,
URL, and your general knowledge of the topic. Be conservative with the mapping
percentage when the full video cannot be verified.`;

    const fallbackResponse = await ai.models.generateContent({
      model: MODEL(),
      contents: fallbackPrompt,
      config: { responseMimeType: "application/json" },
    });
    responseText = fallbackResponse.text;
  }

  return normalizeVerification(parseJsonResponse(responseText));
};

// --------------------------------------------------------------------------
// verifyCourseContent
// Text-based verification used for transcript / description input.
// --------------------------------------------------------------------------
export const verifyCourseContent = async ({
  courseName,
  title,
  description,
  topics,
  transcript,
}) => {
  const prompt = `
You are an academic course-content verification system for CAPACITY CONNECT.

Evaluate whether the supplied educational content is academically relevant to the named course.
Use the actual content as the primary evidence — do NOT rely on title keywords alone.

COURSE NAME        : ${courseName}
COURSE TITLE       : ${title}
COURSE DESCRIPTION : ${description || "Not provided"}
TOPICS             : ${topics.join(", ") || "Not provided"}

VIDEO TRANSCRIPT OR TRAINER-PROVIDED CONTENT:
${transcript}

Return ONLY valid JSON in this exact shape:
{
  "summary": "Short academic summary",
  "conceptsCovered": ["Concept 1", "Concept 2"],
  "mappingPercentage": 0,
  "status": "VERIFIED",
  "reason": "Academic explanation of the score"
}

  A mapping percentage of 85 or above is VERIFIED. Below 85 is REJECTED.
`.trim();

  const ai = getClient();
  const response = await ai.models.generateContent({
    model: MODEL(),
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return normalizeVerification(parseJsonResponse(response.text));
};
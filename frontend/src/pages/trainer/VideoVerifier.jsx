import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import {
  ArrowLeft,
  Youtube,
  Search,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  Loader2,
  BarChart3,
  ListChecks,
  BadgeCheck,
  Target,
  FileText,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helper — extract YouTube video ID from any URL format
// ---------------------------------------------------------------------------
const extractVideoId = (url) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return parsed.pathname.slice(1).split("?")[0];
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = parsed.searchParams.get("v");
      if (v) return v;
      const segs = parsed.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "v"].includes(segs[0]) && segs[1]) return segs[1];
    }
  } catch {
    /* ignore */
  }
  return null;
};

const isYouTubeUrl = (url) => {
  try {
    const { hostname } = new URL(url);
    return ["www.youtube.com", "youtube.com", "youtu.be", "m.youtube.com"].includes(hostname);
  } catch {
    return false;
  }
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const StatusBadge = ({ status, percentage }) => {
  const isVerified = status === "VERIFIED";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
        isVerified
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-rose-50 text-rose-700 border-rose-200"
      }`}
    >
      {isVerified ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        <XCircle className="w-3.5 h-3.5" />
      )}
      {isVerified ? "VERIFIED" : "REJECTED"} · {percentage}%
    </span>
  );
};

const MappingBar = ({ percentage }) => {
  const isVerified = percentage >= 85;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-600">Academic Mapping</span>
        <span
          className={`text-sm font-extrabold ${
            isVerified ? "text-emerald-600" : "text-rose-500"
          }`}
        >
          {percentage}%
        </span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isVerified
              ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
              : "bg-gradient-to-r from-amber-400 to-rose-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-400">
        Minimum required: <strong>85%</strong> for verification
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export const VideoVerifier = () => {
  const navigate = useNavigate();

  // ── Step 1: URL input & metadata
  const [videoUrl, setVideoUrl] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaError, setMetaError] = useState("");
  const debounceRef = useRef(null);

  // ── Step 2: Course context
  const [courseName, setCourseName] = useState("");
  const [topicsInput, setTopicsInput] = useState("");
  const [competenciesInput, setCompetenciesInput] = useState("");

  // ── Step 3: Gemini verification result
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [verifyError, setVerifyError] = useState("");

  // ── Debounced metadata fetch when the URL changes ─────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!videoUrl.trim() || !isYouTubeUrl(videoUrl)) {
      setMetadata(null);
      setMetaError(videoUrl && !isYouTubeUrl(videoUrl) ? "Please enter a valid YouTube URL." : "");
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setMetaLoading(true);
      setMetaError("");
      setMetadata(null);
      setResult(null);
      setVerifyError("");
      try {
        const res = await api.getYouTubeMetadata(videoUrl);
        setMetadata(res.metadata);
      } catch (err) {
        setMetaError(err.message || "Could not fetch video info.");
      } finally {
        setMetaLoading(false);
      }
    }, 800);

    return () => clearTimeout(debounceRef.current);
  }, [videoUrl]);

  // ── Gemini verification ───────────────────────────────────────────────────
  const handleVerify = async (e) => {
    e.preventDefault();

    const topics = topicsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const competencies = competenciesInput
      .split(",")
      .map((competency) => competency.trim())
      .filter(Boolean);

    if (!videoUrl || !isYouTubeUrl(videoUrl)) {
      setVerifyError("Please enter a valid YouTube URL.");
      return;
    }
    if (!courseName) {
      setVerifyError("Please select a course / discipline.");
      return;
    }
    if (topics.length === 0) {
      setVerifyError("Please enter at least one academic topic.");
      return;
    }
    if (competencies.length === 0) {
      setVerifyError("Please enter at least one competency to map.");
      return;
    }

    setVerifying(true);
    setResult(null);
    setVerifyError("");

    try {
      const res = await api.verifyVideo({
        courseName,
        videoTitle: metadata?.title || "",
        videoUrl,
        topics,
        competencies,
      });
      setResult(res.data || res);
    } catch (err) {
      // 422 still returns structured data
      if (err.data || err.verification) {
        setResult(err.data || err.verification);
      } else {
        setVerifyError(err.message || "Verification failed. Please try again.");
      }
    } finally {
      setVerifying(false);
    }
  };

  const videoId = extractVideoId(videoUrl);
  const topics = topicsInput.split(",").map((t) => t.trim()).filter(Boolean);
  const competencies = competenciesInput
    .split(",")
    .map((competency) => competency.trim())
    .filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate("/trainer/dashboard")}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Youtube className="w-6 h-6 text-rose-500" />
            YouTube Video Verifier
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Paste a YouTube URL — Gemini AI will analyze the content and confirm academic relevance before storing.
          </p>
        </div>
      </div>

      {/* ── Step 1 — URL + Preview card ─────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-extrabold flex items-center justify-center">1</span>
          Paste YouTube Video URL
        </h2>

        <div className="relative">
          <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
          />
          {metaLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 animate-spin" />
          )}
        </div>

        {metaError && (
          <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 rounded-xl px-4 py-2.5 border border-rose-100">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            {metaError}
          </div>
        )}

        {/* ── Video Preview ─────────────────────────────────────────────── */}
        {metadata && (
          <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in">
            {/* Thumbnail */}
            <div className="shrink-0 relative">
              <img
                src={metadata.thumbnail}
                alt={metadata.title}
                className="w-32 h-20 object-cover rounded-xl border border-slate-200"
                onError={(e) => {
                  e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
              <span className="absolute bottom-1.5 right-1.5 bg-black/75 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {metadata.duration}
              </span>
            </div>

            {/* Meta info */}
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                {metadata.title}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {metadata.channelTitle}
                {metadata.viewCount && (
                  <>
                    {" · "}
                    {Number(metadata.viewCount).toLocaleString()} views
                  </>
                )}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Duration: {metadata.duration}
              </p>
              {metadata.apiKeyMissing && (
                <p className="text-[11px] text-amber-600 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" />
                  YouTube API key not configured — title may be unavailable.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Step 2 — Course Context ─────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-extrabold flex items-center justify-center">2</span>
          Set Academic Context
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Discipline / Course Name
            </label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Enter discipline or course name"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Topics for Academic Mapping
              <span className="text-slate-400 font-normal ml-1">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              placeholder="e.g. Doppler principles, reflectivity, velocity products"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Competencies to Map
              <span className="text-slate-400 font-normal ml-1">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={competenciesInput}
              onChange={(e) => setCompetenciesInput(e.target.value)}
              placeholder="e.g. radar echo interpretation, severe storm analysis, nowcasting"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>
        </div>

        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topics.map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {competencies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {competencies.map((competency, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-semibold rounded-full"
              >
                <Target className="w-3 h-3" />
                {competency}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Step 3 — Verify Button ───────────────────────────────────────────── */}
      <form onSubmit={handleVerify}>
        {verifyError && (
          <div className="mb-3 flex items-center gap-2 text-xs text-rose-600 bg-rose-50 rounded-xl px-4 py-2.5 border border-rose-100">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            {verifyError}
          </div>
        )}
        <button
          type="submit"
          disabled={verifying || !videoUrl || !isYouTubeUrl(videoUrl) || topics.length === 0 || competencies.length === 0}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-extrabold rounded-2xl text-sm shadow-md transition"
        >
          {verifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gemini AI is analyzing the video…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Verify with Gemini AI
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Gemini will watch the video and assess academic relevance against your selected topics.
        </p>
      </form>

      {/* ── Step 4 — Results Panel ──────────────────────────────────────────── */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          {/* ── Result Header ────────────────────────────────────────────── */}
          <div
            className={`p-5 rounded-3xl border-2 ${
              result.status === "VERIFIED"
                ? "bg-emerald-50 border-emerald-200"
                : "bg-rose-50 border-rose-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <StatusBadge status={result.status} percentage={result.mappingPercentage} />
                <h3 className="text-base font-extrabold text-slate-900 mt-2">
                  {result.status === "VERIFIED"
                    ? "✅ Video Academically Approved"
                    : "❌ Video Does Not Meet Academic Standards"}
                </h3>
                <p className="text-xs text-slate-600">{result.courseRelevance}</p>
              </div>

              {result.status === "VERIFIED" && metadata && (
                <div className="shrink-0">
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow">
                    <BadgeCheck className="w-4 h-4" />
                    URL Ready to Store
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <MappingBar percentage={result.mappingPercentage} />
            </div>
          </div>

          {/* ── Summary ──────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Academic Summary
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">{result.summary}</p>

            {result.reason && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-600 mb-1">AI Reasoning</p>
                <p className="text-xs text-slate-500 leading-relaxed">{result.reason}</p>
              </div>
            )}
          </div>

          {result.competencyMapping?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
                  <Target className="w-4 h-4 text-sky-500" />
                  Competency Mapping
                </h4>
                <span className={`text-sm font-extrabold ${result.competencyPercentage >= 85 ? "text-emerald-600" : "text-rose-500"}`}>
                  {result.competencyPercentage}%
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${result.competencyPercentage >= 85 ? "bg-emerald-500" : "bg-rose-400"}`}
                  style={{ width: `${result.competencyPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">Competencies are mapped independently from academic topic relevance.</p>
              <div className="space-y-2">
                {result.competencyMapping.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs ${
                      item.mapped ? "bg-sky-50 border-sky-100" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {item.mapped ? (
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-slate-800">{item.competency}</p>

                  {result.status === "VERIFIED" && result.theory && (
                    <div className="bg-sky-50 rounded-2xl border border-sky-200 shadow-sm p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
                        <FileText className="w-4 h-4 text-sky-600" />
                        Student Theory
                      </h4>
                      <h5 className="text-base font-extrabold text-slate-900">{result.theory.title}</h5>
                      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {result.theory.notes}
                      </div>
                      {result.theory.keyPoints?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-slate-700 mb-2">Key Points</p>
                          <ul className="space-y-2">
                            {result.theory.keyPoints.map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                      {item.evidence && <p className="text-slate-500 mt-0.5 leading-relaxed">{item.evidence}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Concepts Covered ─────────────────────────────────────────── */}
          {result.conceptsCovered?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
                <ListChecks className="w-4 h-4 text-violet-500" />
                Concepts Covered
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.conceptsCovered.map((concept, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 border border-violet-100 text-violet-800 text-[11px] font-semibold rounded-full"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Topic-by-Topic Analysis ──────────────────────────────────── */}
          {result.topicAnalysis?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                Topic-by-Topic Analysis
              </h4>
              <div className="space-y-2">
                {result.topicAnalysis.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs ${
                      item.covered
                        ? "bg-emerald-50 border-emerald-100"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span className="shrink-0 mt-0.5">
                      {item.covered ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-400" />
                      )}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{item.topic}</p>
                      {item.explanation && (
                        <p className="text-slate-500 mt-0.5 leading-relaxed">{item.explanation}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Action buttons ────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setResult(null);
                setVerifyError("");
                setVideoUrl("");
                setMetadata(null);
                setTopicsInput("");
                setCompetenciesInput("");
              }}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              Verify Another Video
            </button>

            {result.status === "VERIFIED" && (
              <button
                onClick={() => navigate("/trainer/create-course")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md transition"
              >
                <BadgeCheck className="w-4 h-4" />
                Use in Course Creation
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

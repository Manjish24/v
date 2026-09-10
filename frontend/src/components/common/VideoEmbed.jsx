import React from 'react';

export default function VideoEmbed({ videoId, title = 'Course Lecture Video' }) {
  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400">
        <p className="text-sm">Video content not available.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-black">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}

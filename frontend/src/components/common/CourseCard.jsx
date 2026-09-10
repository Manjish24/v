import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, CheckCircle, ArrowRight } from 'lucide-react';
import Badge from './Badge';

export default function CourseCard({ course, isEnrolled, progress, showContinue = false }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
      {/* Thumbnail */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge label={course.subject} variant="Beginner" size="xs" />
          <Badge label={course.difficulty} variant={course.difficulty} size="xs" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base sm:text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {course.duration || '4 Weeks'}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              {course.trainer_name || 'Instructor'}
            </span>
          </div>
        </div>

        {/* Progress bar if enrolled */}
        {isEnrolled && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span>Course Progress</span>
              <span>{Math.round(progress || 0)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  (progress || 0) >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, progress || 0))}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          {showContinue ? (
            <Link
              to={`/trainee/courses/${course.id || course.course_id}`}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Continue Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to={`/courses/${course.id || course.course_id}`}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
            >
              View Course Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

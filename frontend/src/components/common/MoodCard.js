import React from 'react';
import { formatMoodEntry, getMoodByScore, getTimeOfDayByValue } from '../../utils/moodData';

const MoodCard = ({ moodEntry, onEdit, onDelete, showActions = false }) => {
  if (!moodEntry) return null;

  const mood = getMoodByScore(moodEntry.moodScore);
  const timeOfDay = getTimeOfDayByValue(moodEntry.timeOfDay);
  const formattedEntry = formatMoodEntry(moodEntry);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100">
      {/* Header with emoji and mood */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full ${mood.bgColor} flex items-center justify-center`}>
            <span className="text-2xl">{mood.emoji}</span>
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${mood.color}`}>
              {mood.label}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">{timeOfDay.emoji}</span>
              <span>{timeOfDay.label}</span>
            </div>
          </div>
        </div>
        
        {/* Mood Score Badge */}
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${mood.bgColor} ${mood.color}`}>
          {moodEntry.moodScore}/5
        </div>
      </div>

      {/* Date and Time */}
      <div className="text-sm text-gray-600 mb-3">
        <span>{formattedEntry.formattedDate}</span>
        <span className="mx-2">•</span>
        <span>{formattedEntry.timeAgo}</span>
      </div>

      {/* Notes */}
      {moodEntry.notes && (
        <div className="mb-4">
          <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
            "{moodEntry.notes}"
          </p>
        </div>
      )}

      {/* Tags */}
      {moodEntry.tags && moodEntry.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {moodEntry.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (onEdit || onDelete) && (
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
          {onEdit && (
            <button
              onClick={() => onEdit(moodEntry)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(moodEntry)}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MoodCard; 
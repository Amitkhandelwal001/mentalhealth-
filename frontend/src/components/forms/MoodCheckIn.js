import React, { useState } from 'react';
import { moodAPI, handleApiError } from '../../utils/api';
import {
  MOOD_OPTIONS,
  TIME_OF_DAY_OPTIONS,
  COMMON_MOOD_TAGS,
  getCurrentTimeOfDay,
  validateMoodEntry,
  getMoodRecommendations
} from '../../utils/moodData';

const MoodCheckIn = ({ onSuccess, onCancel, existingEntry = null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    moodScore: existingEntry?.moodScore || null,
    notes: existingEntry?.notes || '',
    tags: existingEntry?.tags || [],
    timeOfDay: existingEntry?.timeOfDay || getCurrentTimeOfDay()
  });

  // Tag input state
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Filter tag suggestions based on input
  const filteredTagSuggestions = COMMON_MOOD_TAGS.filter(tag =>
    tag.toLowerCase().includes(tagInput.toLowerCase()) &&
    !formData.tags.includes(tag)
  ).slice(0, 6);

  // Handle mood selection
  const handleMoodSelect = (score) => {
    setFormData(prev => ({ ...prev, moodScore: score }));
    setErrors(prev => ({ ...prev, moodScore: null }));
    
    // Show recommendations for selected mood
    setShowRecommendations(true);
    setTimeout(() => setShowRecommendations(false), 5000);
  };

  // Handle time of day selection
  const handleTimeOfDaySelect = (timeOfDay) => {
    setFormData(prev => ({ ...prev, timeOfDay }));
    setErrors(prev => ({ ...prev, timeOfDay: null }));
  };

  // Handle notes change
  const handleNotesChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setFormData(prev => ({ ...prev, notes: value }));
      setErrors(prev => ({ ...prev, notes: null }));
    }
  };

  // Handle tag addition
  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag.toLowerCase()] }));
      setTagInput('');
      setShowTagSuggestions(false);
      setErrors(prev => ({ ...prev, tags: null }));
    }
  };

  // Handle tag removal
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle tag input
  const handleTagInput = (e) => {
    const value = e.target.value;
    setTagInput(value);
    setShowTagSuggestions(value.length > 0);

    // Add tag on Enter or comma
    if ((e.key === 'Enter' || e.key === ',') && value.trim()) {
      e.preventDefault();
      addTag(value.trim());
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateMoodEntry(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = existingEntry 
        ? await moodAPI.updateMoodEntry(existingEntry._id, formData)
        : await moodAPI.createMoodEntry(formData);

      if (response.data.success) {
        setSuccessMessage(
          existingEntry 
            ? 'Mood entry updated successfully!' 
            : 'Mood logged successfully!'
        );
        
        // Show success message briefly
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(response.data.data);
          }
        }, 1500);
      }

    } catch (error) {
      console.error('Mood check-in error:', error);
      
      if (error.response?.status === 409) {
        // Duplicate entry error
        setErrors({
          general: error.response.data.message
        });
      } else if (error.response?.data?.errors) {
        // Validation errors from backend
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          backendErrors[err.path || 'general'] = err.msg;
        });
        setErrors(backendErrors);
      } else {
        const apiError = handleApiError(error);
        setErrors({
          general: apiError.message
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current mood recommendations
  const recommendations = formData.moodScore ? getMoodRecommendations(formData.moodScore) : [];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {existingEntry ? 'Update Your Mood' : 'How are you feeling?'}
        </h2>
        <p className="text-gray-600">
          Track your mood to understand your emotional patterns
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <span className="text-xl mr-3">✅</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* General Error */}
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <span className="text-xl mr-3">❌</span>
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Mood Selection */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Select your mood
          </label>
          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => handleMoodSelect(mood.value)}
                className={`
                  relative p-4 rounded-2xl border-2 transition-all duration-200 
                  hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 
                  focus:ring-primary-500 focus:ring-offset-2
                  ${formData.moodScore === mood.value
                    ? `${mood.bgColor} border-primary-500 shadow-md scale-105`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }
                `}
                aria-label={`${mood.label} - ${mood.description}`}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl mb-2">{mood.emoji}</div>
                  <div className={`text-xs sm:text-sm font-medium ${
                    formData.moodScore === mood.value ? mood.color : 'text-gray-600'
                  }`}>
                    {mood.label}
                  </div>
                </div>
                
                {/* Selection indicator */}
                {formData.moodScore === mood.value && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
          {errors.moodScore && (
            <p className="text-red-500 text-sm mt-2">{errors.moodScore}</p>
          )}
        </div>

        {/* Time of Day Selection */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Time of day
          </label>
          <div className="grid grid-cols-3 gap-3">
            {TIME_OF_DAY_OPTIONS.map((time) => (
              <button
                key={time.value}
                type="button"
                onClick={() => handleTimeOfDaySelect(time.value)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  ${formData.timeOfDay === time.value
                    ? 'bg-primary-100 border-primary-500 text-primary-700'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{time.emoji}</div>
                  <div className="text-sm font-medium">{time.label}</div>
                  <div className="text-xs text-gray-500">{time.timeRange}</div>
                </div>
              </button>
            ))}
          </div>
          {errors.timeOfDay && (
            <p className="text-red-500 text-sm mt-2">{errors.timeOfDay}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-lg font-semibold text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={handleNotesChange}
            placeholder="What's on your mind? Any specific thoughts or feelings you'd like to remember..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
            rows="4"
            maxLength="500"
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-500">
              {formData.notes.length}/500 characters
            </span>
            {errors.notes && (
              <p className="text-red-500 text-sm">{errors.notes}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Tags (optional)
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Add tags to categorize your mood (work, exercise, family, etc.)
          </p>
          
          {/* Selected Tags */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-primary-500 hover:text-primary-700 focus:outline-none"
                    aria-label={`Remove ${tag} tag`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag Input */}
          <div className="relative">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInput}
              onFocus={() => setShowTagSuggestions(tagInput.length > 0)}
              placeholder="Type a tag and press Enter..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              disabled={formData.tags.length >= 10}
            />
            
            {/* Tag Suggestions */}
            {showTagSuggestions && filteredTagSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {filteredTagSuggestions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {formData.tags.length >= 10 && (
            <p className="text-orange-500 text-sm mt-1">
              Maximum 10 tags allowed
            </p>
          )}
          {errors.tags && (
            <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
          )}
        </div>

        {/* Mood Recommendations */}
        {showRecommendations && formData.moodScore && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">
              💡 Suggestions for your mood:
            </h4>
            <ul className="text-blue-700 text-sm space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !formData.moodScore}
            className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {existingEntry ? 'Updating...' : 'Saving...'}
              </span>
            ) : (
              existingEntry ? 'Update Mood' : 'Log Mood'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-none border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MoodCheckIn; 
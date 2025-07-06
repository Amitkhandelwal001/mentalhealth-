import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { moodEmojis } from '../../utils/moodData';
import { apiCall } from '../../utils/api';

const QuickMoodCheck = ({ onMoodSubmitted }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setTimeOfDay(getCurrentTimeOfDay());
    setShowForm(true);
  };

  const handleQuickSubmit = async () => {
    if (!selectedMood || !timeOfDay) return;

    setIsSubmitting(true);
    try {
      const response = await apiCall('/mood', {
        method: 'POST',
        data: {
          moodScore: selectedMood.value,
          timeOfDay: timeOfDay,
          notes: `Quick check-in - ${selectedMood.label}`
        }
      });

      if (response.success) {
        // Reset form
        setSelectedMood(null);
        setTimeOfDay('');
        setShowForm(false);
        
        // Call callback if provided
        if (onMoodSubmitted) {
          onMoodSubmitted(response.data);
        }
      }
    } catch (error) {
      console.error('Error submitting mood:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFullCheckIn = () => {
    navigate('/mood-checkin');
  };

  if (showForm) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Mood Check</h3>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">{selectedMood.emoji}</div>
            <div className="text-lg font-medium text-gray-800">{selectedMood.label}</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Time of Day
            </label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleQuickSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:bg-blue-300"
            >
              {isSubmitting ? 'Saving...' : 'Quick Save'}
            </button>
            <button
              onClick={handleFullCheckIn}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Full Check-In
            </button>
          </div>

          <button
            onClick={() => setShowForm(false)}
            className="w-full text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Mood Check</h3>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-600 text-center">
          How are you feeling right now?
        </p>

        <div className="flex justify-center space-x-2">
          {moodEmojis.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood)}
              className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 flex items-center justify-center text-2xl hover:scale-110"
              title={mood.label}
            >
              {mood.emoji}
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleFullCheckIn}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Want to add more details? →
          </button>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">💡</span>
            <div className="text-sm text-blue-800">
              <strong>Pro tip:</strong> Regular mood tracking helps you identify patterns and triggers in your mental health journey.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickMoodCheck; 
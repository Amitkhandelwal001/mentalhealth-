import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { communityAPI } from '../../utils/api';
import { 
  postCategories, 
  commonTags, 
  validatePost, 
  containsCrisisKeywords, 
  crisisResources 
} from '../../utils/communityData';
import { showCommunitySuccess, showCommunityError, showValidationError, showCrisisAlert } from '../../utils/toast';

const CreatePost = ({ onPostCreated, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: []
  });
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCrisisHelp, setShowCrisisHelp] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check for crisis keywords
    if (name === 'content' || name === 'title') {
      const hasCrisisKeywords = containsCrisisKeywords(value);
      setShowCrisisHelp(hasCrisisKeywords);
      
      // Show crisis alert toast if keywords detected
      if (hasCrisisKeywords && !showCrisisHelp) {
        showCrisisAlert();
      }
    }

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleAddTag = (tag) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag(tagInput.trim().toLowerCase());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validatePost(formData.title, formData.content);
    if (!validation.isValid) {
      setErrors(validation.errors);
      
      // Show validation error toast
      if (validation.errors.some(err => err.includes('title'))) {
        showValidationError('required');
      } else if (validation.errors.some(err => err.includes('content'))) {
        showValidationError('content');
      } else {
        showValidationError('required');
      }
      
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await communityAPI.createPost(formData);
      
      // Show crisis resources if returned
      if (response.crisisResources) {
        setShowCrisisHelp(true);
        showCrisisAlert();
      }

      // Show success toast
      showCommunitySuccess('post');

      // Reset form
      setFormData({
        title: '',
        content: '',
        category: 'general',
        tags: []
      });
      setTagInput('');

      // Notify parent component
      if (onPostCreated) {
        // Access nested data structure (response.data.data.post)
        const responseData = response.data.data || response.data;
        onPostCreated(responseData.post);
      }

    } catch (error) {
      console.error('Error creating post:', error);
      
      if (error.response?.data?.reasons) {
        const errorMessage = 'Content contains inappropriate language and cannot be posted';
        setErrors([errorMessage]);
        showCommunityError(errorMessage);
      } else {
        const errorMessage = error.response?.data?.error || 'Failed to create post';
        setErrors([errorMessage]);
        showCommunityError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <p className="text-gray-600 mb-4">Please log in to create a post</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Create New Post
        </h3>

        {/* Crisis Help Modal */}
        {showCrisisHelp && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <span className="text-red-600 text-xl mr-3">⚠️</span>
              <div>
                <h4 className="font-semibold text-red-800 mb-2">
                  Crisis Support Available
                </h4>
                <p className="text-red-700 text-sm mb-3">
                  {crisisResources.message}
                </p>
                <div className="space-y-2 text-sm">
                  {crisisResources.resources.map((resource, index) => (
                    <div key={index} className="text-red-700">
                      <strong>{resource.name}:</strong>{' '}
                      {resource.number && <span className="font-mono">{resource.number}</span>}
                      {resource.website && (
                        <a 
                          href={resource.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-800 underline"
                        >
                          Visit Website
                        </a>
                      )}
                      <div className="text-red-600">{resource.description}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowCrisisHelp(false)}
                  className="mt-3 text-red-600 hover:text-red-800 text-sm underline"
                >
                  Continue with post
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="What's on your mind?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.title.length}/200 characters
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {postCategories.slice(1).map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Share your thoughts, experiences, or questions..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={2000}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.content.length}/2000 characters
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add a tag and press Enter"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={30}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.tags.length}/5 tags
            </div>

            {/* Common Tags */}
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Suggested tags:</p>
              <div className="flex flex-wrap gap-1">
                {commonTags.slice(0, 8).map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    disabled={formData.tags.includes(tag) || formData.tags.length >= 5}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <ul className="text-red-700 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost; 
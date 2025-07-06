import React from 'react';
import Navigation from '../components/common/Navigation';
import ProtectedRoute from '../components/common/ProtectedRoute';

const GetHelpPage = () => {
  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "Free, confidential 24/7 support for people in distress",
      type: "call-text",
      urgent: true
    },
    {
      name: "Crisis Text Line",
      phone: "741741",
      description: "Text HOME to connect with a Crisis Counselor",
      type: "text",
      urgent: true
    },
    {
      name: "National Domestic Violence Hotline",
      phone: "1-800-799-7233",
      description: "24/7 support for domestic violence survivors",
      type: "call-text",
      urgent: true
    },
    {
      name: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      description: "Treatment referral and information service",
      type: "call",
      urgent: false
    },
    {
      name: "LGBT National Hotline",
      phone: "1-888-843-4564",
      description: "Support for LGBTQ+ individuals and allies",
      type: "call",
      urgent: false
    },
    {
      name: "National Eating Disorders Association",
      phone: "1-800-931-2237",
      description: "Support for eating disorder concerns",
      type: "call",
      urgent: false
    }
  ];

  const internationalResources = [
    {
      country: "United Kingdom",
      name: "Samaritans",
      phone: "116 123",
      description: "Free 24-hour emotional support"
    },
    {
      country: "Canada",
      name: "Canada Suicide Prevention Service",
      phone: "1-833-456-4566",
      description: "24/7 bilingual crisis support"
    },
    {
      country: "Australia",
      name: "Lifeline",
      phone: "13 11 14",
      description: "24-hour crisis support and suicide prevention"
    },
    {
      country: "India",
      name: "AASRA",
      phone: "+91 9820466726",
      description: "24/7 crisis helpline"
    }
  ];

  const mentalHealthResources = [
    {
      title: "Find a Therapist",
      description: "Psychology Today's therapist directory",
      url: "https://www.psychologytoday.com/us/therapists",
      icon: "🔍"
    },
    {
      title: "Mental Health America",
      description: "Mental health screening and resources",
      url: "https://www.mhanational.org/",
      icon: "🧠"
    },
    {
      title: "National Alliance on Mental Illness (NAMI)",
      description: "Education, support, and advocacy",
      url: "https://www.nami.org/",
      icon: "🤝"
    },
    {
      title: "Crisis Text Line",
      description: "Free 24/7 text support",
      url: "https://www.crisistextline.org/",
      icon: "💬"
    },
    {
      title: "MindTools",
      description: "Self-help resources and coping strategies",
      url: "https://www.mindtools.com/",
      icon: "🛠️"
    },
    {
      title: "Headspace",
      description: "Meditation and mindfulness app",
      url: "https://www.headspace.com/",
      icon: "🧘"
    }
  ];

  const warningSignsData = [
    {
      category: "Emotional Signs",
      signs: [
        "Persistent sadness or hopelessness",
        "Extreme mood changes",
        "Loss of interest in activities",
        "Feeling overwhelmed or out of control",
        "Increased anxiety or panic attacks"
      ]
    },
    {
      category: "Behavioral Signs",
      signs: [
        "Withdrawing from friends and family",
        "Changes in sleep or appetite",
        "Increased use of alcohol or drugs",
        "Reckless or self-destructive behavior",
        "Giving away possessions"
      ]
    },
    {
      category: "Physical Signs",
      signs: [
        "Unexplained aches and pains",
        "Fatigue or lack of energy",
        "Neglecting personal hygiene",
        "Frequent illness",
        "Changes in weight"
      ]
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get Help & Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You don't have to face mental health challenges alone. 
              Here are resources to help you get the support you need.
            </p>
          </div>

          {/* Crisis Resources */}
          <div className="mb-12">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🆘</span>
                <h2 className="text-2xl font-bold text-red-800">
                  Crisis Resources - Get Help Now
                </h2>
              </div>
              <p className="text-red-700 mb-4">
                If you're having thoughts of self-harm or suicide, please reach out immediately. 
                Help is available 24/7.
              </p>
              <div className="bg-red-100 rounded-lg p-4">
                <p className="text-red-800 font-medium">
                  🚨 If you're in immediate danger, call 911 or go to your nearest emergency room.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {crisisResources.map((resource, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-lg shadow-sm border p-6 ${
                    resource.urgent ? 'border-red-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {resource.name}
                    </h3>
                    {resource.urgent && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                        URGENT
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">📞</span>
                      <a 
                        href={`tel:${resource.phone}`}
                        className="text-2xl font-bold text-blue-600 hover:text-blue-700"
                      >
                        {resource.phone}
                      </a>
                    </div>
                    <p className="text-gray-600 text-sm ml-8">
                      {resource.type === 'call-text' && 'Call or Text'}
                      {resource.type === 'call' && 'Call'}
                      {resource.type === 'text' && 'Text'}
                    </p>
                  </div>
                  
                  <p className="text-gray-700">
                    {resource.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* International Resources */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">🌍</span>
              International Crisis Support
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {internationalResources.map((resource, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-xl mr-2">🏴</span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {resource.country}
                    </h3>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    {resource.name}
                  </h4>
                  <div className="mb-3">
                    <a 
                      href={`tel:${resource.phone}`}
                      className="text-lg font-bold text-blue-600 hover:text-blue-700"
                    >
                      {resource.phone}
                    </a>
                  </div>
                  <p className="text-gray-600">
                    {resource.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Need more international resources?</strong> Visit{' '}
                <a 
                  href="https://findahelpline.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  findahelpline.com
                </a>
                {' '}for a comprehensive directory of crisis lines worldwide.
              </p>
            </div>
          </div>

          {/* Mental Health Resources */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">🧠</span>
              Mental Health Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentalHealthResources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{resource.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {resource.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {resource.description}
                  </p>
                  <div className="mt-4 text-blue-600 text-sm font-medium">
                    Visit Website →
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Warning Signs */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">⚠️</span>
              Warning Signs to Watch For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {warningSignsData.map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {category.category}
                  </h3>
                  <ul className="space-y-2">
                    {category.signs.map((sign, signIndex) => (
                      <li key={signIndex} className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        <span className="text-gray-700">{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Support Tips */}
          <div className="bg-green-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">💚</span>
              How to Support Someone in Crisis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-green-800">
              <div>
                <h3 className="font-semibold mb-3">Do:</h3>
                <ul className="space-y-2">
                  <li>• Listen without judgment</li>
                  <li>• Take their concerns seriously</li>
                  <li>• Encourage professional help</li>
                  <li>• Stay with them if they're in immediate danger</li>
                  <li>• Follow up regularly</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Don't:</h3>
                <ul className="space-y-2">
                  <li>• Minimize their feelings</li>
                  <li>• Promise to keep secrets about self-harm</li>
                  <li>• Try to solve all their problems</li>
                  <li>• Leave them alone in crisis</li>
                  <li>• Give up on them</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <span className="text-4xl mb-4 block">🌟</span>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              You Are Not Alone
            </h3>
            <p className="text-blue-800 text-lg max-w-3xl mx-auto">
              Mental health challenges are real, but they are treatable. 
              Reaching out for help is a sign of strength, not weakness. 
              Take the first step today.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default GetHelpPage; 
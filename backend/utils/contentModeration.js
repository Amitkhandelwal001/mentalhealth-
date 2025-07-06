// Content moderation utility for community posts
const badWords = [
  // Profanity (basic list - in production, use a more comprehensive list)
  'fuck', 'shit', 'bitch', 'damn', 'hell', 'ass', 'piss', 'crap',
  'bastard', 'whore', 'slut', 'retard', 'fag', 'gay', 'homo',
  // Harassment terms
  'kill yourself', 'kys', 'die', 'hate', 'stupid', 'idiot', 'moron',
  'loser', 'pathetic', 'worthless', 'useless', 'trash', 'garbage'
];

const crisisKeywords = [
  'suicide', 'kill myself', 'end it all', 'self harm', 'cutting',
  'overdose', 'pills', 'jump', 'bridge', 'rope', 'gun', 'knife',
  'blade', 'razor', 'hurt myself', 'hate myself', 'want to die',
  'better off dead', 'no point', 'give up', 'cant take it',
  'end my life', 'kill me', 'wish i was dead'
];

const spamPatterns = [
  // Repeated characters
  /(.)\1{4,}/g,
  // All caps (more than 50% of text)
  /^[A-Z\s]{10,}$/,
  // Excessive punctuation
  /[!?]{3,}/g,
  // URLs (basic detection)
  /https?:\/\/[^\s]+/g
];

/**
 * Check if content contains bad words
 * @param {string} text - Text to check
 * @returns {object} - Result with isBad flag and matched words
 */
function checkBadWords(text) {
  const lowerText = text.toLowerCase();
  const foundBadWords = badWords.filter(word => lowerText.includes(word));
  
  return {
    isBad: foundBadWords.length > 0,
    badWords: foundBadWords,
    severity: foundBadWords.length > 3 ? 'high' : foundBadWords.length > 1 ? 'medium' : 'low'
  };
}

/**
 * Check if content contains crisis keywords
 * @param {string} text - Text to check
 * @returns {object} - Result with isCrisis flag and matched keywords
 */
function checkCrisisContent(text) {
  const lowerText = text.toLowerCase();
  const foundCrisisWords = crisisKeywords.filter(word => lowerText.includes(word));
  
  return {
    isCrisis: foundCrisisWords.length > 0,
    crisisKeywords: foundCrisisWords,
    severity: foundCrisisWords.length > 2 ? 'high' : foundCrisisWords.length > 1 ? 'medium' : 'low'
  };
}

/**
 * Check if content appears to be spam
 * @param {string} text - Text to check
 * @returns {object} - Result with isSpam flag and reasons
 */
function checkSpamContent(text) {
  const spamReasons = [];
  
  // Check each spam pattern
  spamPatterns.forEach((pattern, index) => {
    if (pattern.test(text)) {
      switch(index) {
        case 0:
          spamReasons.push('Excessive repeated characters');
          break;
        case 1:
          spamReasons.push('All caps text');
          break;
        case 2:
          spamReasons.push('Excessive punctuation');
          break;
        case 3:
          spamReasons.push('Contains URLs');
          break;
      }
    }
  });
  
  // Check text length (too short might be spam)
  if (text.length < 10) {
    spamReasons.push('Content too short');
  }
  
  // Check for excessive emojis
  const emojiCount = (text.match(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu) || []).length;
  if (emojiCount > 10) {
    spamReasons.push('Excessive emojis');
  }
  
  return {
    isSpam: spamReasons.length > 0,
    spamReasons: spamReasons,
    severity: spamReasons.length > 2 ? 'high' : spamReasons.length > 1 ? 'medium' : 'low'
  };
}

/**
 * Clean text by removing/replacing inappropriate content
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text
 */
function cleanText(text) {
  let cleanedText = text;
  
  // Replace bad words with asterisks
  badWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    cleanedText = cleanedText.replace(regex, '*'.repeat(word.length));
  });
  
  // Remove excessive repeated characters
  cleanedText = cleanedText.replace(/(.)\1{4,}/g, '$1$1$1');
  
  // Clean up excessive punctuation
  cleanedText = cleanedText.replace(/[!?]{3,}/g, '!!!');
  
  return cleanedText.trim();
}

/**
 * Comprehensive content moderation
 * @param {string} text - Text to moderate
 * @returns {object} - Moderation result
 */
function moderateContent(text) {
  const badWordCheck = checkBadWords(text);
  const crisisCheck = checkCrisisContent(text);
  const spamCheck = checkSpamContent(text);
  
  const shouldBlock = badWordCheck.isBad || spamCheck.isSpam;
  const needsReview = crisisCheck.isCrisis || badWordCheck.severity === 'high' || spamCheck.severity === 'high';
  
  return {
    isAllowed: !shouldBlock,
    needsReview: needsReview,
    isCrisis: crisisCheck.isCrisis,
    cleanedText: cleanText(text),
    reasons: {
      badWords: badWordCheck.isBad ? badWordCheck.badWords : [],
      crisisKeywords: crisisCheck.isCrisis ? crisisCheck.crisisKeywords : [],
      spamReasons: spamCheck.isSpam ? spamCheck.spamReasons : []
    },
    severity: {
      badWords: badWordCheck.severity,
      crisis: crisisCheck.severity,
      spam: spamCheck.severity
    }
  };
}

/**
 * Get crisis help resources
 * @returns {object} - Crisis help information
 */
function getCrisisResources() {
  return {
    message: "We noticed your post might indicate you're going through a difficult time. Please know that you're not alone and help is available.",
    resources: [
      {
        name: "National Suicide Prevention Lifeline",
        number: "988",
        description: "24/7 free and confidential support"
      },
      {
        name: "Crisis Text Line",
        number: "Text HOME to 741741",
        description: "24/7 crisis counseling via text"
      },
      {
        name: "International Association for Suicide Prevention",
        website: "https://www.iasp.info/resources/Crisis_Centres/",
        description: "Crisis centers worldwide"
      }
    ]
  };
}

module.exports = {
  moderateContent,
  checkBadWords,
  checkCrisisContent,
  checkSpamContent,
  cleanText,
  getCrisisResources,
  badWords,
  crisisKeywords
}; 
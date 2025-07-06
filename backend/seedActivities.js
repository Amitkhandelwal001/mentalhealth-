const mongoose = require('mongoose');
const Activity = require('./models/Activity');
require('dotenv').config();

const activities = [
  // Breathing Exercises (5)
  {
    name: "4-7-8 Breathing",
    category: "breathing",
    description: "A simple breathing technique to help reduce anxiety and promote relaxation.",
    instructions: [
      "Sit comfortably with your back straight",
      "Exhale completely through your mouth",
      "Inhale through your nose for 4 counts",
      "Hold your breath for 7 counts",
      "Exhale through your mouth for 8 counts",
      "Repeat 3-4 times"
    ],
    duration: 5,
    difficultyLevel: "beginner",
    tags: ["anxiety", "relaxation", "sleep"],
    icon: "🫁",
    color: "#3B82F6"
  },
  {
    name: "Box Breathing",
    category: "breathing",
    description: "A structured breathing pattern used by Navy SEALs to maintain focus and calm.",
    instructions: [
      "Sit with your feet flat on the floor",
      "Inhale for 4 counts",
      "Hold for 4 counts",
      "Exhale for 4 counts",
      "Hold empty for 4 counts",
      "Repeat for 5-10 cycles"
    ],
    duration: 8,
    difficultyLevel: "intermediate",
    tags: ["focus", "stress", "performance"],
    icon: "📦",
    color: "#3B82F6"
  },
  {
    name: "Belly Breathing",
    category: "breathing",
    description: "Deep diaphragmatic breathing to activate the body's relaxation response.",
    instructions: [
      "Lie down or sit comfortably",
      "Place one hand on your chest, one on your belly",
      "Breathe slowly through your nose",
      "Feel your belly rise more than your chest",
      "Exhale slowly through your mouth",
      "Continue for 5-10 minutes"
    ],
    duration: 10,
    difficultyLevel: "beginner",
    tags: ["relaxation", "stress", "sleep"],
    icon: "🤰",
    color: "#3B82F6"
  },
  {
    name: "Alternate Nostril Breathing",
    category: "breathing",
    description: "A yogic breathing technique to balance the nervous system and improve focus.",
    instructions: [
      "Sit comfortably with spine straight",
      "Use your right thumb to close your right nostril",
      "Inhale through your left nostril",
      "Close left nostril with ring finger, release right",
      "Exhale through right nostril",
      "Inhale through right nostril",
      "Switch and exhale through left",
      "Continue for 5-10 rounds"
    ],
    duration: 10,
    difficultyLevel: "advanced",
    tags: ["focus", "balance", "meditation"],
    icon: "🧘",
    color: "#3B82F6"
  },
  {
    name: "Coherent Breathing",
    category: "breathing",
    description: "Rhythmic breathing at 5 breaths per minute to optimize heart rate variability.",
    instructions: [
      "Sit or lie down comfortably",
      "Inhale for 6 counts",
      "Exhale for 6 counts",
      "Maintain smooth, even breathing",
      "Continue for 10-20 minutes",
      "Focus on the rhythm and flow"
    ],
    duration: 15,
    difficultyLevel: "intermediate",
    tags: ["heart", "coherence", "calm"],
    icon: "💗",
    color: "#3B82F6"
  },

  // Journaling Prompts (5)
  {
    name: "Gratitude Journaling",
    category: "journaling",
    description: "Write down three things you're grateful for to shift focus to positive aspects of life.",
    instructions: [
      "Find a quiet space with your journal",
      "Write today's date at the top",
      "List 3 things you're grateful for today",
      "For each item, write why you're grateful",
      "Notice how this makes you feel",
      "Read your entries when you need a mood boost"
    ],
    duration: 10,
    difficultyLevel: "beginner",
    tags: ["gratitude", "positivity", "mood"],
    icon: "📝",
    color: "#10B981"
  },
  {
    name: "Emotion Processing",
    category: "journaling",
    description: "Explore and process difficult emotions through guided writing prompts.",
    instructions: [
      "Identify the emotion you're feeling",
      "Write: 'I am feeling...' and describe it",
      "Ask: 'What triggered this feeling?'",
      "Write: 'What does my body feel like?'",
      "Ask: 'What do I need right now?'",
      "Write: 'How can I care for myself?'"
    ],
    duration: 15,
    difficultyLevel: "intermediate",
    tags: ["emotions", "processing", "self-care"],
    icon: "💭",
    color: "#10B981"
  },
  {
    name: "Future Self Visioning",
    category: "journaling",
    description: "Connect with your future self to gain clarity on goals and values.",
    instructions: [
      "Imagine yourself 5 years from now",
      "Write a letter from your future self",
      "What advice would they give you?",
      "What are they proud of you for?",
      "What habits helped you get there?",
      "What would they want you to know?"
    ],
    duration: 20,
    difficultyLevel: "advanced",
    tags: ["goals", "vision", "motivation"],
    icon: "🔮",
    color: "#10B981"
  },
  {
    name: "Daily Reflection",
    category: "journaling",
    description: "End-of-day reflection to process experiences and set intentions.",
    instructions: [
      "Write about your day's highlights",
      "What went well today?",
      "What was challenging?",
      "What did you learn about yourself?",
      "What are you looking forward to tomorrow?",
      "Set one intention for tomorrow"
    ],
    duration: 10,
    difficultyLevel: "beginner",
    tags: ["reflection", "growth", "intention"],
    icon: "🌅",
    color: "#10B981"
  },
  {
    name: "Stream of Consciousness",
    category: "journaling",
    description: "Free-flowing writing to clear mental clutter and access inner wisdom.",
    instructions: [
      "Set a timer for 10 minutes",
      "Write continuously without stopping",
      "Don't worry about grammar or spelling",
      "If you get stuck, write 'I don't know what to write'",
      "Keep your pen moving the entire time",
      "Read what you wrote when finished"
    ],
    duration: 10,
    difficultyLevel: "intermediate",
    tags: ["clarity", "creativity", "mental clarity"],
    icon: "🌊",
    color: "#10B981"
  },

  // Physical Activities (5)
  {
    name: "Desk Stretches",
    category: "physical",
    description: "Simple stretches to relieve tension from sitting at a desk.",
    instructions: [
      "Neck rolls: Roll your head in circles",
      "Shoulder shrugs: Lift shoulders up and release",
      "Arm circles: Extend arms and make circles",
      "Spinal twist: Twist your torso left and right",
      "Leg extensions: Straighten legs under desk",
      "Ankle rolls: Roll your feet in circles"
    ],
    duration: 5,
    difficultyLevel: "beginner",
    tags: ["tension", "desk", "workplace"],
    icon: "🪑",
    color: "#F59E0B"
  },
  {
    name: "Walking Meditation",
    category: "physical",
    description: "Mindful walking to combine movement with meditation.",
    instructions: [
      "Find a quiet path or space",
      "Start walking at a slow, comfortable pace",
      "Focus on the sensation of your feet touching the ground",
      "Notice your breathing as you walk",
      "If your mind wanders, gently return focus to walking",
      "End with a few moments of standing still"
    ],
    duration: 15,
    difficultyLevel: "beginner",
    tags: ["mindfulness", "movement", "nature"],
    icon: "🚶",
    color: "#F59E0B"
  },
  {
    name: "Yoga Flow",
    category: "physical",
    description: "Gentle yoga sequence to improve flexibility and reduce stress.",
    instructions: [
      "Start in child's pose for 1 minute",
      "Move to downward dog",
      "Step forward into forward fold",
      "Rise to mountain pose",
      "Reach arms up to sky",
      "Flow through this sequence 5 times",
      "End in savasana for 2 minutes"
    ],
    duration: 20,
    difficultyLevel: "intermediate",
    tags: ["flexibility", "stress", "flow"],
    icon: "🧘‍♀️",
    color: "#F59E0B"
  },
  {
    name: "Dance Break",
    category: "physical",
    description: "Free-form dancing to release energy and boost mood.",
    instructions: [
      "Put on your favorite upbeat song",
      "Start moving to the rhythm",
      "Don't worry about looking good",
      "Let your body move naturally",
      "Focus on how the music makes you feel",
      "Dance for 2-3 songs",
      "End with some deep breaths"
    ],
    duration: 10,
    difficultyLevel: "beginner",
    tags: ["energy", "mood", "creativity"],
    icon: "💃",
    color: "#F59E0B"
  },
  {
    name: "Progressive Muscle Relaxation",
    category: "physical",
    description: "Systematic tensing and relaxing of muscle groups to reduce physical tension.",
    instructions: [
      "Lie down comfortably",
      "Start with your toes - tense for 5 seconds, then relax",
      "Move to your calves - tense and relax",
      "Continue with thighs, glutes, abdomen",
      "Move to arms, shoulders, neck, face",
      "Tense each muscle group for 5 seconds",
      "Notice the contrast between tension and relaxation"
    ],
    duration: 25,
    difficultyLevel: "advanced",
    tags: ["tension", "relaxation", "body"],
    icon: "💪",
    color: "#F59E0B"
  },

  // Mindfulness Exercises (5)
  {
    name: "5-4-3-2-1 Grounding",
    category: "mindfulness",
    description: "A grounding technique using your senses to anchor yourself in the present moment.",
    instructions: [
      "Notice 5 things you can see",
      "Notice 4 things you can touch",
      "Notice 3 things you can hear",
      "Notice 2 things you can smell",
      "Notice 1 thing you can taste",
      "Take a deep breath and feel grounded"
    ],
    duration: 5,
    difficultyLevel: "beginner",
    tags: ["grounding", "anxiety", "present"],
    icon: "🌟",
    color: "#8B5CF6"
  },
  {
    name: "Body Scan Meditation",
    category: "mindfulness",
    description: "Systematic awareness of body sensations to develop mindfulness and relaxation.",
    instructions: [
      "Lie down comfortably",
      "Close your eyes and breathe naturally",
      "Start at the top of your head",
      "Slowly move attention down through your body",
      "Notice sensations without trying to change them",
      "End at your toes",
      "Rest in whole-body awareness"
    ],
    duration: 15,
    difficultyLevel: "intermediate",
    tags: ["awareness", "relaxation", "meditation"],
    icon: "🧘‍♂️",
    color: "#8B5CF6"
  },
  {
    name: "Loving-Kindness Meditation",
    category: "mindfulness",
    description: "Cultivate compassion and kindness towards yourself and others.",
    instructions: [
      "Sit comfortably and close your eyes",
      "Start with yourself: 'May I be happy, may I be healthy'",
      "Think of a loved one: 'May you be happy, may you be healthy'",
      "Think of a neutral person: 'May you be happy, may you be healthy'",
      "Think of someone difficult: 'May you be happy, may you be healthy'",
      "Extend to all beings: 'May all beings be happy and healthy'"
    ],
    duration: 20,
    difficultyLevel: "advanced",
    tags: ["compassion", "kindness", "relationships"],
    icon: "💝",
    color: "#8B5CF6"
  },
  {
    name: "Mindful Eating",
    category: "mindfulness",
    description: "Practice mindful awareness while eating to enhance satisfaction and digestion.",
    instructions: [
      "Choose a small snack or meal",
      "Look at the food and notice colors, textures",
      "Smell the food before eating",
      "Take a small bite and chew slowly",
      "Notice flavors, textures, temperature",
      "Eat without distractions like TV or phone",
      "Pay attention to hunger and fullness cues"
    ],
    duration: 15,
    difficultyLevel: "beginner",
    tags: ["eating", "awareness", "satisfaction"],
    icon: "🍎",
    color: "#8B5CF6"
  },
  {
    name: "Observing Thoughts",
    category: "mindfulness",
    description: "Practice observing thoughts without judgment to develop mental clarity.",
    instructions: [
      "Sit quietly and close your eyes",
      "Notice when thoughts arise",
      "Don't try to stop or change them",
      "Imagine thoughts as clouds passing in the sky",
      "Return attention to your breath",
      "Notice the space between thoughts",
      "Practice for 10-15 minutes"
    ],
    duration: 15,
    difficultyLevel: "intermediate",
    tags: ["thoughts", "awareness", "meditation"],
    icon: "☁️",
    color: "#8B5CF6"
  }
];

const seedActivities = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 Connected to MongoDB for seeding');

    // Clear existing activities
    await Activity.deleteMany({});
    console.log('🗑️ Cleared existing activities');

    // Insert new activities
    const result = await Activity.insertMany(activities);
    console.log(`✅ Seeded ${result.length} activities successfully`);

    // Log summary
    const categoryCount = activities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 Activities by category:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} activities`);
    });

    console.log('\n🎯 Difficulty levels:');
    const difficultyCount = activities.reduce((acc, activity) => {
      acc[activity.difficultyLevel] = (acc[activity.difficultyLevel] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(difficultyCount).forEach(([level, count]) => {
      console.log(`  ${level}: ${count} activities`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding activities:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedActivities();
}

module.exports = { seedActivities, activities }; 
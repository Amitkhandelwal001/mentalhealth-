const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username must be less than 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  profile: {
    displayName: {
      type: String,
      default: function() {
        return this.username;
      }
    },
    avatar: {
      type: String,
      default: '😊' // Default emoji avatar
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    publicProfile: {
      type: Boolean,
      default: false // For community features
    },
    reminderTime: {
      type: String,
      default: '09:00' // 9 AM default for daily check-ins
    }
  },
  stats: {
    totalCheckIns: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    points: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    totalActivities: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true // Creates createdAt and updatedAt automatically
});

// Note: email and username indexes are automatically created by unique: true
// No need for explicit index definitions

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('passwordHash')) {
    return next();
  }

  try {
    // Hash password with salt rounds of 12
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Instance method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    username: this.username,
    displayName: this.profile.displayName,
    avatar: this.profile.avatar,
    joinDate: this.profile.joinDate,
    stats: this.stats
  };
};

// Static method to find user by email or username
userSchema.statics.findByCredentials = async function(emailOrUsername) {
  const user = await this.findOne({
    $or: [
      { email: emailOrUsername.toLowerCase() },
      { username: emailOrUsername }
    ]
  });
  return user;
};

module.exports = mongoose.model('User', userSchema); 
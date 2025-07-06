# MindCare Project Implementation TODO

## Project Overview
- **Project**: MindCare - Mental Health Companion
- **Team**: 3 beginner developers
- **Timeline**: 10 weeks
- **Tech Stack**: React.js + Node.js/Express + MongoDB Atlas
- **Deployment**: Vercel (Frontend) + Render (Backend)

---

## PHASE 1: Foundation & Setup (Weeks 1-2)

### Week 1: Project Setup & Environment

#### Backend Setup
- [X] Create `backend` folder in project root
- [X] Initialize Node.js project (`npm init -y`)
- [X] Install core dependencies:
  ```bash
  npm install express mongoose bcryptjs jsonwebtoken cors dotenv
  npm install -D nodemon
  ```
- [X] Create basic folder structure:
  ```
  backend/
  ├── controllers/
  ├── models/
  ├── routes/
  ├── middleware/
  ├── utils/
  ├── .env
  ├── server.js
  └── package.json
  ```
- [X] Create basic `server.js` with Express setup
- [X] Set up MongoDB Atlas connection string in `.env`
- [ ] Test MongoDB connection *(Will complete in Week 2 with real MongoDB URI)*
- [X] Create basic health check endpoint (`GET /api/health`)
- [X] Set up nodemon script in package.json
- [X] Test server runs successfully on localhost:3001 *(Changed from 5000 due to macOS AirPlay conflict)*

#### Frontend Setup
- [X] Create `frontend` folder in project root
- [X] Initialize React app (`npx create-react-app .`)
- [X] Install dependencies:
  ```bash
  npm install axios react-router-dom chart.js react-chartjs-2
  npm install -D tailwindcss postcss autoprefixer
  ```
- [X] Configure Tailwind CSS:
  - [X] Run `npx tailwindcss init -p` *(Created manually)*
  - [X] Update `tailwind.config.js` with content paths
  - [X] Add Tailwind directives to `src/index.css`
- [X] Create folder structure:
  ```
  frontend/src/
  ├── components/
  │   ├── common/
  │   ├── forms/
  │   └── charts/
  ├── pages/
  ├── context/
  ├── utils/
  └── App.js
  ```
- [X] Clean up default React files (App.css, logo.svg, etc.)
- [X] Set up basic routing with React Router
- [X] Add Inter font from Google Fonts
- [X] Create basic CSS custom properties from frontend.md
- [X] Test frontend runs successfully on localhost:3000

#### Development Environment
- [X] Create `.gitignore` files for both frontend and backend
- [X] Set up environment variables structure
- [X] Create basic README for setup instructions
- [X] Test that both frontend and backend can run simultaneously

### Week 2: Authentication System

#### Backend Authentication
- [X] Create User model (`models/User.js`):
  - [X] username (unique, 3-20 characters)
  - [X] email (unique, validated)
  - [X] passwordHash (bcrypt)
  - [X] profile object (displayName, joinDate, timezone)
  - [X] stats object (totalCheckIns, currentStreak, points)
  - [X] timestamps (createdAt, updatedAt)
- [X] Create auth utility functions (`utils/auth.js`):
  - [X] Password hashing with bcrypt
  - [X] JWT token generation
  - [X] JWT token verification
- [X] Create auth middleware (`middleware/auth.js`):
  - [X] Verify JWT token
  - [X] Attach user to request object
  - [X] Handle authentication errors
- [X] Create auth controller (`controllers/authController.js`):
  - [X] Register function with validation
  - [X] Login function with email/password check
  - [X] Get current user function
- [X] Create auth routes (`routes/auth.js`):
  - [X] POST /api/auth/register
  - [X] POST /api/auth/login
  - [X] GET /api/auth/me
- [X] Add input validation and error handling
- [X] Test all auth endpoints with Postman/Thunder Client

#### Frontend Authentication
- [X] Create AuthContext (`context/AuthContext.js`):
  - [X] User state management
  - [X] Login/logout functions
  - [X] Token storage in localStorage
  - [X] Auto-logout on token expiration
- [X] Create auth utility functions (`utils/auth.js`):
  - [X] API request interceptors
  - [X] Token management
  - [X] Error handling
- [X] Create auth components:
  - [X] Login form (`components/forms/LoginForm.js`)
  - [X] Register form (`components/forms/RegisterForm.js`)
  - [X] Protected route wrapper (`components/common/ProtectedRoute.js`)
- [X] Create auth pages:
  - [X] Login page (`pages/LoginPage.js`)
  - [X] Register page (`pages/RegisterPage.js`)
- [X] Implement form validation:
  - [X] Email format validation
  - [X] Password strength requirements
  - [X] Username length validation
- [X] Add loading states and error messages
- [X] Style forms using frontend.md design system
- [X] Set up navigation between login/register

#### Integration & Testing
- [X] Connect frontend auth forms to backend APIs
- [X] Test complete registration flow
- [X] Test complete login flow
- [X] Test protected route functionality
- [X] Test token persistence across browser refresh
- [X] Test logout functionality
- [X] Handle and display API errors properly

### Phase 1 Testing Checklist
- [X] **Backend Tests**:
  - [X] Server starts without errors
  - [X] MongoDB connection successful
  - [X] All auth endpoints respond correctly
  - [X] Password hashing works
  - [X] JWT tokens generate and verify
  - [X] Input validation prevents invalid data
- [X] **Frontend Tests**:
  - [X] App loads without console errors
  - [X] Tailwind CSS styling works
  - [X] Routing between pages works
  - [X] Forms submit and validate properly
  - [X] Auth state persists correctly
- [X] **Integration Tests**:
  - [X] Registration creates user in database
  - [X] Login returns valid JWT token
  - [X] Protected routes redirect when not authenticated
  - [X] Error messages display for invalid inputs
  - [X] Mobile responsive design works

---

## PHASE 2: Core Features (Weeks 3-5)

### Week 3: Mood Tracking System

#### Backend Mood Tracking
- [X] Create MoodEntry model (`models/MoodEntry.js`):
  - [X] userId (reference to User)
  - [X] moodScore (1-5 scale)
  - [X] moodEmoji (string representation)
  - [X] notes (optional text)
  - [X] tags (array of strings)
  - [X] timeOfDay (morning/afternoon/evening)
  - [X] date (date without time for aggregation)
  - [X] createdAt timestamp
- [X] Create mood controller (`controllers/moodController.js`):
  - [X] Create mood entry function
  - [X] Get user mood entries function
  - [X] Update mood entry function
  - [X] Delete mood entry function
  - [X] Get mood statistics function
- [X] Create mood routes (`routes/mood.js`):
  - [X] POST /api/mood (create entry)
  - [X] GET /api/mood (get entries with pagination)
  - [X] PUT /api/mood/:id (update entry)
  - [X] DELETE /api/mood/:id (delete entry)
  - [X] GET /api/mood/stats (get user statistics)
  - [X] GET /api/mood/trends (get trends for charts)
- [X] Add validation for mood data
- [X] Implement date-based queries
- [X] Test all mood endpoints

#### Frontend Mood Tracking
- [X] Create mood constants (`utils/moodData.js`):
  - [X] Mood emojis array with values and labels
  - [X] Time of day options
  - [X] Common mood tags
- [X] Create MoodCheckIn component (`components/forms/MoodCheckIn.js`):
  - [X] Emoji mood selector (5 options)
  - [X] Notes textarea
  - [X] Time of day selector
  - [X] Tags input (optional)
  - [X] Submit functionality
- [X] Create mood display components:
  - [X] MoodCard (`components/common/MoodCard.js`)
  - [X] MoodList (`components/common/MoodList.js`)
- [X] Create MoodCheckIn page (`pages/MoodCheckInPage.js`)
- [X] Style components using frontend.md design system
- [X] Add form validation and error handling
- [X] Implement success messages and feedback

#### Mood Data Integration
- [X] Connect mood form to backend API
- [X] Handle API responses and errors
- [X] Update user stats after mood entry
- [X] Test complete mood entry flow
- [X] Test mood data retrieval and display

#### Additional Implementation Completed
- [X] Enhanced DashboardPage with mood tracking integration
- [X] Added protected route for mood check-in page
- [X] Integrated mood tracking navigation in main app
- [X] Implemented user stats tracking (streaks, points, total check-ins)
- [X] Added duplicate prevention for same timeOfDay entries
- [X] Created mood recommendations system
- [X] Fixed ESLint warnings and code optimization
- [X] Created MoodHistoryPage for complete mood history display
- [X] Added recent mood entries section to Dashboard
- [X] Integrated proper navigation between mood-related pages
- [X] Added mood history route to main App routing

### Week 4: Dashboard & Data Visualization

#### Backend Dashboard Data
- [X] Enhance mood controller with analytics:
  - [X] Calculate average mood by day/week/month
  - [X] Calculate mood streaks
  - [X] Get mood trends over time
  - [X] Get recent mood entries
- [X] Update user stats calculation:
  - [X] Total check-ins counter
  - [X] Current streak calculation
  - [X] Longest streak tracking
- [X] Create dashboard endpoint (`GET /api/mood/dashboard`)
- [X] Test dashboard data accuracy

#### Frontend Dashboard
- [X] Install and configure Chart.js for React
- [X] Create chart components:
  - [X] MoodLineChart (`components/charts/MoodLineChart.js`)
  - [X] WeeklyMoodChart (`components/charts/WeeklyMoodChart.js`)
- [X] Create dashboard widgets:
  - [X] StreakCounter (`components/common/StreakCounter.js`)
  - [X] MoodSummary (`components/common/MoodSummary.js`)
  - [X] QuickMoodCheck (`components/common/QuickMoodCheck.js`)
- [X] Create Dashboard page (`pages/DashboardPage.js`):
  - [X] Welcome section with user name
  - [X] Current streak display
  - [X] Mood trend charts
  - [X] Recent mood entries
  - [X] Quick mood check-in button
- [X] Implement responsive dashboard layout
- [X] Add loading states for all data
- [X] Style using frontend.md design guidelines

#### Dashboard Integration & UX
- [X] Connect all dashboard components to APIs
- [X] Implement proper error handling
- [X] Add refresh functionality
- [X] Test dashboard performance with sample data
- [X] Ensure mobile responsiveness

#### Additional Features Implemented
- [X] Created comprehensive dashboard data aggregation endpoint
- [X] Implemented intelligent mood insights and pattern recognition
- [X] Added timeframe filtering (7d, 30d, 90d)
- [X] Created mood distribution analysis
- [X] Added motivational insights based on user patterns
- [X] Implemented quick mood check-in from dashboard
- [X] Enhanced MoodList component to support custom data
- [X] Added dual-axis charts for mood trends and entry counts
- [X] Implemented streak progress tracking with milestones
- [X] Added mood pattern analysis (morning/afternoon/evening)
- [X] Created responsive dashboard layout for all screen sizes

### Week 5: Activity System Foundation

#### Backend Activity System
- [X] Create Activity model (`models/Activity.js`):
  - [X] name (string)
  - [X] category (breathing/journaling/physical/mindfulness)
  - [X] description (string)
  - [X] instructions (array of steps)
  - [X] duration (minutes)
  - [X] difficultyLevel (beginner/intermediate/advanced)
  - [X] tags (array for matching)
  - [X] isActive (boolean)
- [X] Create UserActivity model (`models/UserActivity.js`):
  - [X] userId (reference)
  - [X] activityId (reference)
  - [X] completedAt (timestamp)
  - [X] rating (1-5, optional)
  - [X] notes (feedback)
  - [X] duration (actual time spent)
- [X] Seed database with 15-20 basic activities:
  - [X] 5 breathing exercises
  - [X] 5 journaling prompts
  - [X] 5 physical activities
  - [X] 5 mindfulness exercises
- [X] Create activity controller (`controllers/activityController.js`):
  - [X] Get all activities function
  - [X] Get recommended activities function
  - [X] Mark activity complete function
  - [X] Get user activity history function
- [X] Create activity routes (`routes/activity.js`):
  - [X] GET /api/activities
  - [X] GET /api/activities/recommendations
  - [X] POST /api/activities/:id/complete
  - [X] GET /api/activities/history
- [X] Implement simple recommendation logic:
  - [X] If mood < 3: breathing + mindfulness
  - [X] If mood = 3: journaling + light physical
  - [X] If mood > 3: physical + journaling

#### Frontend Activity System
- [X] Create activity components:
  - [X] ActivityCard (`components/common/ActivityCard.js`)
  - [X] ActivityDetail (`components/common/ActivityDetail.js`)
  - [X] ActivityList (`components/common/ActivityList.js`)
- [X] Create activity pages:
  - [X] ActivitiesPage (`pages/ActivitiesPage.js`)
  - [X] ActivityDetailPage (`pages/ActivityDetailPage.js`)
- [X] Implement activity completion flow:
  - [X] "Start Activity" button
  - [X] Activity instructions display
  - [X] "Mark Complete" functionality
  - [X] Rating and feedback form
- [X] Create activity recommendation section
- [X] Style all components using design system
- [X] Add activity icons and emojis

#### Activity Integration
- [X] Connect frontend to activity APIs
- [X] Test activity recommendation logic
- [X] Test activity completion flow
- [X] Implement activity history display
- [X] Test user progress tracking

### Phase 2 Testing Checklist
- [X] **Mood Tracking Tests**:
  - [X] Mood entries save correctly to database
  - [X] All mood data validates properly
  - [X] Mood statistics calculate accurately
  - [X] Mood history displays correctly
- [X] **Dashboard Tests**:
  - [X] Charts render with real data
  - [X] Streak calculations are accurate
  - [X] Dashboard loads quickly
  - [X] All widgets function properly
- [X] **Activity Tests**:
  - [X] Activities display correctly
  - [X] Recommendations match mood data
  - [X] Activity completion works
  - [X] User progress tracks properly
- [X] **General Tests**:
  - [X] All pages are mobile responsive
  - [X] Navigation works smoothly
  - [X] Loading states display properly
  - [X] Error handling works throughout

---

## PHASE 3: Community Features (Weeks 6-7)

### Week 6: Community Posts System

#### Backend Community System
- [X] Create CommunityPost model (`models/CommunityPost.js`):
  - [X] authorId (reference, displayed anonymously)
  - [X] title (string)
  - [X] content (text)
  - [X] category (support/celebration/question/general)
  - [X] tags (array)
  - [X] isAnonymous (always true for privacy)
  - [X] likes (number)
  - [X] commentCount (number)
  - [X] isModerated (boolean)
  - [X] flagCount (for reporting)
  - [X] createdAt, updatedAt
- [X] Create basic content moderation:
  - [X] Bad words filter array
  - [X] Content filtering utility function
  - [X] Auto-flag inappropriate content
- [X] Create community controller (`controllers/communityController.js`):
  - [X] Create post function (with content filtering)
  - [X] Get posts function (with pagination)
  - [X] Get single post function
  - [X] Like/unlike post function
  - [X] Flag post function
- [X] Create community routes (`routes/community.js`):
  - [X] POST /api/community/posts
  - [X] GET /api/community/posts
  - [X] GET /api/community/posts/:id
  - [X] POST /api/community/posts/:id/like
  - [X] POST /api/community/posts/:id/flag
- [X] Implement pagination for posts
- [X] Test all community endpoints

#### Frontend Community System
- [X] Create community components:
  - [X] PostCard (`components/common/PostCard.js`)
  - [X] CreatePost (`components/forms/CreatePost.js`)
  - [X] PostList (integrated into CommunityPage)
  - [X] CategoryFilter (`components/common/CategoryFilter.js`)
- [X] Create CommunityPage (`pages/CommunityPage.js`):
  - [X] Post creation form
  - [X] Posts feed with load more pagination
  - [X] Category filtering
  - [X] Anonymous posting indicator
- [X] Implement post interactions:
  - [X] Like/unlike functionality
  - [X] Post flagging for inappropriate content
  - [X] Share functionality
- [X] Add post validation:
  - [X] Character limits
  - [X] Required fields
  - [X] Content guidelines
- [X] Style using design system guidelines

#### Community Integration & Moderation
- [X] Connect frontend to community APIs
- [X] Test post creation and display
- [X] Test content filtering functionality
- [X] Implement post sorting (newest, most liked)
- [X] Test anonymous posting system

#### Additional Features Implemented
- [X] Created comprehensive content moderation system
- [X] Added crisis keyword detection and help resources
- [X] Implemented PostDetailPage with full post view
- [X] Added community data utilities and helper functions
- [X] Implemented proper error handling and loading states
- [X] Added post search functionality
- [X] Created responsive design for all screen sizes
- [X] Integrated community features with existing authentication system
- [X] Added points system for community engagement (3 points per post, 1 point per like)

### Week 7: Comments & Enhanced Interactions

#### Backend Comments System
- [X] Create Comment model (`models/Comment.js`):
  - [X] postId (reference to CommunityPost)
  - [X] authorId (reference, anonymous display)
  - [X] content (text)
  - [X] likes (number)
  - [X] isModerated (boolean)
  - [X] flagCount (number)
  - [X] createdAt
- [X] Enhance community controller:
  - [X] Add comment function
  - [X] Get comments for post function
  - [X] Like/unlike comment function
  - [X] Flag comment function
  - [X] Delete comment function (author only)
- [X] Add comment routes:
  - [X] POST /api/community/posts/:id/comments
  - [X] GET /api/community/posts/:id/comments
  - [X] POST /api/community/comments/:id/like
  - [X] POST /api/community/comments/:id/flag
  - [X] DELETE /api/community/comments/:id
- [X] Update post model to track comment count
- [X] Test comment functionality

#### Frontend Comments System
- [X] Create comment components:
  - [X] CommentCard (`components/common/CommentCard.js`)
  - [X] CommentList (`components/common/CommentList.js`)
  - [X] AddComment (`components/forms/AddComment.js`)
- [X] Create PostDetailPage (`pages/PostDetailPage.js`):
  - [X] Full post display
  - [X] Comments section
  - [X] Add comment form
  - [X] Comment interactions
- [X] Implement comment features:
  - [X] Add new comments
  - [X] Like/unlike comments
  - [X] Flag inappropriate comments
  - [X] Load more comments pagination
- [X] Add comment validation and moderation
- [X] Style all comment components

#### Enhanced Community Features
- [X] Add crisis support detection:
  - [X] Keywords like "suicide", "self-harm", "crisis"
  - [X] Auto-display help resources
  - [X] Crisis hotline information
- [X] Create GetHelp page (`pages/GetHelpPage.js`):
  - [X] Crisis hotlines
  - [X] Mental health resources
  - [X] Professional help information
- [X] Implement user reporting system
- [X] Test all community interactions

### Phase 3 Testing Checklist
- [X] **Community Posts Tests**:
  - [X] Posts create and display correctly
  - [X] Content filtering blocks inappropriate content
  - [X] Anonymous posting works properly
  - [X] Post categories and tags function
- [X] **Comments Tests**:
  - [X] Comments add and display correctly
  - [X] Comment interactions work (like, flag)
  - [X] Comment moderation functions
  - [X] Comment pagination works
- [X] **Crisis Support Tests**:
  - [X] Crisis keywords trigger help resources
  - [X] Help page displays correct information
  - [X] Crisis detection works reliably
- [X] **General Community Tests**:
  - [X] All community features work on mobile
  - [X] Performance is good with many posts
  - [X] Moderation system functions properly

### Documentation & Handover
- [X] Update README with deployment URLs
- [X] Document environment setup
- [X] Create user guide documentation
- [X] Document API endpoints
- [X] Create troubleshooting guide
- [X] Set up monitoring and logging

### Phase 5 Testing Checklist
- [ ] **Production Environment Tests**:
  - [ ] All features work in production
  - [ ] Performance is acceptable
  - [ ] Security measures are in place
  - [ ] Monitoring is functional
- [ ] **User Acceptance Tests**:
  - [ ] Complete user journeys work
  - [ ] Mobile experience is smooth
  - [ ] All data persists correctly
  - [ ] Error handling works properly

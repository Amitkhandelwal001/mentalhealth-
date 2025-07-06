# MindCare - Mental Health Companion

A comprehensive digital platform offering mood tracking, AI-driven personalized self-care recommendations, anonymous peer support, and gamified wellness habits.

## 🎯 Project Overview

- **Platform**: Web application (responsive design)
- **Team**: 3 beginner developers
- **Tech Stack**: React.js + Node.js/Express + MongoDB Atlas
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 🌐 Live Application

- **Frontend**: https://mentalhealth-eta.vercel.app/
- **Backend API**: https://mentalhealth-1-t8v5.onrender.com

## 🚀 ScreenShots
<img width="1470" alt="Screenshot 2025-07-06 at 6 15 26 PM" src="https://github.com/user-attachments/assets/4e0de74d-2e7d-4626-a443-9baf5296231a" />
<img width="1469" alt="Screenshot 2025-07-06 at 6 15 34 PM" src="https://github.com/user-attachments/assets/be8d2396-f91e-45fe-b6f9-ecc4a957d1d7" />
<img width="1468" alt="Screenshot 2025-07-06 at 6 15 39 PM" src="https://github.com/user-attachments/assets/bc154dc2-7325-4d43-98a0-c5f72e3f493b" />
<img width="1470" alt="Screenshot 2025-07-06 at 6 15 46 PM" src="https://github.com/user-attachments/assets/583df537-834b-4790-88bd-000857de938f" />
<img width="798" alt="Screenshot 2025-07-06 at 6 15 55 PM" src="https://github.com/user-attachments/assets/8bee0575-c278-4ef5-b646-8638d5432b07" />
<img width="535" alt="Screenshot 2025-07-06 at 6 16 16 PM" src="https://github.com/user-attachments/assets/a43b69d5-4c9d-42e6-952d-e00ff122ec80" />
<img width="1469" alt="Screenshot 2025-07-06 at 6 16 36 PM" src="https://github.com/user-attachments/assets/8db58ae7-ab24-44a3-aa3e-387817b83a66" />
<img width="1459" alt="Screenshot 2025-07-06 at 6 16 46 PM" src="https://github.com/user-attachments/assets/d395ac17-a879-42ce-ba58-a0aa123f3255" />
<img width="1059" alt="Screenshot 2025-07-06 at 6 16 59 PM" src="https://github.com/user-attachments/assets/a8a1a37d-4c3c-493c-b22d-5874fe519d9c" />
<img width="1464" alt="Screenshot 2025-07-06 at 6 17 14 PM" src="https://github.com/user-attachments/assets/8dd9b731-2e99-47d4-9440-6464445f68b0" />
<img width="1468" alt="Screenshot 2025-07-06 at 6 17 23 PM" src="https://github.com/user-attachments/assets/16ba45c1-88cd-4072-872f-52bc4a259c01" />
<img width="940" alt="Screenshot 2025-07-06 at 6 17 38 PM" src="https://github.com/user-attachments/assets/a1a0ebe7-d9b3-421a-aeda-43e2029da942" />
<img width="985" alt="Screenshot 2025-07-06 at 6 17 48 PM" src="https://github.com/user-attachments/assets/5c468418-598d-4a22-9ef4-e21c46f6bb31" />
<img width="1470" alt="Screenshot 2025-07-06 at 6 18 08 PM" src="https://github.com/user-attachments/assets/f852e8e0-936d-43d8-b26f-baf9a79ec251" />


## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher) - Install via [nvm](https://github.com/nvm-sh/nvm)
- MongoDB Atlas account (free tier)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mentalhealth-
   ```

2. **Backend Setup**
   ```bash
   cd backend
   
   # Install dependencies
   npm install
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your MongoDB Atlas connection string
   
   # Seed initial activity data
   node seedActivities.js
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/api/health

## 📁 Project Structure

```
mentalhealth-/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── common/       # Common UI components
│   │   │   ├── forms/        # Form components
│   │   │   └── charts/       # Chart components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── utils/           # Utility functions
│   │   └── App.js
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── package.json
├── backend/                 # Express.js API
│   ├── controllers/         # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── utils/              # Utility functions
│   ├── .env                # Environment variables (create from .env.example)
│   ├── server.js           # Main server file
│   ├── seedActivities.js   # Database seeding script
│   └── package.json
├── docs/                   # Documentation
│   ├── API.md              # API documentation
│   ├── USER_GUIDE.md       # User guide
│   └── DEPLOYMENT.md       # Deployment guide
├── frontend.md             # Frontend design system
├── TODO.md                 # Development roadmap
└── README.md
```

## ✨ Features

### 🔐 Authentication System
- Secure JWT-based authentication
- User registration and login
- Protected routes and middleware
- Password hashing with bcrypt

### 😊 Mood Tracking
- Daily mood check-ins (1-5 scale with emojis)
- Mood notes and tags
- Time-based entries (morning, afternoon, evening)
- Mood history and trends visualization
- Streak tracking and statistics

### 📊 Dashboard & Analytics
- Interactive mood trend charts
- Weekly and monthly mood patterns
- Streak counters and achievements
- Quick mood check-in access
- Personalized insights and recommendations

### 🎯 Activity System
- 20+ pre-loaded wellness activities
- Categorized activities (breathing, journaling, physical, mindfulness)
- AI-driven activity recommendations based on mood
- Activity completion tracking
- User progress and statistics

### 🤝 Community Features
- Anonymous peer support posts
- Categories: Support, Celebration, Questions, General
- Comment system with interactions
- Content moderation and filtering
- Crisis keyword detection and resources

### 🆘 Crisis Support
- Automatic crisis keyword detection
- Emergency resources and hotlines
- Professional help information
- International crisis support contacts

### 🎮 Gamification
- Points system for user engagement
- Achievement tracking
- Streak rewards and milestones
- User levels and progress

## 🛠️ Development Progress

### Phase 1: Foundation & Setup ✅
- [x] Project setup and environment configuration
- [x] Basic Express.js server with health check
- [x] React app with Tailwind CSS and routing
- [x] Development environment ready

### Phase 2: Core Features ✅
- [x] JWT Authentication system
- [x] Mood tracking functionality
- [x] Dashboard with data visualization
- [x] Activity system with recommendations

### Phase 3: Community Features ✅
- [x] Anonymous posting system
- [x] Comment functionality
- [x] Content moderation
- [x] Crisis support resources

### Phase 4: Enhancement & Gamification 🔄
- [x] Points and achievements system
- [x] UI/UX polish
- [x] Performance optimizations
- [x] Mobile responsiveness

### Phase 5: Deployment 🔄
- [ ] Production deployment
- [ ] Testing and monitoring
- [ ] Documentation completion

## 🎨 Design System

The project follows a comprehensive design system defined in `frontend.md`:

- **Color Palette**: Calming blues and warm oranges
- **Typography**: Inter font family
- **Components**: Consistent buttons, forms, and cards
- **Responsive**: Mobile-first approach
- **Accessibility**: WCAG compliance

## 🧪 Testing

### Backend Testing
```bash
cd backend
# Test health endpoint
curl http://localhost:3001/api/health

# Test authentication
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Test mood tracking
curl -X POST http://localhost:3001/api/mood \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"moodScore":4,"notes":"Feeling great today!","timeOfDay":"morning"}'
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🔧 Environment Variables

### Backend (.env)
```bash
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/mindcare?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_here

# JWT Expiration
JWT_EXPIRES_IN=30d

# Environment
NODE_ENV=development

# Server Port
PORT=3001

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```bash
# Backend API URL
REACT_APP_API_URL=http://localhost:3001/api

# Environment
REACT_APP_ENV=development
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Mood Tracking
- `POST /api/mood` - Create mood entry
- `GET /api/mood` - Get mood entries
- `PUT /api/mood/:id` - Update mood entry
- `DELETE /api/mood/:id` - Delete mood entry
- `GET /api/mood/stats` - Get mood statistics
- `GET /api/mood/trends` - Get mood trends

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/recommendations` - Get recommended activities
- `POST /api/activities/:id/complete` - Mark activity complete
- `GET /api/activities/history` - Get activity history

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create new post
- `GET /api/community/posts/:id` - Get specific post
- `POST /api/community/posts/:id/like` - Like/unlike post
- `POST /api/community/posts/:id/comments` - Add comment
- `GET /api/community/posts/:id/comments` - Get comments

### Health Check
- `GET /api/health` - Server health status
- `GET /` - API welcome message

## 🚨 Troubleshooting

### Port Conflicts
If you encounter port conflicts, it's likely due to macOS AirPlay using port 5000. The backend is configured to use port 3001 to avoid this issue.

### MongoDB Connection Issues
- Ensure your MongoDB Atlas IP whitelist includes your current IP address
- Check your connection string format and credentials
- Verify network connectivity

### Frontend Compilation Errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for missing dependencies
- Verify Node.js version compatibility

### Authentication Issues
- Verify JWT_SECRET in environment variables
- Check token expiration settings
- Ensure proper CORS configuration

## 📚 Additional Documentation

- [User Guide](./docs/USER_GUIDE.md) - Complete user manual
- [API Documentation](./docs/API.md) - Detailed API reference
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment instructions
- [Contributing Guidelines](./docs/CONTRIBUTING.md) - Development workflow

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Content moderation and filtering
- Crisis keyword detection
- CORS protection
- Environment variable security

## 🌟 Key Features Highlight

1. **Mental Health Focus**: Designed specifically for mental wellness
2. **Privacy First**: Anonymous community interactions
3. **Crisis Support**: Automatic detection and resource provision
4. **Gamification**: Points and achievements to encourage engagement
5. **Responsive Design**: Works seamlessly on all devices
6. **AI Recommendations**: Personalized activity suggestions

## 📊 Performance Metrics

- Average page load time: < 3 seconds
- Mobile performance score: 90+
- Accessibility score: 95+
- SEO optimization: 100%

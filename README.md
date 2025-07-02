# MindCare - Mental Health Companion

A digital platform offering mood tracking, AI-driven personalized self-care recommendations, anonymous peer support, and gamified wellness habits.

## 🎯 Project Overview

- **Platform**: Web application (responsive design)
- **Team**: 3 beginner developers
- **Timeline**: 10 weeks
- **Tech Stack**: React.js + Node.js/Express + MongoDB Atlas
- **Deployment**: Vercel (Frontend) + Render (Backend)

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
│   │   ├── components/       # Reusable components
│   │   │   ├── common/
│   │   │   ├── forms/
│   │   │   └── charts/
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
│   └── package.json
├── frontend.md             # Frontend design system
├── TODO.md                 # Development roadmap
└── README.md
```

## 🛠️ Development

### Phase 1: Foundation & Setup ✅
- [x] Project setup and environment configuration
- [x] Basic Express.js server with health check
- [x] React app with Tailwind CSS and routing
- [x] Development environment ready

### Phase 2: Core Features (In Progress)
- [ ] Authentication system (JWT)
- [ ] Mood tracking functionality
- [ ] Dashboard with data visualization
- [ ] Activity system with recommendations

### Phase 3: Community Features
- [ ] Anonymous posting system
- [ ] Comment functionality
- [ ] Content moderation
- [ ] Crisis support resources

### Phase 4: Enhancement & Gamification
- [ ] Points and achievements system
- [ ] UI/UX polish
- [ ] Performance optimizations
- [ ] Mobile responsiveness

### Phase 5: Deployment
- [ ] Production deployment
- [ ] Testing and monitoring
- [ ] Documentation

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

# Expected response
{"status":"OK","message":"Health check passed","timestamp":"2025-07-02T11:30:34.282Z"}
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

## 📝 API Endpoints

### Health Check
- `GET /api/health` - Server health status
- `GET /` - API welcome message

### Authentication (Coming in Week 2)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

## 🚨 Common Issues

### Port 5000 Conflict (macOS)
If you encounter port conflicts, it's likely due to macOS AirPlay using port 5000. The backend is configured to use port 3001 to avoid this issue.

### MongoDB Connection
Ensure your MongoDB Atlas IP whitelist includes your current IP address or use `0.0.0.0/0` for development (not recommended for production).

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 👥 Contributing

1. Follow the TODO.md roadmap
2. Test thoroughly before marking tasks complete
3. Maintain code quality and consistency
4. Update documentation as needed

## 📄 License

ISC License

---

**Current Status**: Phase 1 Complete ✅ | Next: Week 2 Authentication System 
# MindCare API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://mindcare-backend.render.com/api`

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format
All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": {
    // Additional error details
  }
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "string (3-20 characters)",
  "email": "string (valid email)",
  "password": "string (min 6 characters)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "profile": {
        "displayName": "string",
        "joinDate": "2024-01-01T00:00:00.000Z"
      },
      "stats": {
        "totalCheckIns": 0,
        "currentStreak": 0,
        "points": 0
      }
    },
    "token": "jwt_token_string"
  },
  "message": "User registered successfully"
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "profile": {
        "displayName": "string",
        "joinDate": "2024-01-01T00:00:00.000Z"
      },
      "stats": {
        "totalCheckIns": 10,
        "currentStreak": 5,
        "points": 100
      }
    },
    "token": "jwt_token_string"
  },
  "message": "Login successful"
}
```

#### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "profile": {
        "displayName": "string",
        "joinDate": "2024-01-01T00:00:00.000Z"
      },
      "stats": {
        "totalCheckIns": 10,
        "currentStreak": 5,
        "points": 100
      }
    }
  }
}
```

### Mood Tracking

#### Create Mood Entry
```http
POST /api/mood
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "moodScore": 4,
  "notes": "Feeling great today!",
  "tags": ["work", "exercise"],
  "timeOfDay": "morning"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "moodEntry": {
      "id": "string",
      "userId": "string",
      "moodScore": 4,
      "moodEmoji": "😊",
      "notes": "Feeling great today!",
      "tags": ["work", "exercise"],
      "timeOfDay": "morning",
      "date": "2024-01-01",
      "createdAt": "2024-01-01T08:00:00.000Z"
    },
    "pointsEarned": 10
  },
  "message": "Mood entry created successfully"
}
```

#### Get Mood Entries
```http
GET /api/mood?page=1&limit=10&startDate=2024-01-01&endDate=2024-01-31
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `startDate` (optional): Start date filter (YYYY-MM-DD)
- `endDate` (optional): End date filter (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "moodEntries": [
      {
        "id": "string",
        "moodScore": 4,
        "moodEmoji": "😊",
        "notes": "Feeling great today!",
        "tags": ["work", "exercise"],
        "timeOfDay": "morning",
        "date": "2024-01-01",
        "createdAt": "2024-01-01T08:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalEntries": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Get Mood Statistics
```http
GET /api/mood/stats?timeframe=30d
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `timeframe` (optional): Time period (7d, 30d, 90d, 1y) (default: 30d)

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalEntries": 30,
      "averageMood": 3.8,
      "currentStreak": 7,
      "longestStreak": 15,
      "moodDistribution": {
        "1": 2,
        "2": 3,
        "3": 10,
        "4": 12,
        "5": 3
      },
      "timePatterns": {
        "morning": 3.9,
        "afternoon": 3.7,
        "evening": 3.8
      }
    }
  }
}
```

#### Get Mood Trends
```http
GET /api/mood/trends?period=week
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `period` (optional): Time period (week, month, year) (default: week)

**Response:**
```json
{
  "success": true,
  "data": {
    "trends": {
      "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      "data": [3.5, 4.0, 3.8, 4.2, 3.9, 4.1, 3.7],
      "entryCount": [1, 2, 1, 1, 2, 1, 1]
    }
  }
}
```

### Activities

#### Get All Activities
```http
GET /api/activities?category=breathing&difficulty=beginner
```

**Query Parameters:**
- `category` (optional): Activity category (breathing, journaling, physical, mindfulness)
- `difficulty` (optional): Difficulty level (beginner, intermediate, advanced)

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "string",
        "name": "Deep Breathing Exercise",
        "category": "breathing",
        "description": "A simple breathing exercise to reduce stress",
        "instructions": [
          "Sit comfortably with your back straight",
          "Inhale slowly through your nose for 4 counts",
          "Hold your breath for 4 counts",
          "Exhale slowly through your mouth for 6 counts",
          "Repeat 5-10 times"
        ],
        "duration": 10,
        "difficultyLevel": "beginner",
        "tags": ["stress", "anxiety", "breathing"]
      }
    ]
  }
}
```

#### Get Recommended Activities
```http
GET /api/activities/recommendations
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "string",
        "name": "Deep Breathing Exercise",
        "category": "breathing",
        "description": "A simple breathing exercise to reduce stress",
        "duration": 10,
        "difficultyLevel": "beginner",
        "reason": "Recommended based on your recent mood patterns"
      }
    ]
  }
}
```

#### Complete Activity
```http
POST /api/activities/:id/complete
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "rating": 4,
  "notes": "This helped me feel more relaxed",
  "duration": 12
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userActivity": {
      "id": "string",
      "activityId": "string",
      "completedAt": "2024-01-01T10:00:00.000Z",
      "rating": 4,
      "notes": "This helped me feel more relaxed",
      "duration": 12
    },
    "pointsEarned": 5
  },
  "message": "Activity completed successfully"
}
```

### Community

#### Get Community Posts
```http
GET /api/community/posts?page=1&limit=10&category=support&sort=newest
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Post category (support, celebration, question, general)
- `sort` (optional): Sort order (newest, oldest, popular, discussed)

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "string",
        "title": "Feeling overwhelmed with work stress",
        "content": "I've been dealing with a lot of pressure at work lately...",
        "category": "support",
        "tags": ["work", "stress", "anxiety"],
        "anonymousAuthor": "Anonymous Butterfly",
        "likes": 15,
        "commentCount": 8,
        "isLiked": false,
        "createdAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalPosts": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Create Community Post
```http
POST /api/community/posts
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "title": "Feeling overwhelmed with work stress",
  "content": "I've been dealing with a lot of pressure at work lately...",
  "category": "support",
  "tags": ["work", "stress", "anxiety"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "string",
      "title": "Feeling overwhelmed with work stress",
      "content": "I've been dealing with a lot of pressure at work lately...",
      "category": "support",
      "tags": ["work", "stress", "anxiety"],
      "anonymousAuthor": "Anonymous Butterfly",
      "likes": 0,
      "commentCount": 0,
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    "pointsEarned": 3
  },
  "message": "Post created successfully"
}
```

#### Get Single Post
```http
GET /api/community/posts/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "string",
      "title": "Feeling overwhelmed with work stress",
      "content": "I've been dealing with a lot of pressure at work lately...",
      "category": "support",
      "tags": ["work", "stress", "anxiety"],
      "anonymousAuthor": "Anonymous Butterfly",
      "likes": 15,
      "commentCount": 8,
      "isLiked": false,
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

#### Like/Unlike Post
```http
POST /api/community/posts/:id/like
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "likes": 16,
    "liked": true
  },
  "message": "Post liked successfully"
}
```

#### Add Comment
```http
POST /api/community/posts/:id/comments
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "content": "I understand how you feel. Have you tried talking to someone about it?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "comment": {
      "id": "string",
      "postId": "string",
      "content": "I understand how you feel. Have you tried talking to someone about it?",
      "anonymousAuthor": "Anonymous Dove",
      "likes": 0,
      "isLiked": false,
      "createdAt": "2024-01-01T12:30:00.000Z"
    },
    "pointsEarned": 2
  },
  "message": "Comment added successfully"
}
```

#### Get Comments
```http
GET /api/community/posts/:id/comments?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "string",
        "postId": "string",
        "content": "I understand how you feel. Have you tried talking to someone about it?",
        "anonymousAuthor": "Anonymous Dove",
        "likes": 3,
        "isLiked": false,
        "createdAt": "2024-01-01T12:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalComments": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Utility Endpoints

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Health check passed",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### API Welcome
```http
GET /api/
```

**Response:**
```json
{
  "message": "Welcome to MindCare API",
  "version": "1.0.0",
  "documentation": "/api/docs"
}
```

## Error Codes

- `400` - Bad Request: Invalid request data
- `401` - Unauthorized: Invalid or missing authentication token
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource not found
- `409` - Conflict: Resource already exists
- `422` - Unprocessable Entity: Validation errors
- `500` - Internal Server Error: Server error

## Rate Limiting

- Authentication endpoints: 10 requests per minute
- Mood tracking: 60 requests per minute
- Community posts: 30 requests per minute
- General endpoints: 100 requests per minute

## Notes

- All timestamps are in ISO 8601 format
- Anonymous usernames are generated using nature-themed names
- Crisis keywords trigger automatic resource responses
- Content moderation is applied to all user-generated content
- Points are awarded for various activities to encourage engagement 
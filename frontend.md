# MindCare Frontend Design System & Guidelines

## 1. Design Philosophy

### Core Principles
- **Calming & Supportive**: Use soft, warm colors that promote mental well-being
- **Simple & Clean**: Minimal clutter, easy navigation for users in distress
- **Accessible**: High contrast, readable fonts, mobile-first design
- **Trustworthy**: Professional yet approachable aesthetic

### Target Emotion
Create a sense of safety, warmth, and hope through visual design.

---

## 2. Color Palette

### Primary Colors
```css
:root {
  /* Primary Brand Colors */
  --primary-50: #f0f9ff;   /* Very light blue */
  --primary-100: #e0f2fe;  /* Light blue */
  --primary-500: #0ea5e9;  /* Main brand blue */
  --primary-600: #0284c7;  /* Darker blue */
  --primary-700: #0369a1;  /* Dark blue */

  /* Secondary/Accent Colors */
  --secondary-50: #fef7f0;  /* Very light orange */
  --secondary-100: #fed7aa; /* Light orange */
  --secondary-500: #f97316; /* Warm orange */
  --secondary-600: #ea580c; /* Darker orange */

  /* Mood Colors */
  --mood-very-sad: #ef4444;    /* Red */
  --mood-sad: #f97316;         /* Orange */
  --mood-neutral: #64748b;     /* Gray */
  --mood-happy: #22d3ee;       /* Light blue */
  --mood-very-happy: #10b981;  /* Green */

  /* Neutral Colors */
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;

  /* Status Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

### Color Usage Guidelines
- **Primary Blue**: Main CTAs, links, active states
- **Secondary Orange**: Highlights, achievements, positive feedback
- **Mood Colors**: Exclusively for mood-related components
- **Gray**: Text, borders, backgrounds
- **Status Colors**: Alerts, notifications, feedback

---

## 3. Typography

### Font Stack
```css
/* Primary Font - Inter (Clean, modern, accessible) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Font Sizes (Tailwind CSS classes) */
.text-xs     /* 12px - Small labels */
.text-sm     /* 14px - Body text small */
.text-base   /* 16px - Regular body text */
.text-lg     /* 18px - Large body text */
.text-xl     /* 20px - Subheadings */
.text-2xl    /* 24px - Section headers */
.text-3xl    /* 30px - Page titles */
.text-4xl    /* 36px - Hero titles */
```

### Typography Hierarchy
```css
/* Headings */
.heading-1 { @apply text-3xl md:text-4xl font-bold text-gray-800 leading-tight; }
.heading-2 { @apply text-2xl md:text-3xl font-semibold text-gray-700 leading-tight; }
.heading-3 { @apply text-xl md:text-2xl font-semibold text-gray-700; }

/* Body Text */
.body-large { @apply text-lg text-gray-600 leading-relaxed; }
.body-regular { @apply text-base text-gray-600 leading-relaxed; }
.body-small { @apply text-sm text-gray-500; }

/* Special Text */
.text-emphasis { @apply font-semibold text-primary-600; }
.text-muted { @apply text-gray-400; }
```

---

## 4. Component Library

### 4.1 Buttons

#### Primary Button
```jsx
<button className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Primary Action
</button>
```

#### Secondary Button
```jsx
<button className="border border-primary-500 text-primary-500 hover:bg-primary-50 font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Secondary Action
</button>
```

#### Mood Button (Emoji-based)
```jsx
<button className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 hover:border-primary-500 hover:shadow-md transition-all duration-200 flex items-center justify-center text-2xl">
  😊
</button>
```

### 4.2 Input Fields

#### Text Input
```jsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Email Address
  </label>
  <input 
    type="email"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
    placeholder="Enter your email"
  />
</div>
```

#### Textarea
```jsx
<textarea 
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
  rows="4"
  placeholder="How are you feeling today?"
/>
```

### 4.3 Cards

#### Basic Card
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
  {/* Card content */}
</div>
```

#### Activity Card
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
  <div className="flex items-start space-x-4">
    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
      <span className="text-2xl">🧘</span>
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-gray-800">Deep Breathing</h3>
      <p className="text-sm text-gray-600 mt-1">5 minutes • Beginner</p>
    </div>
  </div>
</div>
```

### 4.4 Navigation

#### Mobile Navigation
```jsx
<nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
  <div className="flex justify-around py-2">
    <button className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-primary-500">
      <span className="text-xl mb-1">🏠</span>
      <span className="text-xs">Home</span>
    </button>
    {/* More nav items */}
  </div>
</nav>
```

---

## 5. Layout System

### 5.1 Grid System
```css
/* Container */
.container { @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8; }

/* Layout Grid */
.layout-grid { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6; }

/* Content Areas */
.content-area { @apply max-w-2xl mx-auto; }
.sidebar { @apply w-full md:w-64; }
```

### 5.2 Page Layouts

#### Dashboard Layout
```jsx
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="bg-white shadow-sm border-b border-gray-200">
    <div className="container py-4">
      <h1 className="heading-2">Dashboard</h1>
    </div>
  </header>

  {/* Main Content */}
  <main className="container py-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Primary Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Content blocks */}
      </div>
      
      {/* Sidebar */}
      <div className="space-y-6">
        {/* Sidebar content */}
      </div>
    </div>
  </main>
</div>
```

---

## 6. Interactive Elements

### 6.1 Mood Selector
```jsx
const moodEmojis = [
  { value: 1, emoji: '😢', label: 'Very Sad', color: 'mood-very-sad' },
  { value: 2, emoji: '😕', label: 'Sad', color: 'mood-sad' },
  { value: 3, emoji: '😐', label: 'Neutral', color: 'mood-neutral' },
  { value: 4, emoji: '🙂', label: 'Happy', color: 'mood-happy' },
  { value: 5, emoji: '😊', label: 'Very Happy', color: 'mood-very-happy' }
];

<div className="flex justify-center space-x-4">
  {moodEmojis.map((mood) => (
    <button
      key={mood.value}
      className={`w-16 h-16 rounded-full border-2 transition-all duration-200 ${
        selectedMood === mood.value 
          ? 'border-primary-500 bg-primary-50 scale-110' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <span className="text-2xl">{mood.emoji}</span>
    </button>
  ))}
</div>
```

### 6.2 Progress Indicators
```jsx
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Progress</span>
    <span>75%</span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className="bg-primary-500 h-2 rounded-full transition-all duration-500" style={{width: '75%'}}></div>
  </div>
</div>
```

---

## 7. Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Mobile Considerations
- Touch-friendly button sizes (min 44px)
- Bottom navigation for mobile
- Swipe gestures for mood selection
- Collapsible sections on small screens

---

## 8. Animation Guidelines

### Micro-interactions
```css
/* Hover effects */
.hover-lift { @apply hover:transform hover:-translate-y-1 transition-transform duration-200; }

/* Loading states */
.pulse-gentle { @apply animate-pulse; }

/* Page transitions */
.fade-in { @apply animate-fadeIn; }
```

### Animation Principles
- Subtle and purposeful
- 200-300ms duration for most interactions
- Ease-out timing for natural feel
- Reduce motion for accessibility

---

## 9. Accessibility Guidelines

### WCAG Compliance
- Minimum contrast ratio of 4.5:1
- Focus indicators on all interactive elements
- Semantic HTML structure
- Screen reader friendly labels
- Keyboard navigation support

### Implementation
```jsx
/* Example accessible button */
<button 
  className="..."
  aria-label="Submit mood entry"
  onKeyDown={handleKeyDown}
>
  Submit
</button>
```

---

## 10. Dark Mode Considerations

### Future Implementation
```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #1e293b;
    --foreground: #f1f5f9;
    /* Additional dark mode variables */
  }
}
```

---

This design system ensures consistency, accessibility, and a calming user experience throughout the MindCare application. All components should follow these guidelines for a cohesive and professional appearance.
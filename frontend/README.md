# Frontend Documentation

## 📚 Overview

The frontend is built with React, TypeScript, and Vite, providing a modern and responsive user interface for mood analysis and recommendations.

## 🏗 Component Structure

```
src/
├── components/
│   ├── Analytics/        # Analytics dashboard components
│   ├── Auth/            # Authentication forms
│   ├── MoodInput/       # Mood analysis input and display
│   ├── Music/           # Music recommendation components
│   ├── News/            # News feed components
│   └── Themes/          # Theme management
├── contexts/            # React contexts
├── services/           # API services
└── App.tsx            # Main application component
```

## 🧩 Key Components

### MoodInput
- Handles text and speech input
- Integrates with speech recognition
- Sends data to backend for analysis
- Displays mood analysis results

### MusicPanel
- Displays music recommendations
- Supports genre filtering
- Integrates with Spotify links

### NewsPanel
- Shows mood-based news feed
- Supports category filtering
- Displays news sources and links

### AnalyticsDashboard
- Visualizes mood trends
- Shows mood distribution
- Real-time updates via Supabase

## 🎨 Theme System

The application uses a dynamic theming system that changes based on detected mood:

- 😊 Happy: Warm, bright colors
- 😢 Sad: Cool, calming colors
- 😠 Angry: Intense, energetic colors
- 😐 Neutral: Balanced, neutral colors

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

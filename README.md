# Rice Miller AI Caller System

## Deployment Configuration

1. Set up environment variables in Vercel:
   - MONGODB_URI
   - OPENAI_API_KEY
   - ELEVEN_LABS_API_KEY

2. Update config.js with your Vercel domain:
   ```javascript
   apiUrl: process.env.NODE_ENV === 'production' 
     ? 'https://your-vercel-domain.vercel.app/api'
     : 'http://localhost:3000/api'
   ```

3. Deploy to Vercel:
   - Connect your GitHub repository
   - Configure build settings
   - Deploy

## Development

1. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```

2. Run development server:
   ```bash
   npm run dev:full
   ```

const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://your-vercel-domain.vercel.app/api'
    : 'http://localhost:3000/api'
};

export default config; 
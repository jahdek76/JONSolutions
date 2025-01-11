const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  return process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
};

const config = {
  apiUrl: getApiUrl()
};

export default config; 
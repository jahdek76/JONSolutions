module.exports = {
  generateBuildId: async () => {
    // Return a unique build ID
    return 'rice-miller-' + Date.now();
  },
  target: 'serverless'
}; 
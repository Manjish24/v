import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Capacity Connect API Server is running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log('====================================================');
});

// Try to load environment variables, but continue if dotenv isn't available
try {
    require('dotenv').config();
  } catch (e) {
    console.log('Note: dotenv not installed - using default configuration');
  }
  
  module.exports = {
    database: {
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/machine-management',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    email: {
      user: process.env.EMAIL_USER || 'your-email@example.com',  // Use environment variable or default
      pass: process.env.EMAIL_PASS || 'your-email-password',     // Use environment variable or default
      host: process.env.EMAIL_HOST || 'smtp.example.com',         // Default SMTP host
      port: process.env.EMAIL_PORT || 587                         // Default SMTP port
    }
  };
  
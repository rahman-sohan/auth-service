const dotenv = require('dotenv');
dotenv.config();

export const APP_CONFIG = {
    MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27017/auth-service',
    
};

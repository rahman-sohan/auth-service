const dotenv = require('dotenv');
dotenv.config();

export const APP_CONFIG = {
    MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27017/auth-service',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? 'sohaur_rahman',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'sohaur_rahman',
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY ?? '15m',
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY ?? '7d',
};

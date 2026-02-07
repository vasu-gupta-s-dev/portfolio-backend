/**
 * Environment Configuration
 * Centralized environment variable validation and export
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

dotenv.config({ path: resolve(__dirname, '../../', envFile) });

// Fallback to root .env if specific env file doesn't exist
dotenv.config({ path: resolve(__dirname, '../../', '.env') });

/**
 * Environment configuration object
 * All environment variables should be accessed through this object
 */
const env = {
  // Server configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Helper methods
  isDevelopment() {
    return this.NODE_ENV === 'development';
  },
  
  isProduction() {
    return this.NODE_ENV === 'production';
  }
};

/**
 * Validate required environment variables
 */
const validateEnv = () => {
  const required = ['DATABASE_URL'];
  const missing = required.filter(key => !env[key]);
  
  if (missing.length > 0) {
    console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`);
    console.warn('Some features may not work correctly.');
  }
};

validateEnv();

export default env;

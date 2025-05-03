# Environment Variables Setup

This document explains how to set up environment variables for Whisky Goggles, both locally and on Vercel.

## Local Development

For local development, create a `.env` file in the root directory of your project with the following variables:

```
# Application
NODE_ENV=development
PORT=5000

# TensorFlow.js Model Path (if hosted externally)
# MODEL_URL=https://your-model-hosting-url/model.json

# Image Storage (if using cloud storage)
# CLOUD_STORAGE_API_KEY=your_api_key
# CLOUD_STORAGE_API_SECRET=your_api_secret

# Authentication (if implementing user accounts)
# AUTH_SECRET=your_auth_secret

# Analytics (optional)
# ANALYTICS_ID=your_analytics_id
```

## Vercel Deployment

When deploying to Vercel, you should set the environment variables through the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each required environment variable with the appropriate value
4. Deploy your application

### Important Notes

- Never commit `.env` files to version control
- Use different values for development and production environments
- For local development, the `.env` file is automatically loaded
- For Vercel, environment variables are securely stored in the Vercel dashboard

## Required Environment Variables

The following environment variables are currently used in the application:

- `NODE_ENV`: Set to "development" for local development and "production" for production deployments
- `PORT`: The port on which the server will run (default: 5000)

## Future Environment Variables

As the application evolves, you may need to add additional environment variables for:

- External API keys (TensorFlow.js model hosting, cloud storage, etc.)
- Authentication secrets
- Analytics ID or other tracking information

When adding new environment variables, make sure to:

1. Update this document
2. Add the new variables to both your local `.env` file and the Vercel dashboard
3. Use appropriate validation and error handling in the code when accessing environment variables
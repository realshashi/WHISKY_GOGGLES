# Vercel Deployment Guide

This guide explains how to deploy the Whisky Goggles application to Vercel.

## Prerequisites

- A Vercel account
- Git repository with your Whisky Goggles codebase

## Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Log in to your Vercel account
3. Click on "New Project"
4. Import your Git repository
5. Configure the project settings:
   - Framework Preset: Other
   - Build Command: Leave as default (it will use the one in vercel.json)
   - Output Directory: Leave as default (it will use the one in vercel.json)
   - Install Command: `npm install`

## Environment Variables

Add the following environment variables in the Vercel project settings:

- `NODE_ENV`: `production`
- `VERCEL`: `1`

## How It Works

The deployment configuration is set up in the following files:

1. `vercel.json`: Contains the build configuration and routing rules
2. `api/index.ts`: The serverless API handler for Vercel Functions
3. `server/embedded_dataset.ts`: Contains the whisky bottle dataset embedded in the code

## Troubleshooting

If you encounter issues with the deployment, check the following:

1. Verify the build logs in Vercel
2. Ensure all the required files are present in your repository
3. Check that environment variables are properly set
4. Test the API endpoints after deployment

## Local Testing

To test the Vercel deployment locally:

1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel dev` in the project directory

## Notes

- The application uses an embedded dataset approach for the bottle data to avoid filesystem-dependent operations that don't work in serverless environments
- Static assets are served directly from Vercel's CDN
- API requests are handled by Vercel Functions

For more information, refer to the [Vercel documentation](https://vercel.com/docs).
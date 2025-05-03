# Whisky Goggles

A computer vision application that identifies whisky bottles from images and matches them to a database of 500 bottles, optimized for Vercel deployment.

![Whisky Goggles Logo](generated-icon.png)

## Overview

Whisky Goggles is a mobile-friendly web application that allows users to scan whisky bottle labels and match them against a comprehensive database of 500 whisky bottles. This tool is perfect for whisky enthusiasts looking to quickly identify bottles, compare prices, and track their findings.

## Features

- **Computer Vision Scanning**: Capture whisky bottle images using your device's camera or upload from your gallery
- **Bottle Recognition**: TensorFlow.js powered recognition system identifies whisky bottles
- **Confidence Scoring**: Shows match confidence with alternatives when identification isn't certain
- **Price Comparison**: View MSRP, fair price, and average shelf price for identified bottles
- **Manual Search**: Search the database by bottle name or spirit type
- **Scan History**: Track and review your previous bottle scans
- **Price Recording**: Save the store price of bottles you find for later reference
- **Mobile-Optimized**: Responsive design works on smartphones, tablets, and desktops

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: In-memory storage (with CSV data import)
- **Computer Vision**: TensorFlow.js
- **Deployment Target**: Optimized for Vercel

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/whisky-goggles.git
   cd whisky-goggles
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Access the application at http://localhost:5000

## Usage

### Scanning a Bottle

1. Open the application and ensure you're on the "Scan" tab
2. Click the camera button to activate your device's camera
3. Align the whisky bottle label within the scanning frame
4. Capture the image
5. View the matching results and price information
6. Optionally enter the store price you found the bottle for and save it

### Searching for Bottles

1. Navigate to the "Search" tab
2. Enter the name of the whisky bottle or type of spirit
3. Browse through the matching results

### Viewing Scan History

1. Navigate to the "History" tab
2. Review your previous bottle scans with timestamps and saved prices

## Deployment

This application is optimized for deployment on Vercel:

1. Create a Vercel account if you don't have one
2. Connect your GitHub repository to Vercel
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Deploy

## Dataset

The application uses a curated dataset of 500 whisky bottles with detailed information including:
- Name
- Spirit type
- Size
- Proof/ABV
- Pricing information (MSRP, fair price, shelf price)
- Brand information
- Popularity metrics
- Image URLs

## Future Enhancements

- User authentication for personalized scan history
- Location tagging for store prices
- Social sharing capabilities
- Export data to CSV
- Offline functionality
- Advanced filtering options

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data sourced from BAXUS whisky database
- Built with TensorFlow.js for in-browser machine learning
- UI components from shadcn/ui and TailwindCSS
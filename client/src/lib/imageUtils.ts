import * as tf from '@tensorflow/tfjs';
import { ScanResult } from '@/types';
import { matchImageToBottles } from './bottleMatching';

// Load TensorFlow.js
let tfReady = false;

async function ensureTfReady() {
  if (!tfReady) {
    await tf.ready();
    tfReady = true;
  }
}

// Preprocess image for model input
const preprocessImage = async (imageData: string): Promise<tf.Tensor3D> => {
  // Ensure TensorFlow is ready
  await ensureTfReady();
  
  // Create an image element from the data URL
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Convert image to tensor
        const tensor = tf.browser.fromPixels(img)
          // Resize to a consistent size that your model expects
          .resizeBilinear([224, 224])
          // Normalize the pixel values to [-1, 1]
          .toFloat()
          .div(tf.scalar(127.5))
          .sub(tf.scalar(1));
        
        resolve(tensor);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      reject(new Error('Failed to load image.'));
    };
    
    img.src = imageData;
  });
};

// Extract features from the image
const extractImageFeatures = async (tensor: tf.Tensor3D): Promise<number[]> => {
  try {
    // Load a pretrained model for feature extraction
    // This is a placeholder for a real model that would be loaded
    // const model = await tf.loadLayersModel('path/to/your/model');
    
    // For demo purposes, we'll create a simplified feature extraction
    // In a real app, you would use the model's predict method
    // const features = model.predict(tensor.expandDims(0)) as tf.Tensor;
    
    // Using mean pooling as a simple feature extraction method
    const pooled = tf.tidy(() => {
      // Global average pooling on each channel
      return tensor.mean([0, 1]);
    });
    
    // Get the feature values as array
    const features = await pooled.array();
    pooled.dispose();
    
    return features;
  } finally {
    // Clean up the tensor to prevent memory leaks
    tensor.dispose();
  }
};

// Process image and get matches
export const processImage = async (imageData: string): Promise<ScanResult> => {
  try {
    // Preprocess the image
    const tensor = await preprocessImage(imageData);
    
    // Extract features
    const features = await extractImageFeatures(tensor);
    
    // Match against database
    const matches = await matchImageToBottles(features);
    
    if (matches.length === 0) {
      return {
        topMatch: null,
        alternativeMatches: [],
        noMatches: true
      };
    }
    
    const [topMatch, ...alternativeMatches] = matches;
    
    return {
      topMatch,
      alternativeMatches: alternativeMatches.slice(0, 5), // Limit to top 5 alternatives
      noMatches: false
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

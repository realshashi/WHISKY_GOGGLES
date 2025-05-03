import React, { useRef, useState, useEffect } from "react";

interface ScannerProps {
  onCapture: (imageData: string) => void;
}

export default function Scanner({ onCapture }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions or try uploading an image instead.");
    }
  };

  const handleCapture = () => {
    if (!isCameraActive && !error) {
      // If camera is not active and there's no error, try to start it
      startCamera();
      return;
    }
    
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL (base64 encoded image)
        const imageData = canvas.toDataURL('image/jpeg');
        
        // Stop the camera stream
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        
        setIsCameraActive(false);
        
        // Send the captured image data to parent component
        onCapture(imageData);
      }
    }
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onCapture(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="mb-8" id="scanner">
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold text-secondary-color mb-4 text-center app-heading">
          Scan Whisky Label
        </h2>
        
        {/* Hidden canvas for capturing frames */}
        <canvas ref={canvasRef} className="hidden"></canvas>
        
        {/* Camera Viewfinder */}
        <div className="relative w-full rounded-lg overflow-hidden bg-secondary-dark mb-5 aspect-[3/4] shadow-xl">
          {/* Camera Feed */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
            autoPlay
            playsInline
          ></video>
          
          {/* Camera Fallback/Placeholder */}
          {!isCameraActive && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary-dark p-6">
              <span className="material-icons text-neutral-color text-6xl mb-4">photo_camera</span>
              <p className="text-neutral-color text-center text-sm max-w-xs">
                Tap the camera button below to activate your camera and scan a whisky bottle label
              </p>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary-dark bg-opacity-90">
              <div className="bg-white rounded-lg shadow-md p-6 m-4 text-center max-w-xs">
                <span className="material-icons block mx-auto mb-3 text-4xl text-error-color">error_outline</span>
                <h3 className="text-secondary-color font-medium mb-2">Camera Error</h3>
                <p className="text-secondary-light text-sm mb-4">{error}</p>
                <button 
                  onClick={handleImageUpload}
                  className="bg-primary-color hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors"
                >
                  Upload From Gallery
                </button>
              </div>
            </div>
          )}
          
          {/* Scanning Guides - Only show when camera is active */}
          {isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="scanner-outline w-full h-3/4 rounded-lg flex items-center justify-center">
                <div className="text-neutral-color text-center bg-secondary-dark bg-opacity-70 p-3 rounded-lg max-w-xs">
                  <span className="material-icons block mx-auto mb-2 text-3xl animate-pulse">center_focus_weak</span>
                  <p className="text-sm">Align bottle label within frame and tap the capture button</p>
                </div>
              </div>
              {/* Recording indicator */}
              <div className="absolute top-4 right-4">
                <div className="animate-pulse flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-white text-xs">LIVE</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Camera Controls */}
        <div className="flex justify-center gap-6 w-full mb-3">
          <button 
            onClick={handleCapture}
            className="bg-primary-color hover:bg-primary-dark text-white rounded-full p-5 shadow-lg transition-all active:scale-95 flex items-center justify-center"
            aria-label={isCameraActive ? "Capture photo" : "Start camera"}
          >
            <span className="material-icons text-3xl">
              {isCameraActive ? 'camera' : 'camera_alt'}
            </span>
          </button>
          <button 
            onClick={handleImageUpload}
            className="bg-secondary-color hover:bg-secondary-light text-white rounded-full p-5 shadow-lg transition-all active:scale-95 flex items-center justify-center"
            aria-label="Upload from gallery"
          >
            <span className="material-icons text-3xl">photo_library</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </div>
        
        <p className="text-sm text-secondary-color text-center max-w-xs">
          {isCameraActive 
            ? "Position the bottle label in the frame and tap to capture" 
            : "Tap camera to scan or choose from your gallery"}
        </p>
      </div>
    </section>
  );
}

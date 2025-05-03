import { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import Scanner from "@/components/Scanner";
import Processing from "@/components/Processing";
import Results from "@/components/Results";
import Search from "@/components/Search";
import History from "@/components/History";
import Settings from "@/components/Settings";
import { ActiveTab, BottleMatch, ScanResult } from "@/types";
import { processImage } from "@/lib/imageUtils";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("scan");
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  
  const handleCapture = async (imageData: string) => {
    setIsProcessing(true);
    setScanResult(null);
    
    try {
      // Process the image and get matches
      const result = await processImage(imageData);
      setScanResult(result);
    } catch (error) {
      console.error("Error processing image:", error);
      // Set an empty result with no matches
      setScanResult({
        topMatch: null,
        alternativeMatches: [],
        noMatches: true
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSelectAlternative = (match: BottleMatch) => {
    if (!scanResult) return;
    
    // Move the selected match to the top and rearrange alternatives
    const currentTop = scanResult.topMatch;
    const newAlternatives = scanResult.alternativeMatches.filter(m => m.bottle.id !== match.bottle.id);
    
    if (currentTop) {
      newAlternatives.unshift(currentTop);
    }
    
    setScanResult({
      topMatch: match,
      alternativeMatches: newAlternatives,
      noMatches: false
    });
  };
  
  const handleTryAgain = () => {
    setScanResult(null);
  };
  
  const handleSavePrice = async (bottleId: number, price: number) => {
    try {
      const response = await fetch('/api/scans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bottle_id: bottleId,
          store_price: price,
          confidence: scanResult?.topMatch?.confidence || 0
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save price');
      }
      
      // Optionally show success message
    } catch (error) {
      console.error("Error saving price:", error);
      // Handle error
    }
  };

  return (
    <div className="max-w-md mx-auto pb-16">
      <Header />
      
      <main className="px-4 py-6">
        {activeTab === "scan" && !isProcessing && !scanResult && (
          <Scanner onCapture={handleCapture} />
        )}
        
        {isProcessing && (
          <Processing />
        )}
        
        {activeTab === "scan" && !isProcessing && scanResult && (
          <Results 
            scanResult={scanResult} 
            onSelectAlternative={handleSelectAlternative}
            onTryAgain={handleTryAgain}
            onSavePrice={handleSavePrice}
          />
        )}
        
        {activeTab === "search" && (
          <Search />
        )}
        
        {activeTab === "history" && (
          <History />
        )}
        
        {activeTab === "settings" && (
          <Settings />
        )}
      </main>
      
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

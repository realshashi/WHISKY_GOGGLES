import React, { useState } from "react";
import { ScanResult, BottleMatch } from "@/types";

interface ResultsProps {
  scanResult: ScanResult;
  onSelectAlternative: (match: BottleMatch) => void;
  onTryAgain: () => void;
  onSavePrice: (bottleId: number, price: number) => void;
}

export default function Results({ 
  scanResult, 
  onSelectAlternative, 
  onTryAgain, 
  onSavePrice 
}: ResultsProps) {
  const [storePrice, setStorePrice] = useState<string>("");
  
  const handleSavePrice = () => {
    if (!scanResult.topMatch || !storePrice) return;
    
    const price = parseFloat(storePrice);
    if (isNaN(price) || price <= 0) return;
    
    onSavePrice(scanResult.topMatch.bottle.id, price);
    setStorePrice("");
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^(\d*\.?\d*)$/.test(value) || value === "") {
      setStorePrice(value);
    }
  };

  if (scanResult.noMatches) {
    return (
      <section className="mb-8">
        <div className="w-full bg-white rounded-lg shadow-md p-6 text-center">
          <span className="material-icons text-error-color text-4xl mb-2">sentiment_dissatisfied</span>
          <h3 className="text-lg font-medium text-secondary-color mb-2">No Matches Found</h3>
          <p className="text-sm text-secondary-light mb-4">We couldn't identify this bottle label. Try again with a clearer image.</p>
          <button 
            onClick={onTryAgain}
            className="bg-primary-color hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      {scanResult.topMatch && (
        <div className="w-full bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <div className="bg-primary-color p-3">
            <h3 className="text-neutral-color font-bold text-lg app-heading">Top Match</h3>
          </div>
          
          <div className="p-4">
            <div className="flex gap-4">
              {/* Bottle Image */}
              <div className="w-24 h-32 flex-shrink-0 rounded overflow-hidden bg-neutral-dark">
                <img 
                  src={scanResult.topMatch.bottle.image_url} 
                  alt={scanResult.topMatch.bottle.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x200?text=No+Image';
                  }}
                />
              </div>
              
              {/* Bottle Details */}
              <div className="flex-1">
                <h4 className="font-bold text-secondary-color text-lg mb-1">{scanResult.topMatch.bottle.name}</h4>
                <p className="text-sm text-secondary-light mb-2">
                  {scanResult.topMatch.bottle.spirit_type} • {scanResult.topMatch.bottle.size}ml • 
                  {scanResult.topMatch.bottle.proof ? `${scanResult.topMatch.bottle.proof} Proof` : ''} 
                  ({scanResult.topMatch.bottle.abv}% ABV)
                </p>
                
                {/* Confidence Score */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-secondary-light">Match Confidence</span>
                    <span className="text-xs font-medium text-success-color">{Math.round(scanResult.topMatch.confidence)}%</span>
                  </div>
                  <div className="confidence-meter bg-neutral-dark">
                    <div 
                      className="bg-success-color h-full" 
                      style={{ width: `${Math.round(scanResult.topMatch.confidence)}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Price Information */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-1 bg-neutral-color rounded">
                    <div className="text-xs text-secondary-light">MSRP</div>
                    <div className="font-medium">${scanResult.topMatch.bottle.avg_msrp.toFixed(2)}</div>
                  </div>
                  <div className="text-center p-1 bg-neutral-color rounded">
                    <div className="text-xs text-secondary-light">Fair</div>
                    <div className="font-medium">${scanResult.topMatch.bottle.fair_price.toFixed(2)}</div>
                  </div>
                  <div className="text-center p-1 bg-neutral-color rounded">
                    <div className="text-xs text-secondary-light">Avg</div>
                    <div className="font-medium">${scanResult.topMatch.bottle.shelf_price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Record Price Section */}
            <div className="mt-4 pt-3 border-t border-neutral-color">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-light">$</span>
                  <input 
                    type="text"
                    value={storePrice}
                    onChange={handlePriceChange}
                    placeholder="Enter store price" 
                    className="price-input w-full pl-8 pr-3 py-2 rounded border border-neutral-dark bg-neutral-color focus:ring-2 focus:ring-primary-color/20"
                  />
                </div>
                <button 
                  onClick={handleSavePrice}
                  className="bg-primary-color hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Alternative Matches */}
      {scanResult.alternativeMatches.length > 0 && (
        <>
          <h3 className="text-secondary-color font-medium mb-3 app-heading">Other Possible Matches</h3>
          <div className="space-y-3">
            {scanResult.alternativeMatches.map((match) => (
              <div 
                key={match.bottle.id}
                className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-3"
              >
                <div className="w-12 h-16 flex-shrink-0 bg-neutral-dark rounded overflow-hidden">
                  <img 
                    src={match.bottle.image_url} 
                    alt={match.bottle.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x160?text=No+Image';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-secondary-color">{match.bottle.name}</h4>
                    <span className="text-xs text-secondary-light bg-neutral-color rounded px-2 py-1">
                      {Math.round(match.confidence)}%
                    </span>
                  </div>
                  <p className="text-xs text-secondary-light">
                    {match.bottle.spirit_type} • {match.bottle.size}ml • {match.bottle.abv}% ABV
                  </p>
                </div>
                <button 
                  className="text-primary-color hover:text-primary-dark"
                  onClick={() => onSelectAlternative(match)}
                >
                  <span className="material-icons">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      
      <div className="mt-4 text-center">
        <button 
          onClick={onTryAgain}
          className="text-primary-color hover:text-primary-dark font-medium"
        >
          Scan Another Bottle
        </button>
      </div>
    </section>
  );
}

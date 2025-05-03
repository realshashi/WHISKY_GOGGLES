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
        <div className="w-full bg-white rounded-lg shadow-md mb-5 overflow-hidden">
          <div className="bg-primary-color p-3 flex items-center justify-between">
            <h3 className="text-neutral-color font-bold text-lg app-heading">Top Match</h3>
            <div className="bg-white bg-opacity-20 rounded-full px-2 py-1 text-xs text-white font-medium">
              {Math.round(scanResult.topMatch.confidence)}% Match
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex gap-5">
              {/* Bottle Image */}
              <div className="w-28 h-36 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-dark shadow-md">
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
                <h4 className="font-bold text-secondary-color text-xl mb-1">{scanResult.topMatch.bottle.name}</h4>
                <p className="text-sm text-secondary-light mb-3">
                  <span className="inline-block bg-neutral-color px-2 py-1 rounded mr-2 mb-1">
                    {scanResult.topMatch.bottle.spirit_type}
                  </span>
                  <span className="inline-block bg-neutral-color px-2 py-1 rounded mr-2 mb-1">
                    {scanResult.topMatch.bottle.size}ml
                  </span>
                  {scanResult.topMatch.bottle.proof && (
                    <span className="inline-block bg-neutral-color px-2 py-1 rounded mr-2 mb-1">
                      {scanResult.topMatch.bottle.proof} Proof
                    </span>
                  )}
                  <span className="inline-block bg-neutral-color px-2 py-1 rounded mb-1">
                    {scanResult.topMatch.bottle.abv}% ABV
                  </span>
                </p>
                
                {/* Confidence Score */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-secondary-light font-medium">Match Confidence</span>
                    <span className="text-xs font-medium" style={{ 
                      color: scanResult.topMatch.confidence > 80 ? 'var(--success-color)' : 
                             scanResult.topMatch.confidence > 60 ? 'var(--warning-color)' : 
                             'var(--error-color)' 
                    }}>
                      {Math.round(scanResult.topMatch.confidence)}%
                    </span>
                  </div>
                  <div className="confidence-meter bg-neutral-dark rounded-full h-2.5">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${Math.round(scanResult.topMatch.confidence)}%`,
                        backgroundColor: scanResult.topMatch.confidence > 80 ? 'var(--success-color)' : 
                                        scanResult.topMatch.confidence > 60 ? 'var(--warning-color)' : 
                                        'var(--error-color)'
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Price Information */}
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center p-2 bg-neutral-color rounded-lg shadow-sm">
                    <div className="text-xs text-secondary-light font-medium">MSRP</div>
                    <div className="font-bold text-primary-color">${scanResult.topMatch.bottle.avg_msrp.toFixed(2)}</div>
                  </div>
                  <div className="text-center p-2 bg-neutral-color rounded-lg shadow-sm">
                    <div className="text-xs text-secondary-light font-medium">Fair</div>
                    <div className="font-bold text-primary-color">${scanResult.topMatch.bottle.fair_price.toFixed(2)}</div>
                  </div>
                  <div className="text-center p-2 bg-neutral-color rounded-lg shadow-sm">
                    <div className="text-xs text-secondary-light font-medium">Avg</div>
                    <div className="font-bold text-primary-color">${scanResult.topMatch.bottle.shelf_price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Record Price Section */}
            <div className="mt-5 pt-4 border-t border-neutral-color">
              <div className="mb-2">
                <h4 className="text-secondary-color font-medium text-sm">Found this bottle in a store?</h4>
                <p className="text-xs text-secondary-light">Record the price to compare against market values</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-light font-medium">$</span>
                  <input 
                    type="text"
                    value={storePrice}
                    onChange={handlePriceChange}
                    placeholder="Enter store price" 
                    className="price-input w-full pl-8 pr-3 py-2.5 rounded-lg border-2 border-neutral-dark bg-white focus:border-primary-color focus:ring-2 focus:ring-primary-color/20 transition-colors"
                  />
                </div>
                <button 
                  onClick={handleSavePrice}
                  disabled={!storePrice}
                  className={`flex items-center gap-1 px-5 py-2.5 rounded-lg transition-colors shadow-md ${
                    storePrice 
                      ? 'bg-primary-color hover:bg-primary-dark text-white' 
                      : 'bg-neutral-dark text-secondary-light cursor-not-allowed'
                  }`}
                >
                  <span className="material-icons text-sm">save</span>
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Alternative Matches */}
      {scanResult.alternativeMatches.length > 0 && (
        <div className="mb-5">
          <h3 className="text-secondary-color font-semibold text-lg mb-3 app-heading flex items-center">
            <span className="material-icons text-sm mr-1">playlist_add</span>
            Other Possible Matches
          </h3>
          <div className="space-y-3">
            {scanResult.alternativeMatches.map((match) => (
              <div 
                key={match.bottle.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-20 flex-shrink-0 bg-neutral-dark rounded-md overflow-hidden shadow">
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
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-secondary-color text-base">{match.bottle.name}</h4>
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: match.confidence > 80 ? 'var(--success-color)' : 
                                       match.confidence > 60 ? 'var(--warning-color)' : 
                                       'var(--error-color)',
                        color: 'white',
                        opacity: 0.9
                      }}
                    >
                      {Math.round(match.confidence)}%
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-secondary-light flex flex-wrap gap-1">
                    <span className="inline-block bg-neutral-color px-1.5 py-0.5 rounded">
                      {match.bottle.spirit_type}
                    </span>
                    <span className="inline-block bg-neutral-color px-1.5 py-0.5 rounded">
                      ${match.bottle.avg_msrp.toFixed(2)}
                    </span>
                    <span className="inline-block bg-neutral-color px-1.5 py-0.5 rounded">
                      {match.bottle.abv}% ABV
                    </span>
                  </div>
                </div>
                <button 
                  className="bg-primary-color hover:bg-primary-dark text-white rounded-full w-10 h-10 flex items-center justify-center shadow transition-colors"
                  onClick={() => onSelectAlternative(match)}
                  aria-label="Select this match"
                >
                  <span className="material-icons">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <button 
          onClick={onTryAgain}
          className="bg-neutral-color hover:bg-neutral-dark text-secondary-color font-medium px-5 py-3 rounded-lg shadow transition-colors flex items-center justify-center mx-auto"
        >
          <span className="material-icons mr-2">camera_alt</span>
          Scan Another Bottle
        </button>
      </div>
    </section>
  );
}

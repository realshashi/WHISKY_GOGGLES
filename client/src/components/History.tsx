import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Scan, Bottle } from "@/types";
import { formatDistanceToNow } from 'date-fns';

export default function History() {
  const [selectedScan, setSelectedScan] = useState<(Scan & { bottle?: Bottle }) | null>(null);
  const queryClient = useQueryClient();
  
  // Fetch user's scan history
  const { data: scans, isLoading } = useQuery({
    queryKey: ['/api/scans'],
    queryFn: async () => {
      const res = await fetch('/api/scans');
      if (!res.ok) throw new Error('Failed to fetch scan history');
      return res.json() as Promise<Scan[]>;
    }
  });
  
  // Fetch bottle details for the scans
  const { data: bottles } = useQuery({
    queryKey: ['/api/bottles'],
    queryFn: async () => {
      const res = await fetch('/api/bottles');
      if (!res.ok) throw new Error('Failed to fetch bottles');
      return res.json() as Promise<Bottle[]>;
    }
  });
  
  // Delete scan mutation
  const deleteMutation = useMutation({
    mutationFn: async (scanId: number) => {
      const res = await fetch(`/api/scans/${scanId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete scan');
      return scanId;
    },
    onSuccess: () => {
      // Invalidate the scans query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/scans'] });
      setSelectedScan(null);
    }
  });
  
  // Match bottles to scans
  const scansWithBottles = scans && bottles 
    ? scans.map(scan => {
        const bottle = bottles.find(b => b.id === scan.bottle_id);
        return { ...scan, bottle };
      }).sort((a, b) => {
        // Sort by created_at date, newest first
        return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime();
      })
    : [];

  const handleDeleteScan = (scanId: number) => {
    if (window.confirm('Are you sure you want to delete this scan?')) {
      deleteMutation.mutate(scanId);
    }
  };

  const handleScanSelect = (scan: Scan & { bottle?: Bottle }) => {
    setSelectedScan(scan);
  };

  const closeDetails = () => {
    setSelectedScan(null);
  };

  const formatScanTime = (date: Date | string | null | undefined) => {
    if (!date) return '';
    const scanDate = new Date(date);
    return formatDistanceToNow(scanDate, { addSuffix: true });
  };

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-secondary-color mb-4 app-heading flex items-center">
        <span className="material-icons mr-2">history</span>
        Scan History
      </h3>

      {selectedScan && selectedScan.bottle ? (
        <div className="bg-white rounded-lg shadow-lg mb-5 overflow-hidden">
          <div className="bg-primary-color p-3 flex items-center justify-between">
            <h4 className="text-neutral-color font-medium">Scan Details</h4>
            <button 
              onClick={closeDetails}
              className="text-neutral-color hover:text-white"
              aria-label="Close details"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex gap-4 mb-4">
              <div className="w-24 h-32 flex-shrink-0 bg-neutral-dark rounded-lg overflow-hidden shadow">
                <img 
                  src={selectedScan.bottle.image_url} 
                  alt={selectedScan.bottle.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x160?text=No+Image';
                  }}
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-secondary-color text-lg">{selectedScan.bottle.name}</h4>
                <p className="text-xs text-secondary-light mb-2">
                  {selectedScan.bottle.spirit_type} • {selectedScan.bottle.size}ml • {selectedScan.bottle.abv}% ABV
                </p>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="text-xs bg-neutral-color rounded-full px-3 py-1 flex items-center">
                    <span className="material-icons text-xs mr-1">schedule</span>
                    {formatScanTime(selectedScan.created_at)}
                  </div>
                  
                  {selectedScan.confidence && (
                    <div className="text-xs bg-neutral-color rounded-full px-3 py-1 flex items-center">
                      <span className="material-icons text-xs mr-1">verified</span>
                      {Math.round(selectedScan.confidence)}% Match
                    </div>
                  )}
                </div>
                
                {selectedScan.store_price && (
                  <div className="mt-3 bg-neutral-color p-3 rounded-lg">
                    <div className="text-xs text-secondary-light mb-1">Recorded Store Price</div>
                    <div className="text-primary-color font-bold text-xl">
                      ${selectedScan.store_price.toFixed(2)}
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-secondary-light">vs. MSRP:</span>
                        <span className={`font-medium ${selectedScan.store_price > selectedScan.bottle.avg_msrp ? 'text-error-color' : 'text-success-color'}`}>
                          {selectedScan.store_price > selectedScan.bottle.avg_msrp ? '+' : ''}
                          ${(selectedScan.store_price - selectedScan.bottle.avg_msrp).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-light">vs. Fair:</span>
                        <span className={`font-medium ${selectedScan.store_price > selectedScan.bottle.fair_price ? 'text-error-color' : 'text-success-color'}`}>
                          {selectedScan.store_price > selectedScan.bottle.fair_price ? '+' : ''}
                          ${(selectedScan.store_price - selectedScan.bottle.fair_price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={() => handleDeleteScan(selectedScan.id)}
                className="text-error-color hover:bg-error-color hover:text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                disabled={deleteMutation.isPending}
              >
                <span className="material-icons text-sm mr-1">delete</span>
                Delete Scan
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-color border-t-transparent mb-3"></div>
              <p className="text-secondary-light">Loading your scan history...</p>
            </div>
          ) : scansWithBottles.length > 0 ? (
            <>
              <div className="mb-3 text-xs text-secondary-light font-medium px-2">
                {scansWithBottles.length} {scansWithBottles.length === 1 ? 'scan' : 'scans'} in your history
              </div>
              <div className="divide-y divide-neutral-color">
                {scansWithBottles.map(scan => (
                  <div 
                    key={scan.id} 
                    className="py-3 flex items-center gap-3 hover:bg-neutral-color rounded cursor-pointer transition-colors px-2"
                    onClick={() => handleScanSelect(scan)}
                  >
                    {scan.bottle && (
                      <>
                        <div className="w-14 h-18 flex-shrink-0 bg-neutral-color rounded overflow-hidden shadow">
                          <img 
                            src={scan.bottle.image_url} 
                            alt={scan.bottle.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).onerror = null;
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x160?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-secondary-color">{scan.bottle.name}</h4>
                            {scan.store_price && (
                              <span className="text-sm font-bold text-primary-color">
                                ${scan.store_price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-secondary-light flex items-center">
                              <span className="material-icons text-xs mr-1">schedule</span>
                              {formatScanTime(scan.created_at)}
                            </p>
                            <span className="material-icons text-primary-color">chevron_right</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <span className="material-icons text-5xl text-secondary-light opacity-70 mb-4">history</span>
              <h4 className="text-secondary-color font-medium text-lg mb-2">No Scan History Yet</h4>
              <p className="text-secondary-light mb-6 max-w-xs">
                Scanned bottles will appear here. Start by scanning a whisky bottle using the camera.
              </p>
              <div className="text-xs text-secondary-light opacity-70 max-w-xs">
                Scan history helps you track bottles you've seen and prices you've recorded at different stores.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Card */}
      {scansWithBottles.length > 0 && !selectedScan && (
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-secondary-color font-medium text-sm mb-3">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-color rounded-lg p-3 flex items-center">
              <span className="material-icons text-primary-color mr-2">camera_alt</span>
              <div>
                <div className="text-xs text-secondary-light">Total Scans</div>
                <div className="font-bold text-secondary-color">{scansWithBottles.length}</div>
              </div>
            </div>
            <div className="bg-neutral-color rounded-lg p-3 flex items-center">
              <span className="material-icons text-primary-color mr-2">paid</span>
              <div>
                <div className="text-xs text-secondary-light">Price Records</div>
                <div className="font-bold text-secondary-color">
                  {scansWithBottles.filter(scan => scan.store_price !== null && scan.store_price !== undefined).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

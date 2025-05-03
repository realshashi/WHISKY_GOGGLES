import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Scan, Bottle } from "@/types";

export default function History() {
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
  
  // Match bottles to scans
  const scansWithBottles = scans && bottles 
    ? scans.map(scan => {
        const bottle = bottles.find(b => b.id === scan.bottle_id);
        return { ...scan, bottle };
      })
    : [];

  return (
    <section className="mb-8">
      <h3 className="text-lg font-medium text-secondary-color mb-3 app-heading">Recent Scans</h3>
      <div className="bg-white rounded-lg shadow-md p-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color"></div>
          </div>
        ) : scansWithBottles.length > 0 ? (
          <div className="space-y-3">
            {scansWithBottles.map(scan => (
              <div key={scan.id} className="flex items-center gap-3 border-b border-neutral-color pb-3">
                {scan.bottle && (
                  <>
                    <div className="w-12 h-16 flex-shrink-0 bg-neutral-dark rounded overflow-hidden">
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
                      <h4 className="font-medium text-secondary-color">{scan.bottle.name}</h4>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-secondary-light">
                          {new Date(scan.created_at!).toLocaleDateString()}
                        </p>
                        {scan.store_price && (
                          <span className="text-sm font-medium text-primary-color">
                            ${scan.store_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-secondary-light text-center py-4">No scan history yet</p>
        )}
      </div>
    </section>
  );
}

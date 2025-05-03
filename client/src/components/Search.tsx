import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bottle } from "@/types";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);
  
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/bottles/search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const res = await fetch(`/api/bottles/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json() as Promise<Bottle[]>;
    },
    enabled: searchQuery.trim().length > 0
  });

  const handleBottleSelect = (bottle: Bottle) => {
    setSelectedBottle(bottle);
  };

  const closeBottleDetails = () => {
    setSelectedBottle(null);
  };

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-secondary-color mb-4 app-heading flex items-center">
        <span className="material-icons mr-2">search</span>
        Find Whisky Bottles
      </h3>

      {/* Search Input */}
      <div className="bg-white rounded-lg shadow-lg p-5 mb-5">
        <div className="relative mb-4">
          <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-secondary-light">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bottle name or type..." 
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-neutral-dark bg-white focus:border-primary-color focus:ring-2 focus:ring-primary-color/20 transition-colors shadow-sm"
          />
        </div>
        
        {searchQuery && !isLoading && searchResults && (
          <div className="text-xs text-secondary-light mb-2">
            Found {searchResults.length} {searchResults.length === 1 ? 'bottle' : 'bottles'} matching "{searchQuery}"
          </div>
        )}
        
        {selectedBottle ? (
          <div className="bg-neutral-color rounded-lg p-4 relative">
            <button 
              onClick={closeBottleDetails}
              className="absolute top-3 right-3 text-secondary-light hover:text-secondary-color"
              aria-label="Close details"
            >
              <span className="material-icons">close</span>
            </button>
            
            <div className="flex gap-4">
              <div className="w-24 h-32 bg-white rounded-lg shadow overflow-hidden flex-shrink-0">
                <img 
                  src={selectedBottle.image_url} 
                  alt={selectedBottle.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x200?text=No+Image';
                  }}
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-secondary-color text-lg">{selectedBottle.name}</h4>
                <div className="mt-2 flex flex-wrap gap-2 mb-3">
                  <span className="bg-white px-2 py-1 rounded text-xs text-secondary-color">
                    {selectedBottle.spirit_type}
                  </span>
                  <span className="bg-white px-2 py-1 rounded text-xs text-secondary-color">
                    {selectedBottle.size}ml
                  </span>
                  <span className="bg-white px-2 py-1 rounded text-xs text-secondary-color">
                    {selectedBottle.abv}% ABV
                  </span>
                  {selectedBottle.proof && (
                    <span className="bg-white px-2 py-1 rounded text-xs text-secondary-color">
                      {selectedBottle.proof} Proof
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white p-2 rounded text-center">
                    <div className="text-xs text-secondary-light">MSRP</div>
                    <div className="font-bold text-primary-color text-sm">
                      ${selectedBottle.avg_msrp.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded text-center">
                    <div className="text-xs text-secondary-light">Fair Price</div>
                    <div className="font-bold text-primary-color text-sm">
                      ${selectedBottle.fair_price.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded text-center">
                    <div className="text-xs text-secondary-light">Shelf Price</div>
                    <div className="font-bold text-primary-color text-sm">
                      ${selectedBottle.shelf_price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto bg-neutral-color rounded-lg shadow-inner">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-color border-t-transparent mb-3"></div>
                <p className="text-secondary-light">Searching for bottles...</p>
              </div>
            ) : searchQuery.trim() === "" ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <span className="material-icons text-4xl text-secondary-light mb-3">local_bar</span>
                <p className="text-secondary-light text-center mb-1">Search for a whisky bottle by name or type</p>
                <p className="text-xs text-secondary-light text-center opacity-75">
                  (e.g., "Buffalo Trace", "Bourbon", "Japanese")
                </p>
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="divide-y divide-white">
                {searchResults.map(bottle => (
                  <div 
                    key={bottle.id} 
                    className="flex items-center gap-3 p-3 hover:bg-white cursor-pointer transition-colors"
                    onClick={() => handleBottleSelect(bottle)}
                  >
                    <div className="w-12 h-16 flex-shrink-0 bg-white rounded overflow-hidden shadow">
                      <img 
                        src={bottle.image_url} 
                        alt={bottle.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x140?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-secondary-color">{bottle.name}</h4>
                      <div className="flex items-center text-xs text-secondary-light mt-0.5">
                        <span className="px-1.5 py-0.5 bg-white rounded mr-2">
                          {bottle.spirit_type}
                        </span>
                        <span className="px-1.5 py-0.5 bg-white rounded">
                          ${bottle.avg_msrp.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <span className="material-icons text-primary-color">chevron_right</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="material-icons text-4xl text-secondary-light opacity-60 mb-3">search_off</span>
                <p className="text-secondary-light text-center">No bottles found matching "{searchQuery}"</p>
                <p className="text-xs text-secondary-light text-center mt-1 opacity-75">
                  Try using different keywords or a shorter search term
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h4 className="text-secondary-color font-medium text-sm mb-2 flex items-center">
          <span className="material-icons text-xs mr-1">tips_and_updates</span>
          Search Tips
        </h4>
        <ul className="text-xs text-secondary-light space-y-1">
          <li className="flex items-center">
            <span className="material-icons text-primary-color text-xs mr-1">check_circle</span>
            Search by brand name (e.g., "Macallan", "Buffalo Trace")
          </li>
          <li className="flex items-center">
            <span className="material-icons text-primary-color text-xs mr-1">check_circle</span>
            Search by whisky type (e.g., "Bourbon", "Single Malt")
          </li>
          <li className="flex items-center">
            <span className="material-icons text-primary-color text-xs mr-1">check_circle</span>
            Search by region (e.g., "Scotch", "Japanese", "Irish")
          </li>
        </ul>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bottle } from "@/types";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  
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

  return (
    <section className="mb-8">
      <h3 className="text-lg font-medium text-secondary-color mb-3 app-heading">Manual Search</h3>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative mb-4">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-secondary-light">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bottle name..." 
            className="w-full pl-10 pr-3 py-2 rounded border border-neutral-dark bg-neutral-color focus:ring-2 focus:ring-primary-color/20 focus:outline-none"
          />
        </div>
        
        <div className="max-h-64 overflow-y-auto space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color"></div>
            </div>
          ) : searchQuery.trim() === "" ? (
            <p className="text-sm text-secondary-light text-center py-4">Search for a whisky bottle by name</p>
          ) : searchResults && searchResults.length > 0 ? (
            searchResults.map(bottle => (
              <div key={bottle.id} className="flex items-center gap-2 p-2 hover:bg-neutral-color rounded transition-colors">
                <div className="w-10 h-14 flex-shrink-0 bg-neutral-dark rounded overflow-hidden">
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
                  <h4 className="font-medium text-secondary-color text-sm">{bottle.name}</h4>
                  <p className="text-xs text-secondary-light">
                    {bottle.spirit_type} • ${bottle.avg_msrp.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-secondary-light text-center py-4">No bottles found matching "{searchQuery}"</p>
          )}
        </div>
      </div>
    </section>
  );
}

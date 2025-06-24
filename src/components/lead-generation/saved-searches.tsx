"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bookmark, 
  Play, 
  Trash2, 
  Clock
} from "lucide-react";

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: string[];
  resultsCount: number;
  lastRun: string;
  isActive: boolean;
}

export function SavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: "1",
      name: "Senior React Developers",
      query: "Senior React developers with 5+ years experience in San Francisco",
      filters: ["Location: San Francisco", "Skills: React", "Experience: 5+ years"],
      resultsCount: 23,
      lastRun: "2024-01-22",
      isActive: true
    },
    {
      id: "2", 
      name: "Product Managers - Fintech",
      query: "Product managers with fintech experience and startup background",
      filters: ["Industry: Fintech", "Role: Product Manager", "Company: Startup"],
      resultsCount: 15,
      lastRun: "2024-01-20",
      isActive: false
    },
    {
      id: "3",
      name: "DevOps Engineers",
      query: "DevOps engineers with Kubernetes and AWS experience",
      filters: ["Skills: Kubernetes", "Skills: AWS", "Role: DevOps"],
      resultsCount: 31,
      lastRun: "2024-01-19",
      isActive: true
    }
  ]);

  const runSearch = (searchId: string) => {
    setSavedSearches(prev => 
      prev.map(search => 
        search.id === searchId 
          ? { ...search, lastRun: new Date().toISOString().split('T')[0] }
          : search
      )
    );
  };

  const deleteSearch = (searchId: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== searchId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bookmark className="w-5 h-5" />
          <span>Saved Searches</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {savedSearches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No saved searches yet</p>
          </div>
        ) : (
          savedSearches.map((search) => (
            <div key={search.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{search.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{search.query}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {search.isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-1">
                {search.filters.map((filter, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {filter}
                  </Badge>
                ))}
              </div>

              {/* Stats and Actions */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4 text-gray-600">
                  <span>{search.resultsCount} results</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Last run {formatDate(search.lastRun)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runSearch(search.id)}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Run
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSearch(search.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
        
        <Button variant="outline" className="w-full">
          <Bookmark className="w-4 h-4 mr-2" />
          Save Current Search
        </Button>
      </CardContent>
    </Card>
  );
} 
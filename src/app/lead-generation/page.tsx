"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  Sparkles,
  Target,
  Zap,
  Download
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { SearchFilters } from "@/components/lead-generation/search-filters";
import { ProfileCard } from "@/components/lead-generation/profile-card";
import { SavedSearches } from "@/components/lead-generation/saved-searches";

interface LinkedInProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  profileUrl: string;
  summary: string;
  experience: string;
  skills: string[];
  connections: number;
  relevanceScore: number;
}

export default function LeadGeneration() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<LinkedInProfile[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<string[]>([]);

  const mockResults: LinkedInProfile[] = [
    {
      id: "1",
      name: "Alexandra Thompson",
      title: "Senior Software Engineer",
      company: "Google",
      location: "San Francisco, CA",
      profileUrl: "https://linkedin.com/in/alexandra-thompson",
      summary: "Passionate full-stack developer with 6+ years experience in React, Node.js, and cloud technologies. Led multiple high-impact projects and mentored junior developers.",
      experience: "6+ years",
      skills: ["React", "Node.js", "TypeScript", "AWS", "Python"],
      connections: 500,
      relevanceScore: 95
    },
    {
      id: "2", 
      name: "David Kim",
      title: "Frontend Developer",
      company: "Meta",
      location: "Menlo Park, CA",
      profileUrl: "https://linkedin.com/in/david-kim-dev",
      summary: "Creative frontend developer specializing in modern web technologies and user experience design. Experience with React, Vue.js, and mobile-first development.",
      experience: "4+ years",
      skills: ["React", "Vue.js", "JavaScript", "CSS", "UI/UX"],
      connections: 320,
      relevanceScore: 88
    },
    {
      id: "3",
      name: "Maria Rodriguez",
      title: "Full Stack Engineer",
      company: "Stripe",
      location: "Remote",
      profileUrl: "https://linkedin.com/in/maria-rodriguez-eng",
      summary: "Full-stack engineer with expertise in fintech and payment systems. Strong background in both frontend and backend development with focus on scalable solutions.",
      experience: "5+ years",
      skills: ["React", "Node.js", "Python", "PostgreSQL", "Docker"],
      connections: 450,
      relevanceScore: 92
    }
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, you would call the Exa API here
    setResults(mockResults);
    setIsSearching(false);
  };

  const toggleSaveProfile = (profileId: string) => {
    setSavedProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const searchSuggestions = [
    "React developers with 5+ years experience in San Francisco",
    "Senior Product Managers in fintech companies",
    "DevOps engineers with Kubernetes experience",
    "UX designers who worked at startup companies",
    "Data scientists with machine learning background"
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Lead Generation</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">LinkedIn Lead Generation</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find potential candidates using natural language queries. 
          Powered by Exa API for intelligent LinkedIn profile discovery.
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Natural Language Search</span>
          </CardTitle>
          <CardDescription>
            Describe the type of candidate you're looking for in plain English
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-query">Search Query</Label>
            <Textarea
              id="search-query"
              placeholder="e.g., 'Senior React developers in San Francisco with startup experience and strong TypeScript skills'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Try being specific about skills, location, experience level, and company type
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={!query.trim() || isSearching}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSearching ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Profiles
                </>
              )}
            </Button>
          </div>

          {/* Search Suggestions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Search Examples:</Label>
            <div className="flex flex-wrap gap-2">
              {searchSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Filters and Results */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters />
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {results.length > 0 && (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Search Results</h3>
                  <p className="text-sm text-gray-600">
                    Found {results.length} potential candidates
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid gap-6">
                {results.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    isSaved={savedProfiles.includes(profile.id)}
                    onToggleSave={() => toggleSaveProfile(profile.id)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {results.length === 0 && !isSearching && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start Your Search
                </h3>
                <p className="text-gray-600 mb-4 max-w-md">
                  Enter what you&apos;re looking for in natural language. Our AI will find matching LinkedIn profiles based on your requirements.
                </p>
                <Badge variant="secondary" className="text-xs">
                  Powered by Exa API
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isSearching && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-6 h-6 text-purple-600 animate-pulse" />
                  <span className="text-lg font-medium">Searching LinkedIn...</span>
                </div>
                <p className="text-gray-600 text-center">
                  AI is analyzing profiles and finding the best matches for your query
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Saved Searches */}
      <SavedSearches />
    </div>
  );
} 
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Filter, RotateCcw } from "lucide-react";

export function SearchFilters() {
  const [filters, setFilters] = useState({
    location: "",
    experienceLevel: "",
    companySize: "",
    industry: "",
    skills: [] as string[],
    minConnections: "",
    maxConnections: ""
  });

  const experienceLevels = [
    "Entry Level (0-2 years)",
    "Mid Level (3-5 years)", 
    "Senior Level (6-10 years)",
    "Executive Level (10+ years)"
  ];

  const companySizes = [
    "Startup (1-50 employees)",
    "Small (51-200 employees)",
    "Medium (201-1000 employees)",
    "Large (1000+ employees)"
  ];

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Media"
  ];

  const popularSkills = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript",
    "AWS", "Docker", "Kubernetes", "SQL", "MongoDB",
    "Machine Learning", "UI/UX", "Product Management"
  ];

  const handleSkillToggle = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      experienceLevel: "",
      companySize: "",
      industry: "",
      skills: [],
      minConnections: "",
      maxConnections: ""
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Search Filters</span>
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            placeholder="City, State, Country"
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>

        <Separator />

        {/* Experience Level */}
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select 
            value={filters.experienceLevel} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, experienceLevel: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Company Size */}
        <div className="space-y-2">
          <Label>Company Size</Label>
          <Select 
            value={filters.companySize} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, companySize: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {companySizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Industry */}
        <div className="space-y-2">
          <Label>Industry</Label>
          <Select 
            value={filters.industry} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Skills */}
        <div className="space-y-3">
          <Label>Required Skills</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {popularSkills.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={skill}
                  checked={filters.skills.includes(skill)}
                  onCheckedChange={() => handleSkillToggle(skill)}
                />
                <Label htmlFor={skill} className="text-sm font-normal cursor-pointer">
                  {skill}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Connections Range */}
        <div className="space-y-3">
          <Label>Connections Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                placeholder="Min"
                type="number"
                value={filters.minConnections}
                onChange={(e) => setFilters(prev => ({ ...prev, minConnections: e.target.value }))}
              />
            </div>
            <div>
              <Input
                placeholder="Max"
                type="number"
                value={filters.maxConnections}
                onChange={(e) => setFilters(prev => ({ ...prev, maxConnections: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <Button className="w-full" variant="outline">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
} 
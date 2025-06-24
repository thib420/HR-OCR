"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink,
  Star,
  MapPin,
  Building,
  Users,
  Mail,
  Phone,
  LinkedinIcon as LinkedIn
} from "lucide-react";

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

interface ProfileCardProps {
  profile: LinkedInProfile;
  isSaved: boolean;
  onToggleSave: () => void;
}

export function ProfileCard({ profile, isSaved, onToggleSave }: ProfileCardProps) {
  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 75) return 'bg-blue-100 text-blue-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="text-gray-600">{profile.title}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getRelevanceColor(profile.relevanceScore)}>
              {profile.relevanceScore}% match
            </Badge>
            <Button
              variant={isSaved ? "default" : "outline"}
              size="sm"
              onClick={onToggleSave}
            >
              <Star className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Company and Location */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Building className="w-4 h-4" />
            <span>{profile.company}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{profile.connections}+ connections</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-gray-700 line-clamp-3">
          {profile.summary}
        </p>

        {/* Skills */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Key Skills</h4>
          <div className="flex flex-wrap gap-1">
            {profile.skills.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {profile.skills.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{profile.skills.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        {/* Experience */}
        <div className="text-sm">
          <span className="font-medium">Experience: </span>
          <span className="text-gray-600">{profile.experience}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
          </div>
          
          <Button variant="outline" size="sm" asChild>
            <a 
              href={profile.profileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <LinkedIn className="w-4 h-4 mr-2" />
              View Profile
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
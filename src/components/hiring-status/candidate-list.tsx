"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare,
  ExternalLink,
  Building2
} from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  position: string;
  company: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: string;
  lastUpdate: string;
  email: string;
  phone: string;
  notes: string;
}

interface CandidateListProps {
  candidates: Candidate[];
  onUpdateStatus: (candidateId: string, newStatus: Candidate['status']) => void;
  getStatusColor: (status: Candidate['status']) => string;
  getStatusIcon: (status: Candidate['status']) => React.ReactNode;
}

export function CandidateList({ 
  candidates, 
  onUpdateStatus, 
  getStatusColor, 
  getStatusIcon 
}: CandidateListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <Card key={candidate.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{candidate.name}</h3>
                    <p className="text-gray-600">{candidate.position}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(candidate.status)}>
                      {getStatusIcon(candidate.status)}
                      <span className="ml-1 capitalize">{candidate.status}</span>
                    </Badge>
                  </div>
                </div>

                {/* Details Row */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Building2 className="w-4 h-4" />
                    <span>{candidate.company}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{candidate.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Applied {formatDate(candidate.appliedDate)}</span>
                  </div>
                </div>

                {/* Notes */}
                {candidate.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{candidate.notes}</p>
                  </div>
                )}

                {/* Actions Row */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">
                      Last updated: {formatDate(candidate.lastUpdate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Select
                      value={candidate.status}
                      onValueChange={(value: Candidate['status']) => 
                        onUpdateStatus(candidate.id, value)
                      }
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="screening">Screening</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="offer">Offer</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Share
                    </Button>

                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 
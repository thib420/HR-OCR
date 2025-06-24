"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Calendar,
  Mail,
  Plus,
  CheckCircle,
  Clock,
  BarChart3,
  ExternalLink,
  User,
  Building2,
  Copy
} from "lucide-react";
import { StatusOverview } from "@/components/hiring-status/status-overview";
import { AddCandidateDialog } from "@/components/hiring-status/add-candidate-dialog";

// Define the hiring process steps
const HIRING_STEPS = [
  { id: 'application', label: 'Application Received', description: 'Your application has been received and is being reviewed' },
  { id: 'hr_review', label: 'HR Screening', description: 'Initial review by HR team' },
  { id: 'technical_assessment', label: 'Technical Assessment', description: 'Technical skills evaluation' },
  { id: 'manager_interview', label: 'Manager Interview', description: 'Interview with hiring manager' },
  { id: 'final_interview', label: 'Final Interview', description: 'Final round with senior leadership' },
  { id: 'offer', label: 'Offer Extended', description: 'Job offer has been made' },
  { id: 'hired', label: 'Hired', description: 'Welcome to the team!' },
  { id: 'rejected', label: 'Not Selected', description: 'Thank you for your interest' }
];

interface Candidate {
  id: string;
  name: string;
  position: string;
  company: string;
  currentStep: string;
  email: string;
  phone: string;
  notes: string;
  appliedDate: string;
  lastUpdate: string;
  shareableLink: string;
}

interface Company {
  id: string;
  name: string;
  position: string;
  candidates: number;
  status: 'active' | 'paused' | 'completed';
}

// Mock user role - in real app this would come from authentication
const USER_ROLE = 'headhunter'; // 'headhunter', 'company', or 'candidate'

export default function HiringStatus() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      currentStep: 'manager_interview',
      appliedDate: '2024-01-15',
      lastUpdate: '2024-01-20',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      notes: 'Strong React skills, available immediately',
      shareableLink: 'https://hiring-app.com/status/candidate-1-token'
    },
    {
      id: '2',
      name: 'Michael Chen',
      position: 'Product Manager',
      company: 'StartupCo',
      currentStep: 'offer',
      appliedDate: '2024-01-10',
      lastUpdate: '2024-01-22',
      email: 'michael.c@email.com',
      phone: '+1 (555) 987-6543',
      notes: '5 years PM experience, excellent cultural fit',
      shareableLink: 'https://hiring-app.com/status/candidate-2-token'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      position: 'Data Scientist',
      company: 'AI Solutions Ltd.',
      currentStep: 'technical_assessment',
      appliedDate: '2024-01-18',
      lastUpdate: '2024-01-19',
      email: 'emily.r@email.com',
      phone: '+1 (555) 456-7890',
      notes: 'PhD in Statistics, Python expert',
      shareableLink: 'https://hiring-app.com/status/candidate-3-token'
    }
  ]);

  const [companies] = useState<Company[]>([
    { id: '1', name: 'TechCorp Inc.', position: 'Senior Frontend Developer', candidates: 3, status: 'active' },
    { id: '2', name: 'StartupCo', position: 'Product Manager', candidates: 2, status: 'active' },
    { id: '3', name: 'AI Solutions Ltd.', position: 'Data Scientist', candidates: 1, status: 'active' }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getCurrentStepIndex = (stepId: string) => {
    return HIRING_STEPS.findIndex(step => step.id === stepId);
  };

  const getStatusStats = () => {
    const stats = candidates.reduce((acc, candidate) => {
      const step = HIRING_STEPS.find(s => s.id === candidate.currentStep);
      if (step) {
        acc[step.label] = (acc[step.label] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return HIRING_STEPS.map(step => ({
      label: step.label,
      count: stats[step.label] || 0,
      color: step.id === 'hired' ? 'text-green-600' : 
             step.id === 'rejected' ? 'text-red-600' : 
             step.id === 'offer' ? 'text-orange-600' : 'text-blue-600'
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const updateCandidateStatus = (candidateId: string, newStep: string) => {
    setCandidates(prev => 
      prev.map(c => 
        c.id === candidateId 
          ? { ...c, currentStep: newStep, lastUpdate: new Date().toISOString().split('T')[0] }
          : c
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
          <BarChart3 className="w-4 h-4" />
          <span>Hiring Progress Dashboard</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Candidate Progress Tracker</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track candidates through each step of the hiring process. Share progress links with candidates for real-time updates.
        </p>
      </div>

      {/* Overview Stats */}
      <StatusOverview stats={getStatusStats()} />

      {/* Main Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Active Candidates</h2>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </div>

        {/* Candidates List */}
        <div className="space-y-4">
          {candidates.map((candidate) => {
            const currentStepIndex = getCurrentStepIndex(candidate.currentStep);
            const currentStep = HIRING_STEPS[currentStepIndex];
            
            return (
              <Card key={candidate.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>{candidate.name}</span>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span>{candidate.position}</span>
                        <span className="flex items-center space-x-1">
                          <Building2 className="w-4 h-4" />
                          {candidate.company}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge variant="outline" className="text-xs">
                        Step {currentStepIndex + 1} of {HIRING_STEPS.length - 1}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(candidate.shareableLink)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Timeline */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Status:</span>
                      <span className="text-sm text-blue-600 font-medium">{currentStep?.label}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center space-x-2">
                      {HIRING_STEPS.slice(0, -1).map((step, index) => (
                        <div key={step.id} className="flex items-center">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                            ${index <= currentStepIndex 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-600'
                            }
                          `}>
                            {index < currentStepIndex ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          {index < HIRING_STEPS.length - 2 && (
                            <div className={`
                              w-8 h-1 mx-1
                              ${index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'}
                            `} />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-600">{currentStep?.description}</p>
                  </div>

                  {/* Candidate Details */}
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{candidate.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Updated {new Date(candidate.lastUpdate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {candidate.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{candidate.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Update Status:</span>
                      <Select
                        value={candidate.currentStep}
                        onValueChange={(value) => updateCandidateStatus(candidate.id, value)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {HIRING_STEPS.map((step) => (
                            <SelectItem key={step.id} value={step.id}>
                              {step.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add Candidate Dialog */}
      <AddCandidateDialog 
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={(newCandidate) => {
          setCandidates(prev => [...prev, { 
            ...newCandidate, 
            id: Date.now().toString(),
            appliedDate: new Date().toISOString().split('T')[0],
            lastUpdate: new Date().toISOString().split('T')[0],
            currentStep: 'application',
            shareableLink: `https://hiring-app.com/status/candidate-${Date.now()}-token`
          }]);
          setIsAddDialogOpen(false);
        }}
        companies={companies}
      />
    </div>
  );
} 
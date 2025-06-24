"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle,
  Clock,
  User,
  Building2,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Users,
  Target
} from "lucide-react";

// Define the hiring process steps with enhanced details
const HIRING_STEPS = [
  { 
    id: 'application', 
    label: 'Application Submitted', 
    description: 'Your application has been successfully submitted and is in our system.',
    icon: <FileText className="w-5 h-5" />,
    details: 'Thank you for applying! We have received all your documents and information.'
  },
  { 
    id: 'hr_review', 
    label: 'HR Review', 
    description: 'Our HR team is reviewing your qualifications and background.',
    icon: <User className="w-5 h-5" />,
    details: 'HR specialists are evaluating your experience against our job requirements.'
  },
  { 
    id: 'technical_assessment', 
    label: 'Technical Assessment', 
    description: 'Please complete the technical evaluation we sent to your email.',
    icon: <MessageSquare className="w-5 h-5" />,
    details: 'Time to showcase your technical skills! Check your email for assessment details.'
  },
  { 
    id: 'manager_interview', 
    label: 'Manager Interview', 
    description: 'Interview scheduled with the hiring manager.',
    icon: <Users className="w-5 h-5" />,
    details: 'One-on-one discussion with the hiring manager about the role and your experience.'
  },
  { 
    id: 'final_interview', 
    label: 'Final Interview', 
    description: 'Final round with senior leadership team.',
    icon: <Building2 className="w-5 h-5" />,
    details: 'Meet with senior team members to discuss culture fit and long-term vision.'
  },
  { 
    id: 'offer', 
    label: 'Offer Extended', 
    description: 'Congratulations! We have extended a job offer. Please review the details.',
    icon: <Target className="w-5 h-5" />,
    details: 'We are excited to offer you this position! Review the offer package carefully.'
  },
  { 
    id: 'hired', 
    label: 'Welcome to the Team!', 
    description: 'Congratulations! You have been hired. Welcome aboard!',
    icon: <CheckCircle className="w-5 h-5" />,
    details: 'You are officially part of our team! Onboarding information will follow shortly.'
  }
];

const REJECTION_STEP = { 
  id: 'rejected', 
  label: 'Application Status Update', 
  description: 'Thank you for your interest. While we were impressed with your background, we have decided to move forward with other candidates.',
  icon: <Clock className="w-5 h-5" />,
  details: 'We appreciate the time you invested in our process and encourage future applications.'
};

interface StepProgress {
  stepId: string;
  completedDate: string;
  notes?: string;
}

interface CandidateInfo {
  id: string;
  name: string;
  position: string;
  company: string;
  currentStep: string;
  email: string;
  appliedDate: string;
  lastUpdate: string;
  notes?: string;
  stepProgress: StepProgress[];
}

export default function CandidateStatus() {
  const [candidate, setCandidate] = useState<CandidateInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock candidate data - in real app this would come from URL params/API
  useEffect(() => {
    // Simulate loading candidate data from shareable link
    setTimeout(() => {
      setCandidate({
        id: '1',
        name: 'Sarah Johnson',
        position: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        currentStep: 'manager_interview',
        email: 'sarah.j@email.com',
        appliedDate: '2024-01-15',
        lastUpdate: '2024-01-20',
        notes: 'Interview scheduled for next Tuesday at 2 PM',
        stepProgress: [
          {
            stepId: 'application',
            completedDate: '2024-01-15',
            notes: 'Application submitted with portfolio and cover letter'
          },
          {
            stepId: 'hr_review',
            completedDate: '2024-01-17',
            notes: 'Initial phone screening completed - great cultural fit!'
          },
          {
            stepId: 'technical_assessment',
            completedDate: '2024-01-19',
            notes: 'Technical assessment completed with excellent results'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Clock className="w-8 h-8 text-blue-600 mx-auto animate-spin" />
          <p className="text-gray-600">Loading your application status...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Candidate not found</p>
        </div>
      </div>
    );
  }

  const getCurrentStepIndex = () => {
    if (candidate.currentStep === 'rejected') return -1;
    return HIRING_STEPS.findIndex(step => step.id === candidate.currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();
  const isRejected = candidate.currentStep === 'rejected';
  const isHired = candidate.currentStep === 'hired';
  const currentStep = isRejected ? REJECTION_STEP : HIRING_STEPS.find(step => step.id === candidate.currentStep);

  const getStepStatus = (stepId: string, stepIndex: number) => {
    const stepProgress = candidate.stepProgress.find(p => p.stepId === stepId);
    
    if (stepProgress) {
      return {
        status: 'completed',
        date: stepProgress.completedDate,
        notes: stepProgress.notes
      };
    } else if (stepIndex === currentStepIndex) {
      return {
        status: 'current',
        date: null,
        notes: candidate.notes
      };
    } else if (stepIndex < currentStepIndex) {
      return {
        status: 'completed',
        date: null,
        notes: null
      };
    } else {
      return {
        status: 'upcoming',
        date: null,
        notes: null
      };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            <User className="w-4 h-4" />
            <span>Application Status</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">Hello, {candidate.name}!</h1>
          <p className="text-gray-600">
            Here's the current status of your application for <strong>{candidate.position}</strong> at <strong>{candidate.company}</strong>
          </p>
        </div>

        {/* Current Status Card */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center space-x-3">
              {currentStep?.icon}
              <div>
                <CardTitle className={`text-xl ${isRejected ? 'text-gray-700' : isHired ? 'text-green-700' : 'text-blue-700'}`}>
                  {currentStep?.label}
                </CardTitle>
                <p className="text-gray-600 mt-1">{currentStep?.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Applied on {formatDate(candidate.appliedDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Last updated {formatDate(candidate.lastUpdate)}</span>
              </div>
            </div>
            
            {candidate.notes && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Latest Update:</strong> {candidate.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Progress Timeline */}
        {!isRejected && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Your Application Journey</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Track your progress through each step of our hiring process
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                <span>Step {Math.min(currentStepIndex + 1, HIRING_STEPS.length)} of {HIRING_STEPS.length}</span>
                <Badge variant="outline" className={isHired ? "border-green-600 text-green-600" : "border-blue-600 text-blue-600"}>
                  {Math.round(((currentStepIndex + 1) / HIRING_STEPS.length) * 100)}% Complete
                </Badge>
              </div>

                             {/* Detailed Timeline */}
               <div className="relative">
                 {/* Continuous Background Progress Bar */}
                 <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200 rounded-full" />
                 
                 {/* Active Progress Bar */}
                 <div 
                   className="absolute left-5 top-5 w-0.5 bg-gradient-to-b from-green-600 via-blue-600 to-blue-600 rounded-full transition-all duration-1000 ease-in-out"
                   style={{
                     height: `${Math.max(0, (currentStepIndex / (HIRING_STEPS.length - 1)) * 100)}%`
                   }}
                 />
                 
                 <div className="space-y-8">
                   {HIRING_STEPS.map((step, index) => {
                     const stepStatus = getStepStatus(step.id, index);
                     
                     return (
                       <div key={step.id} className="flex items-start space-x-4 relative">
                         {/* Step Indicator */}
                         <div className="flex flex-col items-center relative z-10">
                           <div className={`
                             w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-300
                             ${stepStatus.status === 'completed' 
                               ? 'bg-green-600 text-white border-green-600 shadow-green-200' 
                               : stepStatus.status === 'current'
                               ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200 animate-pulse'
                               : 'bg-white text-gray-400 border-gray-300 shadow-gray-100'
                             }
                           `}>
                             {stepStatus.status === 'completed' ? (
                               <CheckCircle className="w-5 h-5" />
                             ) : stepStatus.status === 'current' ? (
                               step.icon
                             ) : (
                               <span className="text-sm font-medium">{index + 1}</span>
                             )}
                           </div>
                         </div>

                      {/* Step Content */}
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-semibold ${
                            stepStatus.status === 'completed' ? 'text-green-800' :
                            stepStatus.status === 'current' ? 'text-blue-800' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </h4>
                          {stepStatus.date && (
                            <Badge variant="outline" className="text-xs">
                              {new Date(stepStatus.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </Badge>
                          )}
                        </div>
                        
                        <p className={`text-sm mb-2 ${
                          stepStatus.status === 'upcoming' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {step.description}
                        </p>
                        
                        <p className={`text-xs ${
                          stepStatus.status === 'upcoming' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {step.details}
                        </p>

                        {stepStatus.notes && (
                          <div className={`mt-3 p-3 rounded-lg text-sm ${
                            stepStatus.status === 'completed' ? 'bg-green-50 border border-green-200 text-green-800' :
                            stepStatus.status === 'current' ? 'bg-blue-50 border border-blue-200 text-blue-800' :
                            'bg-gray-50 border border-gray-200 text-gray-700'
                          }`}>
                            <strong>Note:</strong> {stepStatus.notes}
                          </div>
                        )}

                        {stepStatus.status === 'current' && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center space-x-2 text-yellow-800">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">Currently in progress</span>
                            </div>
                          </div>
                        )}
                      </div>
                                             </div>
                       );
                     })}
                   </div>
                 </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            {isRejected ? (
              <div className="text-center space-y-4 py-6">
                <p className="text-gray-600">
                  Thank you for your time and interest in this position. We encourage you to apply for future opportunities that match your skills and experience.
                </p>
                <Button variant="outline">
                  View Other Positions
                </Button>
              </div>
            ) : isHired ? (
              <div className="text-center space-y-4 py-6">
                <p className="text-green-700 font-medium">
                  🎉 Welcome to the team! Someone from HR will reach out soon with next steps and onboarding information.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  We'll keep you updated as your application progresses. You can bookmark this page to check your status anytime.
                </p>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Recruiter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-8">
          <p>Questions about your application? Contact our HR team at hr@{candidate.company.toLowerCase().replace(/\s+/g, '')}.com</p>
        </div>
      </div>
    </div>
  );
} 
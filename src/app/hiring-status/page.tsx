"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar,
  Mail,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Filter,
  Search,
  ExternalLink
} from "lucide-react";
import { StatusOverview } from "@/components/hiring-status/status-overview";
import { CandidateList } from "@/components/hiring-status/candidate-list";
import { AddCandidateDialog } from "@/components/hiring-status/add-candidate-dialog";

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

interface Company {
  id: string;
  name: string;
  position: string;
  candidates: number;
  status: 'active' | 'paused' | 'completed';
}

export default function HiringStatus() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      status: 'interview',
      appliedDate: '2024-01-15',
      lastUpdate: '2024-01-20',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      notes: 'Strong React skills, available immediately'
    },
    {
      id: '2',
      name: 'Michael Chen',
      position: 'Product Manager',
      company: 'StartupCo',
      status: 'offer',
      appliedDate: '2024-01-10',
      lastUpdate: '2024-01-22',
      email: 'michael.c@email.com',
      phone: '+1 (555) 987-6543',
      notes: '5 years PM experience, excellent cultural fit'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      position: 'Data Scientist',
      company: 'AI Solutions Ltd.',
      status: 'screening',
      appliedDate: '2024-01-18',
      lastUpdate: '2024-01-19',
      email: 'emily.r@email.com',
      phone: '+1 (555) 456-7890',
      notes: 'PhD in Statistics, Python expert'
    }
  ]);

  const [companies] = useState<Company[]>([
    {
      id: '1',
      name: 'TechCorp Inc.',
      position: 'Senior Frontend Developer',
      candidates: 3,
      status: 'active'
    },
    {
      id: '2',
      name: 'StartupCo',
      position: 'Product Manager',
      candidates: 2,
      status: 'active'
    },
    {
      id: '3',
      name: 'AI Solutions Ltd.',
      position: 'Data Scientist',
      candidates: 1,
      status: 'active'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("candidates");

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'screening':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'offer':
        return 'bg-orange-100 text-orange-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Candidate['status']) => {
    switch (status) {
      case 'hired':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'offer':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusStats = () => {
    const stats = candidates.reduce((acc, candidate) => {
      acc[candidate.status] = (acc[candidate.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { label: 'Applied', count: stats.applied || 0, color: 'text-blue-600' },
      { label: 'Screening', count: stats.screening || 0, color: 'text-yellow-600' },
      { label: 'Interview', count: stats.interview || 0, color: 'text-purple-600' },
      { label: 'Offer', count: stats.offer || 0, color: 'text-orange-600' },
      { label: 'Hired', count: stats.hired || 0, color: 'text-green-600' },
      { label: 'Rejected', count: stats.rejected || 0, color: 'text-red-600' }
    ];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          <BarChart3 className="w-4 h-4" />
          <span>Real-time Hiring Dashboard</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Hiring Status Dashboard</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track recruitment progress, manage candidates, and keep all stakeholders updated 
          with real-time status updates and shared access links.
        </p>
      </div>

      {/* Overview Stats */}
      <StatusOverview stats={getStatusStats()} />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </div>
        </div>

        <TabsContent value="candidates" className="space-y-6">
          <CandidateList 
            candidates={candidates} 
            onUpdateStatus={(candidateId, newStatus) => {
              setCandidates(prev => 
                prev.map(c => 
                  c.id === candidateId 
                    ? { ...c, status: newStatus, lastUpdate: new Date().toISOString().split('T')[0] }
                    : c
                )
              );
            }}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <div className="grid gap-6">
            {companies.map((company) => (
              <Card key={company.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <CardDescription>{company.position}</CardDescription>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {company.candidates} candidates
                      </Badge>
                      <div>
                        <Badge 
                          variant={company.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {company.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{company.candidates} active</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Posted 5 days ago</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Share Link
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Notify
                      </Button>
                      <Button size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Candidate Dialog */}
      <AddCandidateDialog 
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={(newCandidate) => {
          setCandidates(prev => [...prev, { 
            ...newCandidate, 
            id: Date.now().toString(),
            appliedDate: new Date().toISOString().split('T')[0],
            lastUpdate: new Date().toISOString().split('T')[0]
          }]);
          setIsAddDialogOpen(false);
        }}
        companies={companies}
      />
    </div>
  );
} 
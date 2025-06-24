"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Target
} from "lucide-react";

interface StatusStat {
  label: string;
  count: number;
  color: string;
}

interface StatusOverviewProps {
  stats: StatusStat[];
}

export function StatusOverview({ stats }: StatusOverviewProps) {
  const totalCandidates = stats.reduce((sum, stat) => sum + stat.count, 0);
  
  // Calculate process stages
  const inProgress = stats
    .filter(stat => !['Hired', 'Not Selected'].includes(stat.label))
    .reduce((sum, stat) => sum + stat.count, 0);
    
  const hired = stats.find(s => s.label === 'Hired')?.count || 0;
  const rejected = stats.find(s => s.label === 'Not Selected')?.count || 0;
  const offers = stats.find(s => s.label === 'Offer Extended')?.count || 0;
  
  // Calculate conversion rate
  const conversionRate = totalCandidates > 0 ? Math.round((hired / totalCandidates) * 100) : 0;
  const offerToHireRate = (hired + offers) > 0 ? Math.round((hired / (hired + offers)) * 100) : 0;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Candidates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCandidates}</div>
          <p className="text-xs text-muted-foreground">
            Active applications
          </p>
        </CardContent>
      </Card>

      {/* In Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{inProgress}</div>
          <p className="text-xs text-muted-foreground">
            Active in pipeline
          </p>
        </CardContent>
      </Card>

      {/* Hired */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hired</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{hired}</div>
          <p className="text-xs text-muted-foreground">
            Successful placements
          </p>
        </CardContent>
      </Card>

      {/* Pending Offers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{offers}</div>
          <p className="text-xs text-muted-foreground">
            Awaiting response
          </p>
        </CardContent>
      </Card>

      {/* Pipeline Health */}
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Pipeline Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Conversion Rate</span>
              <span className="font-medium">{conversionRate}%</span>
            </div>
            <Progress value={conversionRate} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Offer to Hire Rate</span>
              <span className="font-medium">{offerToHireRate}%</span>
            </div>
            <Progress value={offerToHireRate} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-2 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">{inProgress}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{hired}</div>
              <div className="text-xs text-gray-500">Hired</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-600">{rejected}</div>
              <div className="text-xs text-gray-500">Declined</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span>Process Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.filter(stat => stat.count > 0).map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant="outline" 
                    className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                  >
                    {stat.count}
                  </Badge>
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 text-right text-xs text-gray-500">
                    {totalCandidates > 0 ? Math.round((stat.count / totalCandidates) * 100) : 0}%
                  </div>
                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ 
                        width: `${totalCandidates > 0 ? (stat.count / totalCandidates) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
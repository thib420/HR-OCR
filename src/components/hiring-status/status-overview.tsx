"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CheckCircle,
  Clock,
  AlertTriangle
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
  const activeProcesses = stats
    .filter(stat => !['hired', 'rejected'].includes(stat.label.toLowerCase()))
    .reduce((sum, stat) => sum + stat.count, 0);

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
            Across all positions
          </p>
        </CardContent>
      </Card>

      {/* Active Processes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Processes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProcesses}</div>
          <p className="text-xs text-muted-foreground">
            In progress
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
          <div className="text-2xl font-bold text-green-600">
            {stats.find(s => s.label === 'Hired')?.count || 0}
          </div>
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
          <div className="text-2xl font-bold text-orange-600">
            {stats.find(s => s.label === 'Offer')?.count || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Awaiting response
          </p>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-2xl font-bold" style={{ color: stat.color.replace('text-', '') }}>
                  {stat.count}
                </div>
                <Badge variant="outline" className="text-xs">
                  {stat.label}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span>Pipeline Health</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Healthy Flow Rate</span>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
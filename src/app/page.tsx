import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  Search,
  Shield,
  BarChart3,
  Zap
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "CV Anonymizer",
      description: "Remove personal information from CVs to protect candidate privacy while showcasing their skills and experience.",
      icon: FileText,
      href: "/cv-anonymizer",
      color: "bg-blue-500",
      benefits: ["Privacy Protection", "GDPR Compliant", "PDF Processing"],
      status: "Available"
    },
    {
      title: "Hiring Status Dashboard",
      description: "Track the entire recruitment process with real-time updates for candidates and hiring teams.",
      icon: Users,
      href: "/hiring-status",
      color: "bg-green-500",
      benefits: ["Real-time Updates", "Multi-party Access", "Process Tracking"],
      status: "Available"
    },
    {
      title: "Lead Generation",
      description: "Find potential candidates on LinkedIn using natural language queries powered by Exa API.",
      icon: Search,
      href: "/lead-generation",
      color: "bg-purple-500",
      benefits: ["AI-Powered Search", "LinkedIn Integration", "Natural Language"],
      status: "Available"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
          <Zap className="w-4 h-4" />
          <span>Professional HR & Recruitment Platform</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
          Streamline Your
          <span className="text-blue-600"> Recruitment </span>
          Process
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Complete platform for modern HR professionals and headhunters. Anonymize CVs, track hiring progress, and generate leads with AI-powered tools.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/cv-anonymizer">
              <FileText className="w-5 h-5 mr-2" />
              Start Anonymizing CVs
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/hiring-status">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className={`absolute top-0 left-0 right-0 h-1 ${feature.color}`} />
            
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {feature.status}
                </Badge>
              </div>
              
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription className="text-base">
                {feature.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <Button asChild className="w-full" variant="outline">
                <Link href={feature.href}>
                  Get Started
                  <feature.icon className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built for Modern Recruitment
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with user-friendly design to revolutionize how you handle recruitment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600">100%</div>
            <div className="text-sm text-gray-600">Privacy Compliant</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-600">AI-Powered</div>
            <div className="text-sm text-gray-600">Smart Automation</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-purple-600">Real-time</div>
            <div className="text-sm text-gray-600">Live Updates</div>
          </div>
        </div>
      </div>
    </div>
  );
}

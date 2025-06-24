"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles,
  Briefcase,
  GraduationCap,
  Wrench,
  BookOpen,
  Languages,
  UserCheck
} from "lucide-react";

interface AnalysisData {
  summary: string;
  work_experience: Array<{
    job_title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    description: string | string[]; // Can be a single string or an array of strings
  }>;
  education: Array<{
    degree: string;
    field_of_study: string;
    institution: string;
    graduation_year: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  projects: Array<{
    name: string;
    description: string;
  }>;
}

interface PersonalInfo {
  names: { found: string[]; description: string };
  email: { found: string[]; description: string };
  phone: { found: string[]; description: string };
  address: { found: string[]; description: string };
  dates: { found: string[]; description: string };
  linkedin: { found: string[]; description: string };
}

interface AnonymizationOption {
  id: keyof PersonalInfo;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  method: 'remove' | 'replace' | 'hash';
  foundItems: string[];
}

interface AnalysisResultsProps {
  data: AnalysisData;
  personalInfo?: PersonalInfo;
  anonymizationSettings?: AnonymizationOption[];
}

export function AnalysisResults({ data, personalInfo, anonymizationSettings }: AnalysisResultsProps) {
  if (!data) return null;

  // Function to apply anonymization to text
  const applyAnonymization = (text: string | undefined | null): string => {
    // Handle non-string inputs
    if (!text || typeof text !== 'string') {
      return String(text || '');
    }
    
    if (!personalInfo || !anonymizationSettings) return text;
    
    let anonymizedText = text;
    
    anonymizationSettings.forEach(setting => {
      if (setting.enabled && personalInfo) {
        const items = personalInfo[setting.id]?.found || [];
        
        items.forEach(item => {
          // Ensure item is a string
          const itemStr = String(item);
          if (!itemStr) return;
          
          const regex = new RegExp(escapeRegExp(itemStr), 'gi');
          
          switch (setting.method) {
            case 'remove':
              anonymizedText = anonymizedText.replace(regex, '[REDACTED]');
              break;
            case 'replace':
              const replacements: Record<string, string> = {
                names: '[CANDIDATE NAME]',
                email: '[EMAIL ADDRESS]',
                phone: '[PHONE NUMBER]',
                address: '[ADDRESS]',
                dates: '[DATE]',
                linkedin: '[SOCIAL PROFILE]'
              };
              anonymizedText = anonymizedText.replace(regex, replacements[setting.id] || '[REDACTED]');
              break;
            case 'hash':
              const hash = btoa(itemStr).substring(0, 8);
              anonymizedText = anonymizedText.replace(regex, `[HASH:${hash}]`);
              break;
          }
        });
      }
    });
    
    return anonymizedText;
  };

  const escapeRegExp = (string: string): string => {
    // Ensure we have a string to work with
    const str = String(string || '');
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const renderDescription = (description: string | string[] | undefined | null) => {
    let items: string[] = [];
    
    if (Array.isArray(description)) {
      items = description.filter(item => item && typeof item === 'string');
    } else if (description && typeof description === 'string') {
      items = description.split('\n');
    } else if (description) {
      // Convert any other type to string
      items = [String(description)];
    }

    return items
      .filter(item => item && item.trim())
      .map((item, i) => {
        const cleanItem = String(item).replace(/^-/, '').trim();
        return cleanItem ? <li key={i}>{applyAnonymization(cleanItem)}</li> : null;
      })
      .filter(Boolean);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>Gemini AI Analysis</span>
          </div>
          {anonymizationSettings && anonymizationSettings.some(s => s.enabled) && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-600 font-medium">Live Preview</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        {data.summary && (
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span>Candidate Summary</span>
            </h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{applyAnonymization(data.summary)}</p>
          </div>
        )}

        {/* Work Experience */}
        {data.work_experience && data.work_experience.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Work Experience</span>
            </h3>
            <div className="space-y-4">
              {data.work_experience.map((exp, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-200">
                  <p className="font-bold">{applyAnonymization(exp?.job_title)}</p>
                  <p className="text-sm font-medium text-gray-800">{applyAnonymization(exp?.company)} - {applyAnonymization(exp?.location)}</p>
                  <p className="text-xs text-gray-500">{applyAnonymization(exp?.start_date)} - {applyAnonymization(exp?.end_date)}</p>
                  <ul className="mt-2 text-sm list-disc pl-5 space-y-1 text-gray-600">
                    {renderDescription(exp?.description)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center space-x-2">
              <GraduationCap className="w-4 h-4" />
              <span>Education</span>
            </h3>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-200">
                  <p className="font-bold">{applyAnonymization(edu?.degree)} in {applyAnonymization(edu?.field_of_study)}</p>
                  <p className="text-sm text-gray-700">{applyAnonymization(edu?.institution)}</p>
                  <p className="text-xs text-gray-500">Graduated: {applyAnonymization(edu?.graduation_year)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Skills */}
        {data.skills && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center space-x-2">
              <Wrench className="w-4 h-4" />
              <span>Skills</span>
            </h3>
            <div className="space-y-3">
              {data.skills.technical?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.technical.map((skill, i) => <Badge key={i} variant="secondary">{applyAnonymization(skill)}</Badge>)}
                  </div>
                </div>
              )}
              {data.skills.soft?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Soft Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.soft.map((skill, i) => <Badge key={i} variant="outline">{applyAnonymization(skill)}</Badge>)}
                  </div>
                </div>
              )}
              {data.skills.languages?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.languages.map((skill, i) => <Badge key={i} variant="outline" className="border-blue-300 text-blue-800">{applyAnonymization(skill)}</Badge>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Projects</span>
            </h3>
            <div className="space-y-3">
              {data.projects.map((proj, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-200">
                  <p className="font-bold">{applyAnonymization(proj?.name)}</p>
                  <p className="text-sm text-gray-600">{applyAnonymization(proj?.description)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
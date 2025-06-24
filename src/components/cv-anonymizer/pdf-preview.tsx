"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Edit3, 
  Save, 
  RotateCcw,
  Eye,
  Download
} from "lucide-react";

interface StructuredData {
  summary: string;
  work_experience: Array<{
    job_title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    description: string;
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

interface PDFPreviewProps {
  data: StructuredData;
  personalInfo?: PersonalInfo;
  anonymizationSettings?: AnonymizationOption[];
  onDataChange?: (data: StructuredData) => void;
  onDownloadPDF?: (data: StructuredData) => void;
}

export function PDFPreview({ 
  data, 
  personalInfo, 
  anonymizationSettings, 
  onDataChange, 
  onDownloadPDF 
}: PDFPreviewProps) {
  const [editableData, setEditableData] = useState<StructuredData>(data);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<StructuredData>(data);

  // Apply anonymization to text
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

  // Update editable data when anonymization settings change
  useEffect(() => {
    const anonymizedData = {
      ...data,
      summary: applyAnonymization(data.summary),
      work_experience: data.work_experience.map(exp => ({
        ...exp,
        job_title: applyAnonymization(exp.job_title),
        company: applyAnonymization(exp.company),
        location: applyAnonymization(exp.location),
        start_date: applyAnonymization(exp.start_date),
        end_date: applyAnonymization(exp.end_date),
        description: applyAnonymization(exp.description)
      })),
      education: data.education.map(edu => ({
        ...edu,
        degree: applyAnonymization(edu.degree),
        field_of_study: applyAnonymization(edu.field_of_study),
        institution: applyAnonymization(edu.institution),
        graduation_year: applyAnonymization(edu.graduation_year)
      })),
      skills: {
        technical: data.skills.technical.map(skill => applyAnonymization(skill)),
        soft: data.skills.soft.map(skill => applyAnonymization(skill)),
        languages: data.skills.languages.map(skill => applyAnonymization(skill))
      },
      projects: data.projects.map(proj => ({
        ...proj,
        name: applyAnonymization(proj.name),
        description: applyAnonymization(proj.description)
      }))
    };
    
    setEditableData(anonymizedData);
    setOriginalData(anonymizedData);
  }, [data, anonymizationSettings, personalInfo]);

  const handleSave = () => {
    setIsEditing(false);
    if (onDataChange) {
      onDataChange(editableData);
    }
  };

  const handleReset = () => {
    setEditableData(originalData);
    setIsEditing(false);
  };

  const handleDownload = () => {
    if (onDownloadPDF) {
      onDownloadPDF(editableData);
    }
  };

  const updateWorkExperience = (index: number, field: string, value: string) => {
    setEditableData(prev => ({
      ...prev,
      work_experience: prev.work_experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setEditableData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const updateSkills = (category: keyof StructuredData['skills'], value: string) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setEditableData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: skillsArray
      }
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setEditableData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span>PDF Preview & Editor</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Save className="w-4 h-4 mr-1" /> : <Edit3 className="w-4 h-4 mr-1" />}
              {isEditing ? 'Save' : 'Edit'}
            </Button>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            )}
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1" />
              Download PDF
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* PDF-like styling */}
        <div className="bg-white border border-gray-300 shadow-sm p-8 min-h-[800px] max-w-[210mm] mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
          
          {/* Header */}
          <div className="text-center mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Anonymized CV</h1>
            <p className="text-xs text-gray-500">Generated by CV Anonymizer</p>
          </div>

          {/* Summary Section */}
          {editableData.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-700 mb-3 pb-1 border-b border-gray-300">
                CANDIDATE SUMMARY
              </h2>
              {isEditing ? (
                <Textarea
                  value={editableData.summary}
                  onChange={(e) => setEditableData(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full min-h-[80px] text-sm resize-none border-dashed"
                  placeholder="Edit candidate summary..."
                />
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed">{editableData.summary}</p>
              )}
            </div>
          )}

          {/* Work Experience Section */}
          {editableData.work_experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-700 mb-3 pb-1 border-b border-gray-300">
                WORK EXPERIENCE
              </h2>
              <div className="space-y-4">
                {editableData.work_experience.map((exp, index) => (
                  <div key={index} className="pl-4 border-l-2 border-gray-200">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={exp.job_title}
                            onChange={(e) => updateWorkExperience(index, 'job_title', e.target.value)}
                            className="font-bold text-sm border-dashed"
                            placeholder="Job Title"
                          />
                          <Input
                            value={exp.company}
                            onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                            className="font-bold text-sm border-dashed"
                            placeholder="Company"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            value={exp.location}
                            onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                            className="text-xs border-dashed"
                            placeholder="Location"
                          />
                          <Input
                            value={exp.start_date}
                            onChange={(e) => updateWorkExperience(index, 'start_date', e.target.value)}
                            className="text-xs border-dashed"
                            placeholder="Start Date"
                          />
                          <Input
                            value={exp.end_date}
                            onChange={(e) => updateWorkExperience(index, 'end_date', e.target.value)}
                            className="text-xs border-dashed"
                            placeholder="End Date"
                          />
                        </div>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                          className="text-sm min-h-[60px] resize-none border-dashed"
                          placeholder="Job description..."
                        />
                      </div>
                    ) : (
                      <>
                        <p className="font-bold text-sm">{exp.job_title} - {exp.company}</p>
                        <p className="text-xs text-gray-600 mb-1">{exp.location} | {exp.start_date} - {exp.end_date}</p>
                        <p className="text-sm text-gray-700">{exp.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {editableData.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-700 mb-3 pb-1 border-b border-gray-300">
                EDUCATION
              </h2>
              <div className="space-y-3">
                {editableData.education.map((edu, index) => (
                  <div key={index} className="pl-4 border-l-2 border-gray-200">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            className="font-bold text-sm border-dashed"
                            placeholder="Degree"
                          />
                          <Input
                            value={edu.field_of_study}
                            onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                            className="font-bold text-sm border-dashed"
                            placeholder="Field of Study"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                            className="text-sm border-dashed"
                            placeholder="Institution"
                          />
                          <Input
                            value={edu.graduation_year}
                            onChange={(e) => updateEducation(index, 'graduation_year', e.target.value)}
                            className="text-sm border-dashed"
                            placeholder="Graduation Year"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-bold text-sm">{edu.degree} in {edu.field_of_study}</p>
                        <p className="text-sm text-gray-700">{edu.institution}</p>
                        <p className="text-xs text-gray-600">Graduated: {edu.graduation_year}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {editableData.skills && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-700 mb-3 pb-1 border-b border-gray-300">
                SKILLS
              </h2>
              <div className="space-y-3">
                {editableData.skills.technical?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm mb-2">Technical Skills:</h4>
                    {isEditing ? (
                      <Input
                        value={editableData.skills.technical.join(', ')}
                        onChange={(e) => updateSkills('technical', e.target.value)}
                        className="text-sm border-dashed"
                        placeholder="Comma-separated skills..."
                      />
                    ) : (
                      <p className="text-sm text-gray-700">{editableData.skills.technical.join(', ')}</p>
                    )}
                  </div>
                )}
                {editableData.skills.soft?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm mb-2">Soft Skills:</h4>
                    {isEditing ? (
                      <Input
                        value={editableData.skills.soft.join(', ')}
                        onChange={(e) => updateSkills('soft', e.target.value)}
                        className="text-sm border-dashed"
                        placeholder="Comma-separated skills..."
                      />
                    ) : (
                      <p className="text-sm text-gray-700">{editableData.skills.soft.join(', ')}</p>
                    )}
                  </div>
                )}
                {editableData.skills.languages?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm mb-2">Languages:</h4>
                    {isEditing ? (
                      <Input
                        value={editableData.skills.languages.join(', ')}
                        onChange={(e) => updateSkills('languages', e.target.value)}
                        className="text-sm border-dashed"
                        placeholder="Comma-separated languages..."
                      />
                    ) : (
                      <p className="text-sm text-gray-700">{editableData.skills.languages.join(', ')}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {editableData.projects?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-700 mb-3 pb-1 border-b border-gray-300">
                PROJECTS
              </h2>
              <div className="space-y-3">
                {editableData.projects.map((proj, index) => (
                  <div key={index} className="pl-4 border-l-2 border-gray-200">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={proj.name}
                          onChange={(e) => updateProject(index, 'name', e.target.value)}
                          className="font-bold text-sm border-dashed"
                          placeholder="Project Name"
                        />
                        <Textarea
                          value={proj.description}
                          onChange={(e) => updateProject(index, 'description', e.target.value)}
                          className="text-sm min-h-[40px] resize-none border-dashed"
                          placeholder="Project description..."
                        />
                      </div>
                    ) : (
                      <>
                        <p className="font-bold text-sm">{proj.name}</p>
                        <p className="text-sm text-gray-700">{proj.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Edit Mode Instructions */}
        {isEditing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Edit Mode Active</span>
            </div>
            <p className="text-xs text-blue-700">
              Click on any field to edit the content. Changes will be reflected in the downloaded PDF. 
              Use "Save" to apply changes or "Reset" to revert to the original anonymized version.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
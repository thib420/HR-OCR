"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  Download, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { FileUpload } from "@/components/cv-anonymizer/file-upload";
import { AnonymizationSettings } from "@/components/cv-anonymizer/anonymization-settings";
import { AnalysisResults } from "@/components/cv-anonymizer/analysis-results";
import { PDFPreview } from "@/components/cv-anonymizer/pdf-preview";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  description: string;
}

export default function CVAnonymizer() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string>("");
  const [structuredData, setStructuredData] = useState<StructuredData | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [anonymizationSettings, setAnonymizationSettings] = useState<AnonymizationOption[]>([]);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    {
      id: 'upload',
      name: 'File Upload',
      status: 'pending',
      description: 'Upload your CV file'
    },
    {
      id: 'ocr',
      name: 'OCR Processing',
      status: 'pending',
      description: 'Extract text using Mistral OCR'
    },
    {
      id: 'gemini-analysis',
      name: 'Gemini AI Analysis',
      status: 'pending',
      description: 'Structure CV data and identify personal information'
    },
    {
      id: 'anonymization',
      name: 'Anonymization Ready',
      status: 'pending',
      description: 'Configure anonymization settings'
    },
    {
      id: 'generation',
      name: 'PDF Generation',
      status: 'pending',
      description: 'Create anonymized CV'
    }
  ]);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    updateStepStatus('upload', 'completed');
    
    // Start processing
    setIsProcessing(true);
    await processCV(uploadedFile);
  };

  const updateStepStatus = (stepId: string, status: ProcessingStep['status']) => {
    setProcessingSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const processCV = async (file: File) => {
    try {
      // 1. Real OCR processing with Mistral AI
      updateStepStatus('ocr', 'processing');
      setProgress(20);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const ocrResponse = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });
      
      const ocrResult = await ocrResponse.json();
      
      if (!ocrResult.success) {
        throw new Error(ocrResult.error || 'OCR processing failed');
      }
      
      setExtractedText(ocrResult.extracted_text);
      updateStepStatus('ocr', 'completed');
      setProgress(40);

      // 2. Gemini AI Analysis
      updateStepStatus('gemini-analysis', 'processing');
      const analysisResponse = await fetch('/api/cv-anonymizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ocrResult.extracted_text }),
      });

      const analysisResult = await analysisResponse.json();
      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'Gemini analysis failed');
      }
      
      // Show warning if fallback structure was used
      if (analysisResult.warning) {
        console.warn('Gemini analysis warning:', analysisResult.warning);
      }
      
      setStructuredData(analysisResult.data.structured_data);
      setPersonalInfo(analysisResult.data.personal_info);
      updateStepStatus('gemini-analysis', 'completed');
      setProgress(70);

      // 3. Anonymization ready
      updateStepStatus('anonymization', 'completed');
      setProgress(90);

      setIsProcessing(false);
    } catch (error) {
      console.error('Processing failed:', error);
      setIsProcessing(false);
      
      const errorStep = processingSteps.find(s => s.status === 'processing')?.id || 'ocr';
      updateStepStatus(errorStep, 'error');
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Processing failed: ${errorMessage}`);
    }
  };

  const applyAnonymization = (text: string, settings: AnonymizationOption[]): string => {
    let anonymizedText = text;
    
    settings.forEach(setting => {
      if (setting.enabled && personalInfo) {
        const items = personalInfo[setting.id]?.found || [];
        
        items.forEach(item => {
          const regex = new RegExp(escapeRegExp(item), 'gi');
          
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
              const hash = btoa(item).substring(0, 8);
              anonymizedText = anonymizedText.replace(regex, `[HASH:${hash}]`);
              break;
          }
        });
      }
    });
    
    return anonymizedText;
  };

  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const generateAnonymizedPDF = async (customData?: StructuredData) => {
    try {
      const dataToUse = customData || structuredData;
      if (!dataToUse) {
        alert('No structured data available. Please process a CV first.');
        return;
      }

      updateStepStatus('generation', 'processing');
      
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Get fonts
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Add first page
      let currentPage = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
      
      // Set up page dimensions and margins
      const { width, height } = currentPage.getSize();
      const margin = 50;
      const maxWidth = width - 2 * margin;
      const lineHeight = 14;
      const titleHeight = 18;
      const fontSize = 11;
      const sectionFontSize = 13;
      
      let yPosition = height - margin;
      
      // Helper function to add text with wrapping and line break handling
      const addText = (text: string, size: number, font: any, isBold = false) => {
        if (!text) return;
        
        // Sanitize text to remove problematic characters
        const sanitizeText = (str: string): string => {
          return str
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // Remove control characters
            .replace(/[^\x20-\x7E\xA0-\xFF]/g, '?') // Replace non-WinAnsi characters with ?
            .trim();
        };
        
        // Split text by line breaks first, then handle word wrapping
        const lines = text.split(/\r?\n/);
        
        for (const line of lines) {
          const sanitizedLine = sanitizeText(line);
          if (!sanitizedLine) {
            // Empty line - just add spacing
            yPosition -= lineHeight;
            continue;
          }
          
          const words = sanitizedLine.split(' ');
          let currentLine = '';
          
          for (const word of words) {
            const sanitizedWord = sanitizeText(word);
            const testLine = currentLine + (currentLine ? ' ' : '') + sanitizedWord;
            const textWidth = font.widthOfTextAtSize(testLine, size);
            
            if (textWidth > maxWidth && currentLine) {
              // Draw current line and move to next
              currentPage.drawText(currentLine, {
                x: margin,
                y: yPosition,
                size: size,
                font: font,
                color: rgb(0, 0, 0),
              });
              
              yPosition -= lineHeight;
              currentLine = sanitizedWord;
              
              // Check if we need a new page
              if (yPosition < margin + lineHeight) {
                currentPage = pdfDoc.addPage([595.28, 841.89]);
                yPosition = height - margin;
              }
            } else {
              currentLine = testLine;
            }
          }
          
          // Draw the last line of this text line
          if (currentLine) {
            currentPage.drawText(currentLine, {
              x: margin,
              y: yPosition,
              size: size,
              font: font,
              color: rgb(0, 0, 0),
            });
            
            yPosition -= lineHeight;
            
            // Check if we need a new page
            if (yPosition < margin + lineHeight) {
              currentPage = pdfDoc.addPage([595.28, 841.89]);
              yPosition = height - margin;
            }
          }
        }
      };

      // Helper function to sanitize text for PDF
      const sanitizePDFText = (text: string): string => {
        if (!text) return '';
        return text
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // Remove control characters
          .replace(/[^\x20-\x7E\xA0-\xFF]/g, '?') // Replace non-WinAnsi characters with ?
          .replace(/\r?\n/g, ' ') // Replace line breaks with spaces for single-line text
          .trim();
      };

      // Helper function to add section header
      const addSectionHeader = (title: string) => {
        yPosition -= 10; // Extra space before section
        currentPage.drawText(sanitizePDFText(title), {
          x: margin,
          y: yPosition,
          size: sectionFontSize,
          font: helveticaBoldFont,
          color: rgb(0.2, 0.2, 0.2),
        });
        yPosition -= lineHeight + 5;
      };

      // Add title
      currentPage.drawText(sanitizePDFText('Anonymized CV'), {
        x: margin,
        y: yPosition,
        size: titleHeight,
        font: helveticaBoldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      
      yPosition -= titleHeight + 10;
      
      // Add watermark
      currentPage.drawText(sanitizePDFText('Generated by CV Anonymizer'), {
        x: margin,
        y: yPosition,
        size: 10,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      yPosition -= 25;

      // Apply anonymization to structured data (unless using custom data which is already anonymized)
      const anonymizedStructuredData = customData ? dataToUse : {
        ...dataToUse,
        summary: applyAnonymization(dataToUse.summary, anonymizationSettings),
        work_experience: dataToUse.work_experience.map(exp => ({
          ...exp,
          description: applyAnonymization(exp.description, anonymizationSettings)
        })),
        education: dataToUse.education.map(edu => ({
          ...edu,
          degree: applyAnonymization(edu.degree, anonymizationSettings),
          field_of_study: applyAnonymization(edu.field_of_study, anonymizationSettings),
          institution: applyAnonymization(edu.institution, anonymizationSettings),
          graduation_year: applyAnonymization(edu.graduation_year, anonymizationSettings)
        })),
        skills: {
          technical: dataToUse.skills.technical.map(skill => applyAnonymization(skill, anonymizationSettings)),
          soft: dataToUse.skills.soft.map(skill => applyAnonymization(skill, anonymizationSettings)),
          languages: dataToUse.skills.languages.map(skill => applyAnonymization(skill, anonymizationSettings))
        },
        projects: dataToUse.projects.map(proj => ({
          ...proj,
          name: applyAnonymization(proj.name, anonymizationSettings),
          description: applyAnonymization(proj.description, anonymizationSettings)
        }))
      };

      // 1. Candidate Summary
      if (anonymizedStructuredData.summary) {
        addSectionHeader('CANDIDATE SUMMARY');
        addText(anonymizedStructuredData.summary, fontSize, helveticaFont);
        yPosition -= 10;
      }

      // 2. Work Experience
      if (anonymizedStructuredData.work_experience.length > 0) {
        addSectionHeader('WORK EXPERIENCE');
        
        anonymizedStructuredData.work_experience.forEach((exp, index) => {
          // Job title and company
          currentPage.drawText(sanitizePDFText(`${exp.job_title} - ${exp.company}`), {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: helveticaBoldFont,
            color: rgb(0, 0, 0),
          });
          yPosition -= lineHeight;
          
          // Location and dates
          currentPage.drawText(sanitizePDFText(`${exp.location} | ${exp.start_date} - ${exp.end_date}`), {
            x: margin,
            y: yPosition,
            size: fontSize - 1,
            font: helveticaFont,
            color: rgb(0.4, 0.4, 0.4),
          });
          yPosition -= lineHeight + 3;
          
          // Description
          if (exp.description) {
            addText(exp.description, fontSize, helveticaFont);
          }
          
          yPosition -= 8; // Space between jobs
        });
        yPosition -= 5;
      }

      // 3. Education
      if (anonymizedStructuredData.education.length > 0) {
        addSectionHeader('EDUCATION');
        
        anonymizedStructuredData.education.forEach((edu) => {
          // Degree and field
          currentPage.drawText(sanitizePDFText(`${edu.degree} in ${edu.field_of_study}`), {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: helveticaBoldFont,
            color: rgb(0, 0, 0),
          });
          yPosition -= lineHeight;
          
          // Institution and year
          currentPage.drawText(sanitizePDFText(`${edu.institution} | ${edu.graduation_year}`), {
            x: margin,
            y: yPosition,
            size: fontSize - 1,
            font: helveticaFont,
            color: rgb(0.4, 0.4, 0.4),
          });
          yPosition -= lineHeight + 8;
        });
        yPosition -= 5;
      }

      // 4. Skills
      if (anonymizedStructuredData.skills) {
        addSectionHeader('SKILLS');
        
        if (anonymizedStructuredData.skills.technical?.length > 0) {
          currentPage.drawText(sanitizePDFText('Technical Skills:'), {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: helveticaBoldFont,
            color: rgb(0, 0, 0),
          });
          yPosition -= lineHeight;
          addText(anonymizedStructuredData.skills.technical.join(', '), fontSize, helveticaFont);
          yPosition -= 5;
        }
        
        if (anonymizedStructuredData.skills.soft?.length > 0) {
          currentPage.drawText(sanitizePDFText('Soft Skills:'), {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: helveticaBoldFont,
            color: rgb(0, 0, 0),
          });
          yPosition -= lineHeight;
          addText(anonymizedStructuredData.skills.soft.join(', '), fontSize, helveticaFont);
          yPosition -= 5;
        }
        
        if (anonymizedStructuredData.skills.languages?.length > 0) {
          currentPage.drawText(sanitizePDFText('Languages:'), {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: helveticaBoldFont,
            color: rgb(0, 0, 0),
          });
          yPosition -= lineHeight;
          addText(anonymizedStructuredData.skills.languages.join(', '), fontSize, helveticaFont);
        }
        yPosition -= 10;
      }

      // 5. Projects
      if (anonymizedStructuredData.projects?.length > 0) {
        addSectionHeader('PROJECTS');
        
        anonymizedStructuredData.projects.forEach((project) => {
          currentPage.drawText(sanitizePDFText(project.name), {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: helveticaBoldFont,
            color: rgb(0, 0, 0),
          });
          yPosition -= lineHeight;
          
          if (project.description) {
            addText(project.description, fontSize, helveticaFont);
          }
          yPosition -= 8;
        });
      }

      // Add footer with timestamp to the last page
      const footer = `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
      currentPage.drawText(sanitizePDFText(footer), {
        x: margin,
        y: 30,
        size: 8,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      // Serialize the PDF
      const pdfBytes = await pdfDoc.save();
      
      // Create download blob
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `anonymized-cv-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      updateStepStatus('generation', 'completed');
      setProgress(100);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
      updateStepStatus('generation', 'error');
    }
  };

  const downloadAsText = () => {
    try {
      if (!structuredData) {
        alert('No data available. Please process a CV first.');
        return;
      }

      // Create structured text format
      let textContent = 'ANONYMIZED CV\n';
      textContent += '================\n\n';
      
      if (structuredData.summary) {
        textContent += 'CANDIDATE SUMMARY\n';
        textContent += applyAnonymization(structuredData.summary, anonymizationSettings) + '\n\n';
      }
      
      if (structuredData.work_experience.length > 0) {
        textContent += 'WORK EXPERIENCE\n';
        textContent += '===============\n';
        structuredData.work_experience.forEach((exp) => {
          textContent += `${exp.job_title} - ${exp.company}\n`;
          textContent += `${exp.location} | ${exp.start_date} - ${exp.end_date}\n`;
          textContent += applyAnonymization(exp.description, anonymizationSettings) + '\n\n';
        });
      }
      
      // Add other sections...
      
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `anonymized-cv-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Text download failed:', error);
      alert('Failed to download text file. Please try again.');
    }
  };

  const getStepIcon = (status: ProcessingStep['status'], id: string) => {
    if (id === 'gemini-analysis' && status !== 'pending') {
       return <Sparkles className={`w-5 h-5 ${status === 'processing' ? 'animate-spin text-purple-500' : 'text-purple-500'}`} />;
    }
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          <span>Privacy-First CV Processing with AI Analysis</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">CV Anonymizer & Analyzer</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload a CV to extract text with Mistral OCR, analyze with Gemini AI, configure anonymization settings, and download a structured anonymized PDF.
        </p>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload CV</span>
          </CardTitle>
          <CardDescription>
            Upload a PDF file to start the anonymization and analysis process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload onFileUpload={handleFileUpload} />
        </CardContent>
      </Card>

      {/* Main Content - 3 Column Layout */}
      {file && (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Column - Processing Status */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Processing Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-3">
                  {processingSteps.map((step) => (
                    <div key={step.id} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
                      {getStepIcon(step.status, step.id)}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium text-xs truncate">{step.name}</span>
                            <Badge 
                              variant={
                                step.status === 'completed' ? 'default' :
                                step.status === 'processing' ? 'secondary' :
                                step.status === 'error' ? 'destructive' : 'outline'
                              }
                              className="text-xs px-1 py-0 h-4"
                            >
                              {step.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Analysis & PDF Preview */}
          <div className="lg:col-span-2 space-y-6">
            {structuredData && (
              <Tabs defaultValue="analysis" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="analysis" className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Analysis</span>
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>PDF Preview</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="analysis" className="space-y-6 mt-6">
                  <AnalysisResults 
                    data={structuredData} 
                    personalInfo={personalInfo || undefined}
                    anonymizationSettings={anonymizationSettings}
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="space-y-6 mt-6">
                  <PDFPreview 
                    data={structuredData}
                    personalInfo={personalInfo || undefined}
                    anonymizationSettings={anonymizationSettings}
                    onDownloadPDF={(data) => generateAnonymizedPDF(data)}
                  />
                </TabsContent>
              </Tabs>
            )}

            {/* Download Options - Always visible when data is available */}
            {structuredData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Quick Download</span>
                  </CardTitle>
                  <CardDescription>
                    Alternative download options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    onClick={downloadAsText}
                    className="w-full"
                    disabled={!structuredData}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download as Text File
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Simple text format for basic use cases
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Anonymization Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-6">
              <AnonymizationSettings 
                personalInfo={personalInfo || undefined} 
                onSettingsChange={setAnonymizationSettings}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
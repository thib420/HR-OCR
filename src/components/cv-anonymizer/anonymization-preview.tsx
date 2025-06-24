"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface AnonymizationPreviewProps {
  originalText: string;
  anonymizedText: string;
}

export function AnonymizationPreview({ originalText, anonymizedText }: AnonymizationPreviewProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [copiedText, setCopiedText] = useState<string>("");

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const highlightChanges = (original: string, anonymized: string) => {
    // Simple highlighting logic - in a real app, you'd want more sophisticated diff detection
    const changes = [
      { from: /John Smith/g, to: '[CANDIDATE NAME]', type: 'name' },
      { from: /john\.smith@email\.com/g, to: '[EMAIL ADDRESS]', type: 'email' },
      { from: /\+1 \(555\) 123-4567/g, to: '[PHONE NUMBER]', type: 'phone' },
      { from: /linkedin\.com\/in\/johnsmith/g, to: '[LINKEDIN PROFILE]', type: 'linkedin' }
    ];

    let highlighted = anonymized;
    changes.forEach(change => {
      highlighted = highlighted.replace(
        change.to, 
        `<span class="bg-yellow-200 px-1 rounded text-yellow-800 font-medium">${change.to}</span>`
      );
    });

    return highlighted;
  };

  const getAnonymizationStats = () => {
    const patterns = [
      { name: 'Names', count: (originalText.match(/John Smith/g) || []).length },
      { name: 'Email Addresses', count: (originalText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []).length },
      { name: 'Phone Numbers', count: (originalText.match(/\+?[\d\s\(\)-]{10,}/g) || []).length },
      { name: 'LinkedIn Profiles', count: (originalText.match(/linkedin\.com\/in\/\w+/g) || []).length }
    ];

    return patterns.filter(p => p.count > 0);
  };

  const stats = getAnonymizationStats();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Anonymization Results</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {stats.reduce((sum, stat) => sum + stat.count, 0)} items anonymized
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="anonymized" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="anonymized">Anonymized Version</TabsTrigger>
            <TabsTrigger value="comparison">Side-by-Side</TabsTrigger>
          </TabsList>
          
          <TabsContent value="anonymized" className="space-y-4">
            <div className="relative">
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(anonymizedText, 'anonymized')}
                  className="h-8 w-8 p-0"
                >
                  {copiedText === 'anonymized' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div 
                className="bg-gray-50 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: highlightChanges(originalText, anonymizedText) }}
              />
            </div>

            {/* Anonymization Summary */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Anonymized Information:</h4>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-800">{stat.name}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      {stat.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Original (Hidden)</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="h-6 text-xs"
                  >
                    {showOriginal ? (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Show
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-80 overflow-y-auto">
                  {showOriginal ? originalText : (
                    <div className="flex items-center justify-center h-40 text-red-600">
                      <div className="text-center space-y-2">
                        <AlertTriangle className="w-8 h-8 mx-auto" />
                        <p className="text-xs">Original content hidden for privacy</p>
                        <p className="text-xs">Click "Show" to reveal</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Anonymized</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(anonymizedText, 'comparison')}
                    className="h-6 text-xs"
                  >
                    {copiedText === 'comparison' ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                
                <div 
                  className="bg-green-50 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-80 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: highlightChanges(originalText, anonymizedText) }}
                />
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Compare the original CV with the anonymized version. Changes are highlighted for your review.
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Show differences</span>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                <span>Removed</span>
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Added</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 
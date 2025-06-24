"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Key, 
  Eye, 
  EyeOff, 
  Info,
  ExternalLink
} from "lucide-react";

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  isValid: boolean | null;
}

export function ApiKeyInput({ apiKey, onApiKeyChange, isValid }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="w-5 h-5" />
          <span>Mistral AI Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="relative">
            <Input
              id="api-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="Enter your Mistral AI API key"
              className={`pr-10 ${isValid === false ? 'border-red-500' : ''}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription className="text-sm">
            <div className="space-y-2">
              <p>Your API key is used to process PDFs with Mistral AI OCR and is not stored on our servers.</p>
              <div className="flex items-center space-x-1">
                <span>Get your API key from</span>
                <a 
                  href="https://console.mistral.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 inline-flex items-center space-x-1"
                >
                  <span>Mistral AI Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {isValid === false && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800 text-sm">
              Please enter a valid Mistral AI API key to use OCR processing.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 
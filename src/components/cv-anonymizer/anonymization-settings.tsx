"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Shield, 
  Eye, 
  Hash,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  AlertCircle
} from "lucide-react";

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

interface AnonymizationSettingsProps {
  personalInfo?: PersonalInfo;
  onSettingsChange?: (settings: AnonymizationOption[]) => void;
}

export function AnonymizationSettings({ personalInfo, onSettingsChange }: AnonymizationSettingsProps) {
  const [options, setOptions] = useState<AnonymizationOption[]>([
    {
      id: 'names',
      label: 'Personal Names',
      description: 'First and last names',
      icon: User,
      enabled: true,
      method: 'replace',
      foundItems: []
    },
    {
      id: 'email',
      label: 'Email Addresses',
      description: 'All email addresses',
      icon: Mail,
      enabled: true,
      method: 'replace',
      foundItems: []
    },
    {
      id: 'phone',
      label: 'Phone Numbers',
      description: 'Mobile and landline numbers',
      icon: Phone,
      enabled: true,
      method: 'replace',
      foundItems: []
    },
    {
      id: 'address',
      label: 'Addresses',
      description: 'Home and work addresses',
      icon: MapPin,
      enabled: true,
      method: 'remove',
      foundItems: []
    },
    {
      id: 'dates',
      label: 'Birth Dates',
      description: 'Date of birth and age',
      icon: Calendar,
      enabled: false,
      method: 'remove',
      foundItems: []
    },
    {
      id: 'linkedin',
      label: 'Social Profiles',
      description: 'LinkedIn, GitHub, etc.',
      icon: Briefcase,
      enabled: true,
      method: 'replace',
      foundItems: []
    }
  ]);

  const [preserveFormat, setPreserveFormat] = useState(true);
  const [includeWatermark, setIncludeWatermark] = useState(true);

  // Update options when personal info is provided
  useEffect(() => {
    if (personalInfo) {
      setOptions(prev => 
        prev.map(option => ({
          ...option,
          foundItems: personalInfo[option.id]?.found || [],
          enabled: (personalInfo[option.id]?.found || []).length > 0 ? option.enabled : false
        }))
      );
    }
  }, [personalInfo]);

  // Notify parent component when settings change
  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange(options);
    }
  }, [options, onSettingsChange]);

  const toggleOption = (id: keyof PersonalInfo) => {
    setOptions(prev => 
      prev.map(option => 
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
  };

  const updateMethod = (id: keyof PersonalInfo, method: AnonymizationOption['method']) => {
    setOptions(prev => 
      prev.map(option => 
        option.id === id ? { ...option, method } : option
      )
    );
  };

  const getMethodIcon = (method: AnonymizationOption['method']) => {
    switch (method) {
      case 'remove':
        return <Eye className="w-3 h-3" />;
      case 'replace':
        return <Shield className="w-3 h-3" />;
      case 'hash':
        return <Hash className="w-3 h-3" />;
    }
  };

  const getMethodColor = (method: AnonymizationOption['method']) => {
    switch (method) {
      case 'remove':
        return 'bg-red-100 text-red-800';
      case 'replace':
        return 'bg-blue-100 text-blue-800';
      case 'hash':
        return 'bg-purple-100 text-purple-800';
    }
  };

  const resetToDefaults = () => {
    setOptions(prev => 
      prev.map(option => ({
        ...option,
        enabled: option.foundItems.length > 0 && ['names', 'email', 'phone', 'address', 'linkedin'].includes(option.id),
        method: option.id === 'address' || option.id === 'dates' ? 'remove' : 'replace'
      }))
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Anonymization Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!personalInfo && (
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Upload and analyze a CV to see detected personal information</span>
          </div>
        )}

        {/* Personal Information Options */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Personal Information</h4>
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={option.enabled}
                      onCheckedChange={() => toggleOption(option.id)}
                      className="scale-75"
                      disabled={option.foundItems.length === 0}
                    />
                    <div className="flex items-center space-x-2">
                      <option.icon className="w-4 h-4 text-gray-600" />
                      <div>
                        <Label className="text-sm font-medium">{option.label}</Label>
                        <p className="text-xs text-gray-500">
                          {option.description}
                          {option.foundItems.length > 0 && (
                            <span className="ml-1 text-blue-600">
                              ({option.foundItems.length} found)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {option.enabled && option.foundItems.length > 0 && (
                    <Select
                      value={option.method}
                      onValueChange={(value: AnonymizationOption['method']) => 
                        updateMethod(option.id, value)
                      }
                    >
                      <SelectTrigger className="w-24 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="replace">
                          <div className="flex items-center space-x-1">
                            <Shield className="w-3 h-3" />
                            <span>Replace</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="remove">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>Remove</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="hash">
                          <div className="flex items-center space-x-1">
                            <Hash className="w-3 h-3" />
                            <span>Hash</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                {option.enabled && option.foundItems.length > 0 && (
                  <div className="ml-10 space-y-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getMethodColor(option.method)}`}
                    >
                      {getMethodIcon(option.method)}
                      <span className="ml-1 capitalize">{option.method}</span>
                    </Badge>
                    
                    {/* Show found items */}
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">Found items:</p>
                      <div className="flex flex-wrap gap-1">
                        {option.foundItems.slice(0, 3).map((item, i) => (
                          <Badge key={i} variant="outline" className="text-xs max-w-[150px] truncate">
                            {item}
                          </Badge>
                        ))}
                        {option.foundItems.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{option.foundItems.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Format Options */}
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium text-sm">Output Options</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Preserve Formatting</Label>
                <p className="text-xs text-gray-500">Keep original layout and styling</p>
              </div>
              <Switch
                checked={preserveFormat}
                onCheckedChange={setPreserveFormat}
                className="scale-75"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Add Watermark</Label>
                <p className="text-xs text-gray-500">Mark document as anonymized</p>
              </div>
              <Switch
                checked={includeWatermark}
                onCheckedChange={setIncludeWatermark}
                className="scale-75"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-medium text-sm">Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Enabled protections:</span>
              <span className="font-medium">{options.filter(o => o.enabled).length}/{options.filter(o => o.foundItems.length > 0).length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Security level:</span>
              <Badge variant="secondary" className="text-xs">
                {options.filter(o => o.enabled).length >= 4 ? 'High' : 
                 options.filter(o => o.enabled).length >= 2 ? 'Medium' : 'Low'}
              </Badge>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
} 
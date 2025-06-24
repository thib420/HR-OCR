"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, X, AlertCircle, CheckCircle } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setUploadError("");
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setUploadError("File is too large. Maximum size is 10MB.");
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setUploadError("Only PDF files are allowed.");
      } else {
        setUploadError("Invalid file. Please upload a PDF file.");
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const removeFile = () => {
    setUploadedFile(null);
    setUploadError("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploadedFile) {
    return (
      <div className="border rounded-lg p-6 bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-sm text-green-900">{uploadedFile.name}</p>
              <p className="text-xs text-green-600">{formatFileSize(uploadedFile.size)}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-green-600 hover:text-green-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
            <Upload className="w-6 h-6 text-gray-600" />
          </div>
          
          {isDragActive ? (
            <div>
              <p className="text-blue-600 font-medium">Drop your CV here</p>
              <p className="text-sm text-blue-500">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 font-medium">Drag & drop your CV here</p>
              <p className="text-sm text-gray-500">or click to browse files</p>
            </div>
          )}

          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <FileText className="w-3 h-3" />
              <span>PDF only</span>
            </div>
            <div>Max 10MB</div>
          </div>
        </div>
      </div>

      {uploadError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {uploadError}
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
            input?.click();
          }}
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose File
        </Button>
      </div>
    </div>
  );
} 
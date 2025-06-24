import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded' 
      }, { status: 400 });
    }

    // Get API key from environment variables
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mistral API key not configured on server' 
      }, { status: 500 });
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Only PDF files are allowed' 
      }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save the uploaded file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `cv_${timestamp}.pdf`;
    const filepath = join(uploadsDir, filename);
    
    await writeFile(filepath, buffer);

    try {
      // Call the Python OCR script using the virtual environment
      const scriptPath = join(process.cwd(), 'scripts', 'mistral_ocr.py');
      const venvPython = join(process.cwd(), 'venv', 'bin', 'python');
      const command = `"${venvPython}" "${scriptPath}" "${filepath}" "${apiKey}"`;
      
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr) {
        console.error('Python script stderr:', stderr);
        // Don't return error for stderr as it might just be warnings
      }

      // Parse the JSON response from Python script
      const result = JSON.parse(stdout);
      
      // Clean up the uploaded file
      await unlink(filepath);
      
      return NextResponse.json(result);
      
    } catch (error) {
      // Clean up the uploaded file in case of error
      try {
        await unlink(filepath);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
      
      console.error('OCR processing error:', error);
      return NextResponse.json({ 
        success: false, 
        error: `OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'OK', 
    message: 'OCR API endpoint is running' 
  });
} 
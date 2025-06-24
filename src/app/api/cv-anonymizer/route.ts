import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ success: false, error: 'No text provided' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: 'Gemini API key not configured on server' }, { status: 500 });
    }

    console.log('Starting Gemini analysis...');

    const prompt = `
      You are an expert HR assistant. Analyze the following CV text and extract two types of information:
      
      1. STRUCTURED CV DATA: Organize the professional information into a clear structure
      2. PERSONAL INFORMATION: Identify personal/sensitive data that could be anonymized
      
      Here is the CV text:
      ---
      ${text.substring(0, 3000)}${text.length > 3000 ? '...' : ''}
      ---
      
      IMPORTANT: Respond ONLY with valid JSON. Do not include any markdown formatting, explanations, or text outside the JSON object.

      {
        "structured_data": {
          "summary": "A brief, 2-3 sentence summary of the candidate's profile.",
          "work_experience": [
            {
              "job_title": "Job Title",
              "company": "Company Name",
              "location": "Location (if available)",
              "start_date": "Start Date (e.g., YYYY-MM)",
              "end_date": "End Date (or 'Present')",
              "description": "A bulleted list of key responsibilities and achievements."
            }
          ],
          "education": [
            {
              "degree": "Degree (e.g., Bachelor of Science)",
              "field_of_study": "Field of Study (e.g., Computer Science)",
              "institution": "Institution Name",
              "graduation_year": "Year of Graduation"
            }
          ],
          "skills": {
            "technical": ["Skill 1", "Skill 2"],
            "soft": ["Skill 1", "Skill 2"],
            "languages": ["Language 1", "Language 2"]
          },
          "projects": [
            {
              "name": "Project Name",
              "description": "A brief description of the project and the technologies used."
            }
          ]
        },
        "personal_info": {
          "names": {
            "found": ["John Doe", "Jane Smith"],
            "description": "Personal names found in the CV"
          },
          "email": {
            "found": ["john@email.com", "jane.smith@company.com"],
            "description": "Email addresses found in the CV"
          },
          "phone": {
            "found": ["+1 234 567 8900", "(555) 123-4567"],
            "description": "Phone numbers found in the CV"
          },
          "address": {
            "found": ["123 Main St, City, State", "456 Work Ave"],
            "description": "Physical addresses found in the CV"
          },
          "dates": {
            "found": ["1990-01-15", "January 15, 1990"],
            "description": "Birth dates or personal dates found in the CV"
          },
          "linkedin": {
            "found": ["linkedin.com/in/johndoe", "github.com/janesmith"],
            "description": "Social media profiles and URLs found in the CV"
          }
        }
      }
    `;

    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Check if the response is blocked or has an error
    if (response.candidates && response.candidates[0].finishReason === 'SAFETY') {
      console.error('Gemini response blocked by safety filters');
      return NextResponse.json({ 
        success: false, 
        error: 'Content was blocked by safety filters. Please try with different content.' 
      }, { status: 400 });
    }

    const responseText = response.text();
    console.log('Received response from Gemini:', responseText.substring(0, 200) + '...');
    
    // Check if response looks like an error message
    if (responseText.startsWith('Internal') || responseText.includes('Error') || responseText.includes('error')) {
      console.error('Gemini returned an error:', responseText);
      return NextResponse.json({ 
        success: false, 
        error: 'Gemini API returned an error. Please try again.' 
      }, { status: 500 });
    }

    // Clean the response to ensure it's valid JSON
    let jsonString = responseText.trim();
    
    // Remove markdown code blocks if present (more robust patterns)
    jsonString = jsonString.replace(/```json[\s\n]*/gi, '').replace(/```[\s\n]*/g, '');
    
    // Remove any leading/trailing text that's not part of the JSON
    const jsonStart = jsonString.indexOf('{');
    const jsonEnd = jsonString.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      console.error('No valid JSON found in response:', responseText);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid response format from AI. Please try again.',
        rawResponse: responseText 
      }, { status: 500 });
    }
    
    jsonString = jsonString.substring(jsonStart, jsonEnd);
    console.log('Cleaned JSON string:', jsonString.substring(0, 200) + '...');

    try {
      const analysisResult = JSON.parse(jsonString);
      
      // Validate the structure
      if (!analysisResult.structured_data || !analysisResult.personal_info) {
        console.error('Invalid response structure:', analysisResult);
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid response structure from AI. Please try again.' 
        }, { status: 500 });
      }
      
      console.log('Successfully parsed Gemini response');
      return NextResponse.json({ success: true, data: analysisResult });
      
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      console.error('Raw Gemini response:', responseText);
      console.error('Cleaned JSON string:', jsonString);
      
      // Return a fallback structure
      const fallbackResult = {
        structured_data: {
          summary: "Unable to parse CV structure automatically. Please review the original content.",
          work_experience: [],
          education: [],
          skills: { technical: [], soft: [], languages: [] },
          projects: []
        },
        personal_info: {
          names: { found: [], description: "Personal names found in the CV" },
          email: { found: [], description: "Email addresses found in the CV" },
          phone: { found: [], description: "Phone numbers found in the CV" },
          address: { found: [], description: "Physical addresses found in the CV" },
          dates: { found: [], description: "Birth dates or personal dates found in the CV" },
          linkedin: { found: [], description: "Social media profiles and URLs found in the CV" }
        }
      };
      
      return NextResponse.json({ 
        success: true, 
        data: fallbackResult,
        warning: 'Used fallback structure due to parsing error'
      });
    }

  } catch (error) {
    console.error('Gemini analysis error:', error);
    
    // Check if it's a quota or API key error
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid API key. Please check your Gemini API configuration.' 
        }, { status: 401 });
      }
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json({ 
          success: false, 
          error: 'API quota exceeded. Please try again later.' 
        }, { status: 429 });
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Gemini analysis failed. Please try again.' 
    }, { status: 500 });
  }
} 
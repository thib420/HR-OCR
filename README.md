# HR & Headhunter Platform

A comprehensive web application built with Next.js, TypeScript, and shadcn/ui components for HR professionals and headhunters.

## Features

### 🔒 CV Anonymizer & Analyzer
- **File Upload**: Support for PDF files with drag & drop interface
- **Mistral OCR Integration**: Real text extraction using Mistral AI OCR
- **Gemini AI Analysis**: Structured CV data extraction and personal information detection
- **Live Anonymization Preview**: Real-time preview of anonymization changes
- **📄 PDF Preview & Editor**: See exactly how the document will look and make real-time edits
- **Flexible Anonymization**: Remove, replace, or hash personal information
- **Professional PDF Export**: Download structured, anonymized CVs
- **Multiple Export Formats**: PDF and text file downloads

#### New PDF Preview & Editor Features:
- **Visual PDF Preview**: See the document exactly as it will appear in the final PDF
- **Real-time Editing**: Click "Edit" to modify any field directly in the preview
- **Live Anonymization**: Changes to anonymization settings are reflected instantly
- **Professional Layout**: A4 format with proper fonts, margins, and styling
- **Section-based Structure**: Organized sections for Summary, Work Experience, Education, Skills, and Projects
- **Download Integration**: One-click PDF generation from the edited preview

### 📊 Hiring Status Dashboard
- **Candidate Pipeline**: Track candidates through hiring stages
- **Status Management**: Applied → Screening → Interview → Offer → Hired/Rejected
- **Company Overview**: Statistics and candidate distribution
- **Interactive Management**: Add, edit, and update candidate information

### 🔍 Lead Generation
- **Natural Language Search**: Find LinkedIn profiles using conversational queries
- **Advanced Filters**: Filter by role, location, experience, and skills
- **Profile Cards**: Detailed candidate information display
- **Saved Searches**: Store and manage frequent search queries

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **PDF Processing**: pdf-lib for PDF generation and manipulation
- **AI Integration**: Mistral AI for OCR, Google Gemini for analysis
- **File Handling**: react-dropzone for file uploads
- **Development**: ESLint, PostCSS

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ (for OCR processing)
- Environment variables:
  - `MISTRAL_API_KEY`: Your Mistral AI API key
  - `GEMINI_API_KEY`: Your Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-headhunter-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Visit [http://localhost:3000](http://localhost:3000)

## Usage

### CV Anonymization Workflow

1. **Upload**: Drag and drop a PDF CV file
2. **Processing**: 
   - Mistral OCR extracts text from the PDF
   - Gemini AI analyzes and structures the content
   - Personal information is automatically detected
3. **Configure**: Choose which personal information to anonymize and how
4. **Preview & Edit**: 
   - Switch to "PDF Preview" tab to see the final document
   - Click "Edit" to modify any field directly in the preview
   - See live updates as you change anonymization settings
5. **Download**: Generate and download the anonymized PDF

### Key Features of PDF Preview:

- **Edit Mode**: Toggle editing to modify any field
- **Reset Function**: Revert changes to original anonymized version
- **Real-time Updates**: Anonymization changes apply instantly
- **Professional Formatting**: Consistent with final PDF output
- **Section Organization**: Clear headers and structured layout

## API Endpoints

- `POST /api/ocr` - Process PDF files with Mistral OCR
- `POST /api/cv-anonymizer` - Analyze text with Gemini AI

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── cv-anonymizer/     # CV anonymizer page
│   ├── hiring-status/     # Hiring dashboard page
│   └── lead-generation/   # Lead generation page
├── components/            # React components
│   ├── cv-anonymizer/     # CV anonymizer components
│   │   ├── pdf-preview.tsx    # PDF preview & editor component
│   │   ├── analysis-results.tsx
│   │   ├── anonymization-settings.tsx
│   │   └── file-upload.tsx
│   ├── hiring-status/     # Hiring dashboard components
│   ├── lead-generation/   # Lead generation components
│   └── ui/               # shadcn/ui components
└── lib/                  # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

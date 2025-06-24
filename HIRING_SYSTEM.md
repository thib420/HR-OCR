# Hiring Progress Tracking System

## Overview

This system provides a simple yet effective way to track candidates through the hiring process with role-based access for different stakeholders.

## User Roles

### 1. Headhunter/Recruiter
- **Access**: Full dashboard at `/hiring-status`
- **Capabilities**:
  - Add new candidates
  - Update candidate status through any hiring step
  - Generate shareable links for candidates
  - View analytics and pipeline metrics
  - Manage multiple positions and companies

### 2. Company/Hiring Manager
- **Access**: Dashboard at `/hiring-status` (same as headhunter)
- **Capabilities**:
  - Update candidate status for their positions
  - View progress of all candidates
  - Access to analytics and metrics

### 3. Candidate
- **Access**: Read-only view at `/candidate-status` via shareable link
- **Capabilities**:
  - View their own application progress
  - See current step in hiring process
  - View progress timeline with completed/upcoming steps
  - Access contact information for next steps

## Hiring Process Steps

The system tracks candidates through these standardized steps:

1. **Application Received** - Initial application submitted
2. **HR Screening** - Human resources initial review
3. **Technical Assessment** - Skills evaluation/test
4. **Manager Interview** - Interview with hiring manager
5. **Final Interview** - Senior leadership interview
6. **Offer Extended** - Job offer made to candidate
7. **Hired** - Candidate accepted and hired
8. **Not Selected** - Alternative path for rejected candidates

## Key Features

### For Recruiters/Companies:
- **Progress Tracking**: Visual progress bars showing candidate advancement
- **Status Management**: Easy dropdown to update candidate status
- **Analytics Dashboard**: Conversion rates, pipeline health, process breakdown
- **Shareable Links**: Generate secure links for candidates to track their progress
- **Contact Management**: Store candidate contact information and notes

### For Candidates:
- **Progress Visualization**: Clear timeline showing completed and upcoming steps
- **Step Descriptions**: Detailed explanations of what each step involves
- **Status Updates**: Latest updates and next steps information
- **Mobile Responsive**: Optimized for viewing on any device
- **Contact Options**: Easy access to recruiter contact information

## Technical Implementation

### Pages Structure:
- `/hiring-status` - Main dashboard for recruiters/companies
- `/candidate-status` - Candidate-only progress view

### Components:
- `StatusOverview` - Analytics and metrics dashboard
- `AddCandidateDialog` - Form to add new candidates
- `CandidateStatus` - Individual candidate progress view

### Data Structure:
```typescript
interface Candidate {
  id: string;
  name: string;
  position: string;
  company: string;
  currentStep: string; // One of the hiring step IDs
  email: string;
  phone: string;
  notes: string;
  appliedDate: string;
  lastUpdate: string;
  shareableLink: string; // Unique URL for candidate access
}
```

## Usage Workflow

1. **Recruiter adds candidate** to system with initial details
2. **System generates shareable link** for candidate
3. **Candidate receives link** to track their progress
4. **Recruiter/Company updates status** as candidate progresses
5. **Candidate sees real-time updates** on their personal tracking page
6. **System provides analytics** on hiring pipeline performance

## Benefits

- **Transparency**: Candidates always know where they stand
- **Efficiency**: Streamlined status updates and communication
- **Analytics**: Data-driven insights into hiring process
- **Professional Experience**: Modern, clean interface for all users
- **Accessibility**: Simple URLs that work on any device

## Future Enhancements

- Email notifications on status changes
- Calendar integration for interview scheduling
- Document upload and sharing
- Advanced analytics and reporting
- Integration with ATS systems
- Multi-language support 
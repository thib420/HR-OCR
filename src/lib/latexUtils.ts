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

const escapeLatex = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
};

export const generateLatexCv = (cvData: StructuredData): string => {
  const renderWorkExperience = () =>
    cvData.work_experience
      .map(
        (exp) => `
\\subsection*{${escapeLatex(exp.job_title)}}
\\textit{${escapeLatex(exp.company)}, ${escapeLatex(exp.location)}} \\\\
\\textit{${escapeLatex(exp.start_date)} -- ${escapeLatex(exp.end_date)}}
\\begin{itemize}
    ${(exp.description || '')
      .split('\n')
      .map((item) => `\\item ${escapeLatex(item)}`)
      .join('\n    ')}
\\end{itemize}
`
      )
      .join('');

  const renderEducation = () =>
    cvData.education
      .map(
        (edu) => `
\\subsection*{${escapeLatex(edu.degree)} in ${escapeLatex(edu.field_of_study)}}
\\textit{${escapeLatex(edu.institution)}} \\\\
Graduated: ${escapeLatex(edu.graduation_year)}
`
      )
      .join('');

  const renderSkills = () => {
    const { technical, soft, languages } = cvData.skills;
    return `
${technical?.length > 0 ? `\\textbf{Technical Skills:} ${escapeLatex(technical.join(', '))}\\\\` : ''}
${soft?.length > 0 ? `\\textbf{Soft Skills:} ${escapeLatex(soft.join(', '))}\\\\` : ''}
${languages?.length > 0 ? `\\textbf{Languages:} ${escapeLatex(languages.join(', '))}` : ''}
    `;
  };

  const renderProjects = () =>
    cvData.projects
      .map(
        (proj) => `
\\subsection*{${escapeLatex(proj.name)}}
${escapeLatex(proj.description)}
`
      )
      .join('');

  return `
\\documentclass[a4paper,11pt]{article}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{parskip}
\\usepackage{enumitem}
\\setlist{nolistsep}
\\usepackage[T1]{fontenc}

\\begin{document}

\\begin{center}
    {\\Huge \\bfseries Anonymized CV}
    \\vspace{0.5cm}
\\end{center}

\\section*{Candidate Summary}
${escapeLatex(cvData.summary)}

\\section*{Work Experience}
${renderWorkExperience()}

\\section*{Education}
${renderEducation()}

\\section*{Skills}
${renderSkills()}

${cvData.projects?.length > 0 ? `\\section*{Projects}\n${renderProjects()}` : ''}

\\end{document}
  `;
}; 
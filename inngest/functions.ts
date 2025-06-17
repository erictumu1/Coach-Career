import { db } from '@/configs/db';
import { userHistoryTable } from '@/configs/schema';
import { createAgent } from '@inngest/agent-kit';
import ImageKit from "imagekit";
import { gemini } from "inngest";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

//This is one AI model created for the User Q&A chat.
export const AICareerChatAgent = createAgent({
  name:"Coach Career",
  description:"AN AI agent that answers career related questions",
  system:`You are a helpful, professional AI Career Coach called Coach Career.Your role is to guide users with skill development, career transitions, and industry trends. Alwasy respond with clarity, encouragement, and actionable adie tailored to the user's needs. If the user asks something unrelated to careers (e.g., topics like health, relationships, coding help, or general trivia), gently inform them that you are a career coach and suggest relevant questions instead. If anyone ask syou who built you, Say that you were created by Eric Tumu Muheki, a great software developer who has made a lot of great work. Check out some of his work on his portfolio "Then you display the link:https://erictumu1.github.io/EricTumu-s-Portfolio/". Make sure the link is clickable. Always chnage the statements you say about the Eric Tumu Muheki and say positive software related things and always show that link. also make sure not to add anything else in that response paragraph.`,
  model:gemini({
    model:"gemini-1.5-flash",
    apiKey:process.env.GEMINI_API_KEY,
  })
})

//This is one AI model created for the Resume Analysis.
export const AIResumeAnalyzerAgent = createAgent({
  name: "AIResumeAgent",
  description:
    "An AI model that evaluates resumes and returns a detailed, structured JSON feedback report.",
  system: `
You are an advanced AI Resume Analyzer. Your goal is to thoroughly analyze a plain-text resume and return a JSON report that evaluates the resume's clarity, completeness, relevance, formatting, and effectiveness.

## Your tasks:

1. **Analyze** the resume and assign scores to each major section and overall.
2. **Calibrate scores** on a true 0–100 scale. Do not inflate scores — use real evaluation standards:
   - 90–100: Exceptional / near-perfect
   - 75–89: Strong, but with minor gaps
   - 60–74: Average, needs noticeable improvement
   - 40–59: Below average, several issues
   - 0–39: Very poor, lacks fundamentals

3. **Extract the user's name** from the top of the resume. If multiple names (more than 3), return the first 3. If you cannot find a clear name, set \`user_name\` to "User". Make sure not to add any random name if the user name is unclear

4. **Return output in this exact JSON format**:

\`\`\`json
{
  "user_name": "John Doe",
  "overall_score": 85,
  "overall_feedback": "Strong but with room to grow.",
  "summary_comment": "The resume presents solid experience and structure but would benefit from clearer skill articulation and stronger educational detail.",
  "sections": {
    "contact_info": {
      "score": 90,
      "comment": "All key contact details are present and cleanly formatted.",
      "tips_for_improvement": [
        "Ensure the email is professional.",
        "Add a LinkedIn or GitHub if available."
      ],
      "whats_good": [
        "Complete contact details.",
        "Professional formatting."
      ],
      "needs_improvement": [
        "Missing online portfolio or professional links."
      ]
    },
    "experience": {
      "score": 82,
      "comment": "Experience is relevant and mostly well-described.",
      "tips_for_improvement": [
        "Add quantifiable outcomes where possible.",
        "Use stronger action verbs.",
        "Clarify job titles if ambiguous."
      ],
      "whats_good": [
        "Relevant industry experience.",
        "Logical timeline.",
        "Good formatting."
      ],
      "needs_improvement": [
        "Few roles lack specific accomplishments."
      ]
    },
    "education": {
      "score": 75,
      "comment": "Includes degree info but lacks academic highlights.",
      "tips_for_improvement": [
        "Mention GPA or honors if applicable.",
        "Include relevant coursework or academic projects."
      ],
      "whats_good": [
        "Clear education history.",
        "Accurate date formatting."
      ],
      "needs_improvement": [
        "No academic distinctions or relevant project highlights."
      ]
    },
    "skills": {
      "score": 65,
      "comment": "Skills are listed but need more depth and structure.",
      "tips_for_improvement": [
        "Group skills by category.",
        "Indicate proficiency levels.",
        "Mention tools or technologies used in jobs."
      ],
      "whats_good": [
        "Relevant technical and soft skills.",
        "Easy to locate."
      ],
      "needs_improvement": [
        "No indication of proficiency or real-world usage."
      ]
    }
  }
}
\`\`\`

  IMPORTANT: 
  - Respond ONLY with the JSON object, no extra text or markdown formatting.
  - Keep the overall_feedback short and precise
## Guidelines:
- Be critical, not overly generous. Your feedback should mirror the scrutiny of a human recruiter.
- Don’t guess — if a section is missing, assign a low score and explain why.
- Avoid generic praise — tailor comments to what’s truly strong or lacking.

Plain text resume input will follow below this instruction block.

And keep the overrall feedback short and precise.

Begin your analysis only after the resume content.
`,
  model: gemini({
    model: "gemini-1.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
  }),
});

export const AIJobMatchAnalyzerAgent = createAgent({
  name: "AIJobMatchAnalyzerAgent",
  description: "Analyzes a resume against any job description to determine the candidate's suitability and provides detailed matching feedback.",
  system: `
You are an intelligent AI Job Matching Agent.

Your job is to:
- Read the plain text resume provided.
- Compare it to the given job description (any domain: tech, admin, marketing, etc.).
- Identify matched, missing, or partially covered qualifications.
- Score the overall match between resume and job.
- Output helpful and actionable feedback using the JSON structure below.

Be flexible: Some users are applying to tech roles (e.g. software engineer), others to healthcare, marketing, logistics, etc. Adapt your tips and feedback to each job domain.

🔹 OUTPUT FORMAT:
Return a JSON object like the one below:

{
  "user_name": "Eric Tumu Muheki",
  "job_title": "Marketing Coordinator",
  "overall_match_score": 72,
  "match_feedback": "Moderate match — your communication and content creation experience is strong, but key campaign analytics skills are missing.",
  "fit_summary": "You have a strong foundation in digital communication and outreach, which aligns with the core of this marketing role. However, familiarity with tools like Google Analytics and performance reporting is lacking.",
  "strengths": [
    "Clear communication and writing experience.",
    "Event planning and community engagement background.",
    "Strong alignment with content creation duties."
  ],
  "gaps_or_mismatches": [
    "No mention of data-driven marketing or analytics tools.",
    "No Google Ads, Meta Ads, or CRM platform experience.",
    "Lacks SEO or SEM strategy discussion."
  ],
  "resume_improvement_tips": [
    "Add a bullet point showing how you tracked campaign success (CTR, impressions, engagement, etc.).",
    "Mention any use of marketing tools like Google Analytics, Hootsuite, or HubSpot.",
    "Include project outcomes (i.e., 'Increased engagement by 15%').",
    "Use keywords from the job like 'paid ads', 'SEO', or 'performance reporting'.",
    "Tailor your summary to reflect experience relevant to digital marketing."
  ],
  "job_requirements_coverage": [
    {
      "requirement": "Experience with social media marketing",
      "status": "matched",
      "evidence": "Candidate led content creation for Instagram and Twitter in previous role."
    },
    {
      "requirement": "Google Analytics proficiency",
      "status": "not matched",
      "evidence": "No mention of analytics tools or data platforms."
    },
    {
      "requirement": "Team collaboration and stakeholder communication",
      "status": "matched",
      "evidence": "Worked closely with events team and leadership on campaigns."
    }
  ],
  "recommended_resume_keywords": [
    "Google Analytics",
    "Email marketing",
    "SEO/SEM",
    "Conversion tracking",
    "CRM tools",
    "Cross-functional team"
  ],
  "custom_resume_modifications": [
    {
      "section": "Experience",
      "suggestion": "Add examples of tracking KPIs for outreach or campaigns."
    },
    {
      "section": "Skills",
      "suggestion": "List tools such as Google Analytics, Hootsuite, or other platforms you've used."
    }
  ],
  "project_alignment_analysis": [
    {
      "project_title": "Community Awareness Campaign",
      "match_strength": "moderate",
      "reason": "Good communication and outreach work, but lacks analytics or data tracking metrics."
    }
  ]
}

🔸 SCORING GUIDELINES:
Give a score out of 100 based on how well the resume aligns with the job description:

- 90–100: Strong match. Resume clearly meets most key job requirements, relevant tools and keywords are present, with only minor gaps.
- 75–89: Good match. Resume covers many important areas but misses a few technical or domain-specific skills.
- 50–74: Moderate match. Resume shows some relevant experience, but key tools, terminology, or domain alignment are missing.
- 30–49: Weak match. Resume has little overlap with job requirements.
- Below 30: Poor match. Resume does not align with the job description.

Use the number and severity of mismatches to justify the score. Be objective.

IMPORTANT:
- Search for the keywords in the job description and if a user has some of them for example; GitLab and Git, then that should count towards the requirements. another example is if they for reinstance have worked with AI, any job that asks for any AI it should count towards the strenghts.
- Respond ONLY with the JSON object, no extra text or markdown formatting.
- Only show the project_alignment_analysis if it is relevant, for example if i's a tech role or maybe a relevant engineering role. Otherwise show project alignment as null.
- Always extract the user name from the resume (top line usually). If unclear, default to "User".
- Match and adapt based on the job description provided.
- Don't use tech-only language. You must adapt terms and feedback to each field: e.g. HR, medical, marketing, logistics, etc.
- If a resume has no match at all, score it low and clearly explain what’s missing.
- If the resume is strong, provide praise and polish tips.

Use the job_requirements_coverage section to influence your score:
- Count how many are "matched", "partially matched", or "not matched".
- Use this ratio to help guide the match score.

Give extra weight to core requirements in the job description (e.g. mandatory certifications, tools, or years of experience). A resume missing these should be penalized more than one missing a soft skill.

`,
  model: gemini({
    model: "gemini-1.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
  })
});


export const AIRoadmapGeneratorAgent = createAgent({
  name:'AIRoadmapcareeragent',
  description:'Generate career road map deatils in a tree like flow',
system: `
Generate a React flow tree-structured learning roadmap for the user's input position or skill set in the following format: a vertical tree structure with meaningful xy positions forming a clear learning flow.

The roadmap can be for **any career field or skill area** (not limited to IT), such as healthcare, finance, arts, education, engineering, business, or technology.

Structure the roadmap similar to roadmap.sh layouts.

Steps should be ordered from fundamentals to advanced.

Include branching for different specializations if applicable.

Each node must have a title, short description, and learning resource link.

Use unique IDs for all nodes and edges.

Ensure vertical spacing between nodes is at least 250 pixels (position.y += 250 per step), and horizontal spacing between branches is at least 300 pixels.

Respond ONLY in valid JSON format, exactly like this example:

{
  "roadmapTitle": "Project Management Learning Roadmap",
  "description": "This roadmap guides learners from foundational project management principles to advanced methodologies and certifications. It includes branches for Agile, Waterfall, and Hybrid approaches. Ideal for aspiring project managers across industries.",
  "duration": "6-9 months",
  "initialNodes": [
    {
      "id": "1",
      "type": "turbo",
      "position": { "x": 0, "y": 0 },
      "data": {
        "title": "Project Management Basics",
        "description": "Learn the core concepts and terminology in project management.",
        "link": "https://www.pmi.org/about/learn-about-pmi/what-is-project-management"
      }
    },
    {
      "id": "2",
      "type": "turbo",
      "position": { "x": 0, "y": 250 },
      "data": {
        "title": "Scheduling and Budgeting",
        "description": "Understand how to plan timelines and manage budgets effectively.",
        "link": "https://www.projectmanager.com/project-management-basics"
      }
    },
    {
      "id": "3",
      "type": "turbo",
      "position": { "x": 0, "y": 500 },
      "data": {
        "title": "Agile Methodology",
        "description": "Master Agile principles and frameworks like Scrum and Kanban.",
        "link": "https://www.agilealliance.org/agile101/"
      }
    }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2" },
    { "id": "e2-3", "source": "2", "target": "3" }
  ]
}

IMPORTANT: Respond ONLY with the JSON object, no extra text or markdown formatting.
`
,
    model:gemini({
    model:"gemini-1.5-flash",
    apiKey:process.env.GEMINI_API_KEY,
  })
})


//This is how we export our created AI model to be used in our front end.
export const AICareerAgent = inngest.createFunction(
  {
    id:'Coach Career'
  },
  {event:'Coach Career'},
  async({event,step})=>{
    const {userInput} = await event?.data;
    const result = await AICareerChatAgent.run(userInput);
    return result;
  }
)


var imagekit = new ImageKit({
    //@ts-ignore
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    //@ts-ignore
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    //@ts-ignore
    urlEndpoint : process.env.IMAGEKIT_ENDPOINT_URL,
});

//Export the Resume Agent
export const AIResumeAgent = inngest.createFunction(
  { id: 'AiResumeAgent' },
  { event: 'AiResumeAgent' },
  async ({ event, step }) => {
    const { recordId, resumeFileUrl, pdfText, AIAgentType, userEmail } = event.data

    const AIResumeReport = await AIResumeAnalyzerAgent.run(pdfText);
    //@ts-ignore
    const rawContent = AIResumeReport.output[0]?.content;

    const jsonMatch =
      rawContent.match(/```json\s*([\s\S]*?)```/) ||
      rawContent.match(/```\s*([\s\S]*?)```/);

    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("Failed to extract JSON from AI output.");
    }

    const rawContentJson = jsonMatch[1].trim();

    const parseJson = JSON.parse(rawContentJson);
    // return parseJson;

    //Save to DataBase
    const saveToDataBase = await step.run('SaveToDataBase', async () => {
      const result = await db.insert(userHistoryTable).values({
        recordId: recordId,
        content: parseJson,
        AIAgentType: ' /ai-tools/ai-resume-analyzer',
        userEmail: userEmail,
        metaData: resumeFileUrl
      });
      console.log(result);
      return parseJson;
    });
}
)

// Export the Job Match Agent
export const AIJobMatchAgent = inngest.createFunction(
  { id: "AIJobMatchAgent" },
  { event: "AIJobMatchAgent" },
  async ({ event, step }) => {
    const {
      recordId,
      resumeFileUrl, 
      pdfText,
      jobDescription,
      userEmail,
    } = event.data;

const aiInput = `
==== RESUME ====
${pdfText}

==== JOB DESCRIPTION ====
${jobDescription}
`;

const aiResponse = await AIJobMatchAnalyzerAgent.run(aiInput);

    //@ts-ignore
    const rawContent = aiResponse.output[0]?.content;

    //Extracting JSON from AI output
    const jsonMatch =
      rawContent.match(/```json\s*([\s\S]*?)```/) ||
      rawContent.match(/```\s*([\s\S]*?)```/);

    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("Failed to extract JSON from AI output.");
    }

    const rawContentJson = jsonMatch[1].trim();
    const parsedJson = JSON.parse(rawContentJson);

    //Saving the result to the database
    const saveToDatabase = await step.run("saveJobMatchToDB", async () => {
      const result = await db.insert(userHistoryTable).values({
        recordId,
        content: parsedJson,
        AIAgentType: "/ai-tools/ai-job-match-analyzer",
        userEmail,
        metaData: resumeFileUrl,
      });
      return parsedJson;
    });

    return saveToDatabase;
  }
);


//Exporting the AI roadmap agent
export const AIRoadmapAgent = inngest.createFunction(
  {id:'AIRoadMapAgent'},
  {event:'AIRoadMapAgent'},
  async({event,step})=>{
    const {roadmapId, userInput,userEmail} = await event.data;

    const roadmapResult = await AIRoadmapGeneratorAgent.run("UserInput:"+userInput);

    //@ts-ignore
    const rawContent = roadmapResult.output[0]?.content;

    // Using regex to extract JSON block between ```json ... ```
    const jsonMatch =
      rawContent.match(/```json\s*([\s\S]*?)```/) ||
      rawContent.match(/```\s*([\s\S]*?)```/);

    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("Failed to extract JSON from AI output.");
    }

    const rawContentJson = jsonMatch[1].trim();

    const parseJson = JSON.parse(rawContentJson);

    
    //Save to DataBase
      const saveToDataBase = await step.run('SaveToDataBase', async () => {
      const result = await db.insert(userHistoryTable).values({
        recordId: roadmapId,
        content: parseJson,
        AIAgentType: ' /ai-tools/ai-roadmap-agent',
        userEmail: userEmail,
        metaData: userInput
      });
      console.log(result);
      return parseJson;
    });
  }
)
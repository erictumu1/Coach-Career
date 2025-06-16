import AIToolCard from "./AIToolCard";

const aiToolsList = [
  {
    name: "AI Career Q&A Chat",
    desc: "Chat with AI Agent",
    icon: "/chatbot.png",
    button: "Ask Now",
    path: "/ai-tools/ai-chat",
  },
  {
    name: "AI Resume Analyzer",
    desc: "Improve your resume",
    icon: "/resume.png",
    button: "Analyze Now",
    path: "/ai-tools/ai-resume-analyzer",
  },
  {
    name: "Career Roadmap Generator",
    desc: "Build your roadmap",
    icon: "/roadmap.png",
    button: "Generate Now",
    path: "/ai-tools/ai-roadmap-agent",
  },
  // {
  //   name: "Cover Letter Generator",
  //   desc: "Write a cover Letter",
  //   icon: "/cover.png",
  //   button: "Create Now",
  //   path: "/ai-tools/cover-letter-generator",
  // },
  {
    name: "Job Match Analyzer",
    desc: "Get job compatability score",
    icon: "/job.png",
    button: "Asses Now",
    path: "/ai-tools/ai-job-match-analyzer",
  },
];

function AITools() {
  return (
    <div className="mt-7 p-5 bg-white-rounded border-2 rounded-xl border-customTeal">
      <h2 className="font-bold text-lg bouncy-underline">Available AI tools</h2>
      <p className="mt-1">
        Start building and Shaping your career our these AI Tools.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-3">
        {aiToolsList.map((tool, index) => (
          <div key={index} className="relative">
            <AIToolCard tool={tool} />
            <div
              className="hidden xl:block absolute top-0 right-0 h-full w-[2px] bg-customTeal"
              style={{
                display: (index + 1) % 4 === 0 ? "none" : "block",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AITools;

import ResumeUploadDialog from "@/app/(routes)/dashboard/_components/ResumeUploadDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Briefcase,
  GraduationCap,
  Loader2Icon,
  Settings,
  Sparkles,
} from "lucide-react";
import { ReactNode, useState } from "react";

interface SectionCardProps {
  title: string;
  score: number;
  description: string;
}

const getBorderColor = (score: number) => {
  if (score < 51) return "border-red-500";
  if (score < 70) return "border-amber-600";
  if (score < 81) return "border-lime-600";
  if (score < 91) return "border-emerald-500";
  return "border-emerald-700";
};

const getTextColor = (score: number) => {
  if (score < 51) return "text-red-500";
  if (score < 70) return "text-amber-600";
  if (score < 81) return "text-lime-600";
  if (score < 91) return "text-emerald-500";
  return "text-emerald-700";
};

const getShadowColor = (score: number) => {
  if (score < 51) return "rgba(239, 68, 68, 0.5)";
  if (score < 70) return "rgba(251, 191, 36, 0.5)";
  if (score < 81) return "rgba(132, 204, 22, 0.5)";
  return "rgba(16, 185, 129, 0.5)";
};

const SectionCard = ({ title, score, description }: SectionCardProps) => {
  const borderColor = getBorderColor(score);
  const textColor = getTextColor(score);

  return (
    <Card
      className={`p-4 border-2 ${borderColor} rounded-lg shadow-sm transition-transform transition-shadow duration-300 ease-in-out hover:scale-[1.05]`}
      style={{
        boxShadow: `0 0 0 rgba(0, 0, 0, 0)`,
      }}
      onMouseEnter={(e) => {
        const card = e.currentTarget;
        card.style.boxShadow = `0 4px 12px ${getShadowColor(score)}`;
      }}
      onMouseLeave={(e) => {
        const card = e.currentTarget;
        card.style.boxShadow = `0 0 0 rgba(0, 0, 0, 0)`;
      }}
    >
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className={`text-3xl font-bold mb-2 ${textColor}`}>{score}%</p>
      <p className="text-sm text-sidebarButtonColor">{description}</p>
    </Card>
  );
};

interface FeedbackItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeedbackItem = ({ icon, title, description }: FeedbackItemProps) => (
  <div className="flex items-start gap-3 mb-4">
    <div className="text-yellow-500 mt-1">{icon}</div>
    <div>
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className=" text-sm leading-snug text-customTealdark">{description}</p>
    </div>
  </div>
);

function Report({ aiReport }: any) {
  const score = aiReport?.overall_score;
  const [loading, setloading] = useState();
  const [file, setFile] = useState<any>();
  const [openResumeUpload, setOpenResumeUpload] = useState(false);

  const breakdown: SectionCardProps[] = [
    {
      title: "Contact Info",
      score: aiReport?.sections?.contact_info?.score ?? 0,
      description: aiReport?.sections?.contact_info?.comment ?? "No comment.",
    },
    {
      title: "Experience",
      score: aiReport?.sections?.experience?.score ?? 0,
      description: aiReport?.sections?.experience?.comment ?? "No comment.",
    },
    {
      title: "Education",
      score: aiReport?.sections?.education?.score ?? 0,
      description: aiReport?.sections?.education?.comment ?? "No comment.",
    },
    {
      title: "Skills",
      score: aiReport?.sections?.skills?.score ?? 0,
      description: aiReport?.sections?.skills?.comment ?? "No comment.",
    },
  ];

  const suggestions: FeedbackItemProps[] = [
    {
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      title: "Contact Info",
      description:
        aiReport?.sections?.contact_info?.tips_for_improvement ??
        "Your contact information is amazing! Great work.",
    },
    {
      icon: <Briefcase className="h-5 w-5 text-blue-500" />,
      title: "Experience",
      description:
        aiReport?.sections?.experience?.tips_for_improvement ??
        "Your experience section is well-written and impactful!",
    },
    {
      icon: <GraduationCap className="h-5 w-5 text-purple-500" />,
      title: "Education",
      description:
        aiReport?.sections?.education?.tips_for_improvement ??
        "Great job outlining your education background!",
    },
    {
      icon: <Settings className="h-5 w-5 text-red-500" />,
      title: "Skills",
      description:
        aiReport?.sections?.skills?.tips_for_improvement ??
        "Your skills align well with the job! Nice work.",
    },
  ];

  return (
    <div className="p-0 lg:-mt-1">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold md:text-2xl mb-5 text-customTeal">
          AI Analysis Results
        </h2>
        <Button
          onClick={() => setOpenResumeUpload(true)}
          className="bg-sidebarButtonColor hover:bg-customTealdark mb-5"
        >
          {loading ? <Loader2Icon className="animate-spin" /> : <Sparkles />}
          Reanalyze
        </Button>
      </div>
      <div className="mt-2 rounded-lg border-customTeal transition-transform duration-300 ease-in-out hover:-translate-y-1">
        <Card className="bg-gradient-to-br from-customTealdark via-[#197571] to-customTealdark rounded-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-6xl font-bold text-customTeallight flex items-baseline">
                {score ?? 0}
                <span className="text-white text-4xl ml-1">/100</span>
              </div>
              <div
                className="text-[25px] font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 bg-clip-text text-transparent
  max-w-full sm:max-w-[60%] break-words sm:ml-auto sm:text-right"
              >
                {aiReport?.overall_feedback}
              </div>
            </div>
            <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-customTeallight rounded-full transition-all duration-500"
                style={{ width: `${score ?? 0}%` }}
              />
            </div>
            <div className="opacity-2 text-[15px] mt-2 sm:mt-0 font-bold bg-gradient-to-r from-blue-100 via-purple-100 to-blue-300 bg-clip-text text-transparent">
              {aiReport?.summary_comment}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-2 rounded-lg border-customTeal transition-transform duration-300 ease-in-out hover:-translate-y-1">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-customTeal">Section Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {breakdown.map((item, idx) => (
                <SectionCard
                  key={idx}
                  title={item.title}
                  score={item.score}
                  description={item.description}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-2 rounded-lg border-customTeal transition-transform duration-300 ease-in-out hover:-translate-y-1">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-customTeal">Areas to Improve</CardTitle>
          </CardHeader>
          <CardContent>
            {suggestions.map((item, idx) => (
              <FeedbackItem
                key={idx}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </CardContent>
        </Card>
      </div>
      <ResumeUploadDialog
        openResumeUpload={openResumeUpload}
        setOpenResumeUpload={setOpenResumeUpload}
      />
    </div>
  );
}

export default Report;

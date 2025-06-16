"use client";
import JobDescriptionDialog from "@/app/(routes)/dashboard/_components/JobDescriptionDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2Icon,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export default function JobMatchReport({ matchReport }: any) {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setloading] = useState();

  const {
    user_name = "User",
    job_title,
    overall_match_score,
    match_feedback,
    fit_summary,
    strengths = [],
    gaps_or_mismatches = [],
    resume_improvement_tips = [],
    job_requirements_coverage = [],
    recommended_resume_keywords = [],
    custom_resume_modifications = [],
    project_alignment_analysis = [],
  } = matchReport ?? {};

  const getMatchStrengthBorder = (strength: string) => {
    if (strength.toLowerCase() === "weak") return "border-red-500";
    if (strength.toLowerCase() === "moderate") return "border-amber-600";
    if (strength.toLowerCase() === "strong") return "border-emerald-500";
    return "";
  };

  const getMatchStrengthTextColor = (strength: string) => {
    if (strength.toLowerCase() === "weak") return "text-red-500";
    if (strength.toLowerCase() === "moderate") return "text-amber-600";
    if (strength.toLowerCase() === "strong") return "text-emerald-500";
    return "";
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.15 } },
      }}
    >
      <motion.div
        className="flex items-center justify-between"
        custom={0}
        variants={containerVariants as any}
      >
        <h2 className="text-xl font-bold md:text-2xl mb-5 text-customTeal bouncy-underline">
          Job Match Results.
        </h2>
        <Button
          onClick={() => setOpenDialog(true)}
          className="bg-sidebarButtonColor hover:bg-customTealdark mb-5"
        >
          {loading ? <Loader2Icon className="animate-spin" /> : <Sparkles />}
          Re-assess
        </Button>
      </motion.div>
      <motion.div custom={1} variants={containerVariants as any}>
        <Card className="bg-gradient-to-br from-customTealdark via-[#197571] to-customTealdark rounded-xl shadow-xl p-6 transition-transform duration-300 ease-in-out hover:-translate-y-1">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold leading-snug md:max-w-[70%]">
                Hello <br />
                {user_name.toLowerCase() !== "user" && (
                  <>
                    <span className="text-customTeallight">{user_name}</span>.
                  </>
                )}
                <br />
                Here's your match report for:{" "}
                <span className="text-customTeallight">{job_title}</span>
              </CardTitle>
              <div className="text-5xl sm:text-7xl font-bold text-customTeallight flex items-baseline whitespace-nowrap md:text-right">
                {overall_match_score ?? 0}
                <span className="text-white text-5xl ml-1">/100</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-base sm:text-lg text-gray-300 pt-5"></CardContent>
        </Card>
      </motion.div>

      <motion.div custom={2} variants={containerVariants as any}>
        <Card className="shadow-lg border-l-4 border-customTeal bg-sidebarColor transition-transform duration-300 ease-in-out hover:-translate-y-1">
          <CardHeader className="flex items-center gap-2">
            <Sparkles className="text-customTeal" />
            <CardTitle className="text-customTealdark text-xl font-semibold">
              Overall Job Match Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-800 leading-relaxed tracking-wide">
              {fit_summary}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-4"
        custom={3}
        variants={containerVariants as any}
      >
        <Card className="shadow-md border-l-4 border-green-500 bg-green-80 transition-transform duration-300 ease-in-out hover:-translate-y-1">
          <CardHeader className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600" />
            <CardTitle className="text-green-700 text-lg font-semibold">
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {strengths.length > 0 ? (
              strengths.map((s: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="text-green-500 mt-1" size={18} />
                  <p className="text-sm text-gray-800">{s}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">
                No strengths listed.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md border-l-4 border-red-500 bg-red-50 transition-transform duration-300 ease-in-out hover:-translate-y-1">
          <CardHeader className="flex items-center gap-2">
            <XCircle className="text-red-600" />
            <CardTitle className="text-red-700 text-lg font-semibold">
              Gaps / Missing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {gaps_or_mismatches.length > 0 ? (
              gaps_or_mismatches.map((g: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <XCircle className="text-red-500 mt-1" size={18} />
                  <p className="text-sm text-gray-800">{g}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">
                No major gaps identified.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={4} variants={containerVariants as any}>
        <Card className="shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-1 border-l-4 border-customTeal bg-teal-50">
          <CardHeader className="flex items-center gap-2">
            <CheckCircle2 className="text-customTeal" />
            <CardTitle className="text-customTealdark text-lg font-semibold">
              Job Requirements Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {job_requirements_coverage.map((item: any, i: number) => {
              const isMatched = item.status.toLowerCase() === "matched";
              return (
                <div
                  key={i}
                  className={`flex items-start gap-4 p-3 rounded-md shadow-sm transition-transform duration-300 ease-in-out hover:-translate-y-1 border-l-4 ${
                    isMatched
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }`}
                >
                  <div className="w-[140px] flex-shrink-0 text-center">
                    <Badge
                      variant={isMatched ? "success" : "destructive"}
                      className="capitalize w-full text-sm"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.requirement}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.evidence}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={5} variants={containerVariants as any}>
        <Card className="shadow-md border-l-4 border-customTeal bg-teal-50 transition-transform duration-300 ease-in-out hover:-translate-y-1">
          <CardHeader className="flex items-center gap-2">
            <Sparkles className="text-customTeal" />
            <CardTitle className="text-customTealdark text-lg font-semibold">
              Resume Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {custom_resume_modifications.map((mod: any, i: number) => (
              <div
                key={i}
                className="bg-white border-l-4 border-customTeal p-3 rounded-md shadow-sm flex items-start gap-3 hover:shadow-md transition"
              >
                <Sparkles className="text-customTeal mt-1" size={18} />
                <p className="text-sm text-gray-800">
                  <strong className="font-semibold text-customTealdark">
                    {mod.section}:
                  </strong>{" "}
                  {mod.suggestion}
                </p>
              </div>
            ))}

            {resume_improvement_tips.map((tip: string, i: number) => (
              <div
                key={i}
                className="bg-white border-l-4 border-yellow-500 p-3 rounded-md flex items-start gap-3 transition-transform duration-300 ease-in-out hover:-translate-y-1"
              >
                <AlertTriangle className="text-yellow-600 mt-1" size={18} />
                <p className="text-sm text-gray-800">{tip}</p>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200 mt-2">
              <p className="font-semibold text-customTealdark mb-2">
                Suggested Keywords:
              </p>
              <div className="flex flex-wrap gap-2">
                {recommended_resume_keywords.map((kw: string, i: number) => (
                  <Badge
                    key={i}
                    className="bg-customTeal font-medium text-white hover:bg-customTealdark transition-colors duration-200"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {project_alignment_analysis !== null && (
        <motion.div custom={6} variants={containerVariants as any}>
          <Card className="shadow-md border-l-4 border-customTeal bg-teal-50 transition-transform duration-300 ease-in-out hover:-translate-y-1">
            <CardHeader className="flex items-center gap-2">
              <CheckCircle2 className="text-customTeal" />
              <CardTitle className="text-customTealdark text-lg font-semibold">
                Project Alignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project_alignment_analysis.map((proj: any, i: number) => (
                <div
                  key={i}
                  className={`p-4 rounded-md bg-white border-l-4 shadow-sm transition-transform duration-300 ease-in-out hover:-translate-y-1 ${getMatchStrengthBorder(
                    proj.match_strength
                  )}`}
                >
                  <p className="text-md font-semibold text-gray-800">
                    {proj.project_title}
                  </p>
                  <p className="text-sm pt-2">
                    Match Strength:{" "}
                    <span
                      className={`font-bold ${getMatchStrengthTextColor(
                        proj.match_strength
                      )}`}
                    >
                      {proj.match_strength}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 pt-2">{proj.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <JobDescriptionDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </motion.div>
  );
}

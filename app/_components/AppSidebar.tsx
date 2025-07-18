"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { useHandleToolClick } from "@/hooks/useHandleToolClick";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ResumeUploadDialog from "../(routes)/dashboard/_components/ResumeUploadDialog";
import RoadmapGeneratorDialog from "../(routes)/dashboard/_components/RoadmapGeneratorDialog";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <img src="/dashboard.png" alt="Dashboard" className="w-5 h-5" />,
  },
  {
    title: "AI Tools",
    url: "/ai-tools",
    icon: <img src="/aitools.png" alt="AI Tools" className="w-5 h-5" />,
    hasSubmenu: true,
  },
  {
    title: "My History",
    url: "/my-history",
    icon: <img src="/history.png" alt="My History" className="w-5 h-5" />,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: <img src="/billing.png" alt="Billing" className="w-5 h-5" />,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: <img src="/profile.png" alt="Profile" className="w-5 h-5" />,
  },
];

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

export function AppSidebar() {
  const path = usePathname();
  const router = useRouter();
  const [isAIToolsOpen, setIsAIToolsOpen] = useState(false);
  const [loadingToolPath, setLoadingToolPath] = useState<string | null>(null);
  const [loadingMainItemUrl, setLoadingMainItemUrl] = useState<string | null>(
    null
  );
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const [hassubmenu, sethassubmenu] = useState<boolean>(true);

  //This use effect helps us to close the side bar and open it using left to right swipe gestures.
  useEffect(() => {
    if (!isMobile) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const swipeDistance = touchEndX - touchStartX;

      // Swipe right to open (from left edge)
      if (touchStartX < 30 && swipeDistance > 50 && !openMobile) {
        setOpenMobile(true);
      }

      // Swipe left to close (anywhere on screen)
      if (
        touchStartX > 30 &&
        swipeDistance < -50 &&
        openMobile &&
        !hassubmenu
      ) {
        setOpenMobile(false);
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, openMobile, setOpenMobile]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const submenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.25,
        when: "afterChildren",
        staggerDirection: -1,
        staggerChildren: 0.05,
      },
    },
  };

  const submenuItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.2,
      },
    },
  };

  const {
    handleClick: externalHandleClick,
    openResumeUpload,
    setOpenResumeUpload,
    openRoadmapDialog,
    setOpenRoadmapDialog,
  } = useHandleToolClick();

  useEffect(() => {
    setOpenResumeUpload(false);
    setOpenRoadmapDialog(false);
    setLoadingToolPath(null);
    setLoadingMainItemUrl(null);
  }, [path]);

  const handleMainItemClick = async (item: (typeof items)[0]) => {
    if (item.hasSubmenu) {
      setIsAIToolsOpen(!isAIToolsOpen);
      sethassubmenu(true);
    } else {
      setLoadingMainItemUrl(item.url);
      await router.push(item.url);
      if (isMobile && hassubmenu) setOpenMobile(false);
      setTimeout(() => {
        setLoadingMainItemUrl(null);
      }, 5000);
    }
  };

  const handleAIToolClick = async (tool: (typeof aiToolsList)[0]) => {
    setLoadingToolPath(tool.path);
    await externalHandleClick(tool, true);
    if (isMobile) setOpenMobile(false);
    setTimeout(() => {
      setLoadingToolPath(null);
    }, 5000);
  };

  const isActive = (url: string) => {
    return path?.startsWith(url);
  };

  return (
    <>
      <Sidebar className="custom-sidebar">
        <SidebarHeader>
          <div className="p-4">
            <div className="flex justify-center items-center gap-2">
              <motion.div
                className=""
                initial={{ opacity: 1 }}
                animate={{
                  opacity: 1,
                  y: [0, -8, 0],
                }}
                transition={{
                  opacity: { duration: 1, delay: 1 },
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  },
                }}
              >
                <Image
                  src="/logo_new_left.png"
                  alt="logo left"
                  width={50}
                  height={20}
                  className="w-16 md:w-40 lg:w-48"
                />
              </motion.div>
              <Image
                src="/logo_new_right.png"
                alt="logo right"
                width={120}
                height={40}
                className="w-21 md:w-40 lg:w-48 hidden md:block"
              />
            </div>
            <motion.h2
              className="text-xs hidden md:block md:text-sm text-customTealdark font-medium text-center mt-4"
              initial="hidden"
              animate="visible"
              variants={fadeInUp as any}
            >
              Ready to land that dream Career..... <br />
              <span className="font-bold text-customTealdark">
                Coach Career's
              </span>{" "}
              got you.
            </motion.h2>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="mt-2">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp as any}
                  >
                    <div>
                      <button
                        onClick={() => {
                          if (!item.hasSubmenu) setLoadingMainItemUrl(item.url);
                          handleMainItemClick(item);
                        }}
                        disabled={item.url === loadingMainItemUrl}
                        className={`w-full text-left px-4 py-2 flex items-center gap-3 rounded-md transition-all duration-200
           hover:bg-[#0e545b] hover:text-white hover:shadow-md hover:scale-[1.1]
${isActive(item.url) ? "bg-[#0e545b] text-white" : "text-black font-medium"}
           ${item.url === loadingMainItemUrl ? "opacity-50" : ""}
         `}
                      >
                        <span className="h-5 w-5">{item.icon}</span>
                        <span className="flex-1">
                          {item.url === loadingMainItemUrl ? (
                            <Loader2Icon className="animate-spin mx-auto w-6 h-6 text-customTeallight" />
                          ) : (
                            <span className="truncate">{item.title}</span>
                          )}
                        </span>
                        {item.hasSubmenu &&
                          (isAIToolsOpen ? (
                            <ChevronUp className="ml-auto" />
                          ) : (
                            <ChevronDown className="ml-auto" />
                          ))}
                      </button>

                      <AnimatePresence initial={false}>
                        {item.hasSubmenu && isAIToolsOpen && (
                          <motion.div
                            key="submenu"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={submenuVariants}
                            className="ml-8 mt-1 flex flex-col gap-1"
                          >
                            {aiToolsList.map((tool, subIndex) => {
                              const isLoading = loadingToolPath === tool.path;
                              return (
                                <motion.button
                                  key={tool.name}
                                  onClick={() => handleAIToolClick(tool)}
                                  disabled={isLoading}
                                  custom={subIndex}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  variants={submenuItemVariants}
                                  transition={{ duration: 0.3 }}
                                  className={`px-4 py-2 flex items-center gap-2 rounded-md transition-all duration-150
              hover:bg-[#0e545b] hover:text-white hover:shadow-md hover:scale-[1.05]
              ${isActive(tool.path) ? "bg-[#0e545b] text-white" : "text-black"}
              ${isLoading ? "opacity-50" : ""}
            `}
                                >
                                  <Image
                                    src={tool.icon}
                                    alt={tool.name}
                                    width={20}
                                    height={20}
                                    className="rounded-sm"
                                  />
                                  <span className="flex-1 min-w-0">
                                    {isLoading ? (
                                      <Loader2Icon className="animate-spin mx-auto w-4 h-4 text-customTeallight" />
                                    ) : (
                                      <span className="truncate block">
                                        {tool.name}
                                      </span>
                                    )}
                                  </span>
                                </motion.button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter></SidebarFooter>
      </Sidebar>

      <ResumeUploadDialog
        openResumeUpload={openResumeUpload}
        setOpenResumeUpload={setOpenResumeUpload}
      />
      <RoadmapGeneratorDialog
        openDialog={openRoadmapDialog}
        setOpenDialog={setOpenRoadmapDialog}
      />
    </>
  );
}

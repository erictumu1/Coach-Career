"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, Send } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";
import EmptyState from "../_components/EmptyState";

type messages = {
  content: string;
  role: string;
  type: string;
};

const loadingMessages = [
  "Coach Career is cooking up some advice... 🧠",
  "Hold on, just tightening the thinking cap... 🎩",
  "Career wisdom is loading... please stand by! ⏳",
  "Fetching career secrets from the cloud... ☁️",
  "Summoning job vibes and resume magic... 🪄",
  "Assembling your career crystal ball... 🔮",
  "One moment... tuning into your dream job frequency. 📡",
  "Crafting the perfect career path... please wait! 🛠️",
];

function AiChat() {
  const [userInput, setUserInput] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { chatid } = useParams(); //We use this to get the chatid
  const router = useRouter();
  console.log(chatid);
  const [currentThinkingMessage, setCurrentThinkingMessage] =
    useState<string>("");
  const [messageList, setMessageList] = useState<messages[]>([]);
  const year = new Date().getFullYear();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  useEffect(() => {
    chatid && getMessagesList();
  }, [chatid]);

  const getMessagesList = async () => {
    const result = await axios.get("/api/history?recordId=" + chatid);
    console.log(result.data);
    setMessageList(result?.data?.content);
  };

  const onSend = async () => {
    const randomMessage =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    setCurrentThinkingMessage(randomMessage);
    setLoading(true);
    setMessageList((prev) => [
      ...prev,
      {
        content: userInput ?? "",
        role: "user",
        type: "text",
      },
    ]);
    const result = await axios.post("/api/ai-career-chat-agent", {
      userInput: userInput,
    });
    console.log(result.data);
    setMessageList((prev) => [...prev, result.data]);
    setLoading(false);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messageList, loading]);

  useEffect(() => {
    // Saving messages into database.
    messageList.length > 0 && updateMessagesList();
  }, [messageList]);

  const updateMessagesList = async () => {
    const result = await axios.put("/api/history", {
      content: messageList,
      recordId: chatid,
    });
    console.log(result);
  };

  const onNewChat = async () => {
    //To create a new chat
    const id = uuidv4();
    const result = await axios.post("/api/history", {
      recordId: id,
      content: [],
    });
    console.log(result);
    router.replace("/ai-tools/ai-chat/" + id);
  };

  return (
    <motion.div
      className="px-0 md:px-15 lg:px-36 xl:px-48"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between gap-8">
        <div>
          <h2 className="font-bold text-lg text-customTeal bouncy-underline">
            AI Career Q/A Chat
          </h2>
        </div>
        <Button
          className="bg-customTeal hover:bg-customTealdark"
          onClick={onNewChat}
        >
          New Chat
        </Button>
      </div>

      <div className="flex flex-col h-[75vh] mt-10">
        {messageList?.length <= 0 && (
          <div className="mt-5">
            {/* Empty state options */}
            <EmptyState
              selectedQuestion={(question: string) => setUserInput(question)}
            />
          </div>
        )}

        <div className="flex-1 overflow-auto" ref={messagesEndRef}>
          {/* Message List */}
          <AnimatePresence>
            {messageList?.map((message, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInUp}
              >
                <div key={index}>
                  <div
                    className={`flex mb-2 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 gap-2 rounded-lg ${
                        message.role === "user"
                          ? "bg-customTeal text-white"
                          : "bg-sidebarColor text-black"
                      }`}
                    >
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                  {loading && messageList.length - 1 === index && (
                    <div className="flex justify-start mb-2">
                      <div className="flex items-center gap-2 p-2 rounded-lg">
                        <LoaderCircle className="animate-spin text-customTeal w-5 h-5" />
                        <span className="bg-gradient-to-r from-customTealdark via-customTeallight to-[#197571] bg-clip-text text-transparent font-semibold text-base animate-blink">
                          {currentThinkingMessage}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center gap-6 mt-4">
          {/* Input field */}
          <Input
            placeholder="Type here"
            value={userInput}
            onChange={(event) => setUserInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (!loading) onSend();
              }
            }}
            className="border border-black focus-visible:border-customTealdark focus-visible:ring-0 rounded-md px-3 py-2"
          />
          <Button
            onClick={onSend}
            className="bg-customTeal hover:bg-customTealdark"
            disabled={loading}
          >
            <Send />
          </Button>
        </div>
      </div>
      <p className="text-[14px] text-customTealdark pt-4 text-center">
        &copy; {year} Created by{" "}
        <span className="text-customTealdark font-bold">Eric Tumu</span>. All
        Rights Reserved.
      </p>
    </motion.div>
  );
}

export default AiChat;

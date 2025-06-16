"use client";
import { motion } from "framer-motion";

function EmptyState({ selectedQuestion }: any) {
  const questionList = [
    "What skills do I need to learn to become a Full Stack Developer?",
    "What do I need to study to be a successful Business Person?",
    "How many hours of practice do I need to become licensed as Nurse?",
  ];

  return (
    <div>
      <h2 className="font-bold text-xl text-center mb-4">
        Coach Career 🧢 is ready to answer your questions.
      </h2>

      <div>
        {questionList.map((question, index) => (
          <motion.h2
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
            className="p-4 text-center border rounded-lg my-3 hover:border-customTeal cursor-pointer text-[12px]"
            onClick={() => selectedQuestion(question)}
          >
            {question}
          </motion.h2>
        ))}
      </div>
    </div>
  );
}

export default EmptyState;

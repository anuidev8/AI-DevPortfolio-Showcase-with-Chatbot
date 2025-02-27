// components/message.tsx
'use client';

import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { ReactNode } from 'react';
import { StreamableValue, useStreamableValue } from 'ai/rsc';

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);
  return (
    <motion.div
      className="flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-[#5cbef8]">
        <Bot />
      </div>
      <div className="flex flex-col gap-1 w-full text-white">
        {text}
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  return (
    <motion.div
      className="flex flex-row gap-4 px-4 w-full  md:px-0 first-of-type:pt-20 w-[100%]"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-[#5cbef8]">
        {role === "assistant" ? <Bot /> : <User />}
      </div>
      <div className="flex flex-col gap-1 w-full text-white w-[100%]">
        {content}
      </div>
    </motion.div>
  );
};
// app/actions.ts
import { Message, TextStreamMessage } from "@/components/message";
import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateId } from "ai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { NotionProject } from '@/types/project.types';
import { AIProjectDisplay } from "@/components/AIProjectDisplay";

import { skills } from '@/mocks/skills__mock';
import { TechMetricsView } from "@/components/TechMetricsViz";

// Portfolio state interface
export interface Portfolio {
  category: string;
  projects: Array<NotionProject>;
  technologies: Array<{ name: string; level: number }>;
}

// Initial portfolio state
let portfolio: Portfolio = {
  category: "Frontend",
  projects: [],
  technologies: skills[0].items.map(tech => ({
    name: tech,
    level: Math.floor(Math.random() * 100)
  }))
};

const sendMessage = async (message: string) => {
  "use server";

  const messages = getMutableAIState<typeof AI>("messages");

  messages.update([
    ...(messages.get() as CoreMessage[]),
    { role: "user", content: message },
  ]);

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value} />;

  const { value: stream } = await streamUI({
    model: openai("gpt-4"),
    system: `\
      - you are Angel's portfolio assistant
      - help users understand projects and technologies
      - reply in a professional tone
    `,
    messages: messages.get() as CoreMessage[],
    text: async function* ({ content, done }) {
      if (done) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          { role: "assistant", content },
        ]);

        contentStream.done();
      } else {
        contentStream.update(content);
      }

      return textComponent;
    },
    tools: {
      viewProjects: {
        description: "view projects for a specific category",
        parameters: z.object({
          category: z.string()
        }),
        generate: async function* ({ category }) {
          const toolCallId = generateId();

          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "viewProjects",
                  args: { category },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "viewProjects",
                  toolCallId,
                  result: `Displaying projects for ${category}`,
                },
              ],
            },
          ]);

          return <Message role="assistant" content={<AIProjectDisplay category={category} />} />;
        },
      },
      viewTechMetrics: {
        description: "view technology expertise and usage metrics",
        parameters: z.object({}),
        generate: async function* () {
          const toolCallId = generateId();

          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "viewTechMetrics",
                  args: {},
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "viewTechMetrics",
                  toolCallId,
                  result: portfolio.technologies,
                },
              ],
            },
          ]);

          return <Message role="assistant" content={<TechMetricsView metrics={portfolio.technologies} />} />;
        },
      },
      updatePortfolio: {
        description: "update portfolio data",
        parameters: z.object({
          category: z.string(),
          technologies: z.array(
            z.object({
              name: z.string(),
              level: z.number(),
            })
          ),
        }),
        generate: async function* ({ category, technologies }) {
          portfolio = {
            ...portfolio,
            category,
            technologies,
          };
          
          const toolCallId = generateId();

          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "updatePortfolio",
                  args: { portfolio },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "updatePortfolio",
                  toolCallId,
                  result: `Portfolio has been updated`,
                },
              ],
            },
          ]);

          return <Message role="assistant" content={<TechMetricsView metrics={portfolio.technologies} />} />;
        },
      },
    },
  });

  return stream;
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
  onSetAIState: async ({ state, done }) => {
    "use server";
    if (done) {
      // save to database
    }
  },
});
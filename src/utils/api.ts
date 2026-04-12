// utils/api.ts
'use server'

// Chat API Result Type - wraps data and error
export interface ChatApiResult {
  data?: { answer: string };
  error?: string;
}

/**
 * Call the chat API with a question.
 * Wraps the API call in try/catch and returns a typed result object.
 * Never silently swallows errors - always returns them in the result.
 */
export async function chatWithAI(question: string): Promise<ChatApiResult> {
  try {
    const response = await fetch('https://portfolio-chatbot-mauve.vercel.app/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      return {
        error: `API error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error occurred';
    return { error: errorMessage };
  }
}

// Notion projects fetch
export async function fetchNotionProjects() {
    const response = await fetch('https://api.notion.com/v1/databases/17f5b59fc6a7807f8793c12e9279728e/query', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },

    });

    const data = await response.json();

    return data.results.map((item: any) => ({
        id: item.id,
        title: item.properties.title.title[0]?.text.content || '',
        description: item.properties.description.rich_text[0]?.text.content || '',
        techs: item.properties.techs.multi_select,
        live: item.properties.live.rich_text[0]?.text.content || '',
        github: item.properties.github.rich_text[0]?.text.content || '',
        featured: item.properties.featured.checkbox,
        category: item.properties.categories.select,
        created_time: item.created_time,
      }));
  }
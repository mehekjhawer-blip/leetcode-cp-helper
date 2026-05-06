import axios from 'axios';

export interface LeetCodeProblem {
  title: string;
  slug: string;
  difficulty: string;
  description: string;
  examples: { input: string; output: string }[];
  functionSignature: string;
  language: string;
}

const LEETCODE_API = 'https://leetcode.com/graphql';

export async function fetchProblem(slug: string): Promise<LeetCodeProblem | null> {
  const query = `
    query getQuestion($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        title
        difficulty
        content
        codeSnippets { lang code }
        exampleTestcaseList
      }
    }
  `;

  try {
    const { data } = await axios.post(LEETCODE_API, {
      query,
      variables: { titleSlug: slug }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const q = data.data.question;
    const cppSnippet = q.codeSnippets.find((s: any) => s.lang === 'C++');

    return {
      title: q.title,
      slug,
      difficulty: q.difficulty,
      description: stripHtml(q.content),
      examples: parseExamples(q.exampleTestcaseList),
      functionSignature: cppSnippet?.code || '',
      language: 'cpp'
    };
  } catch (err) {
    console.error('Failed to fetch problem:', err);
    return null;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

function parseExamples(testcases: string[]): { input: string; output: string }[] {
  // LeetCode returns raw input lines; output needs separate parsing
  return testcases.map(tc => ({ input: tc, output: '' }));
}
import { z } from 'zod/v4';

export const PROMPTS = [
  {
    name: 'ux-heuristic-review',
    title: 'UX Heuristic Review',
    description:
      'Heuristic evaluation for a screen/flow (Nielsen heuristics + actionable fixes).',
    argsSchema: {
      featureOrScreen: z.string().min(1).describe('Describe the UI, screen, or flow to review.'),
      users: z.string().optional().describe('Primary user(s) and their goal(s).'),
      constraints: z
        .string()
        .optional()
        .describe('Constraints like device, accessibility, performance, compliance, deadlines.')
    },
    build: ({ featureOrScreen, users, constraints }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'You are a senior UX designer reviewing a web app UI.',
              '',
              'Do a heuristic review using Nielsen’s 10 heuristics and accessibility framing (POUR).',
              '',
              'Process:',
              '1) Ask up to 5 clarifying questions if needed; otherwise state assumptions.',
              '2) Identify the top user tasks and risks (conversion drop-offs, error states, trust).',
              '3) Provide a prioritized findings list (Critical/Major/Minor) with: issue, who it affects, why it matters, and an actionable fix.',
              '4) Include microcopy improvements where relevant (specific rewrites).',
              '5) Include what to measure/validate (analytics event ideas or usability test tasks).',
              '',
              users ? `Users / goals:\n${users}` : null,
              constraints ? `Constraints:\n${constraints}` : null,
              '',
              `Screen/flow:\n${featureOrScreen}`,
              '',
              'If you have access to MCP tools, you may first call a UI inventory tool and an accessibility audit tool on the relevant HTML/URL, then incorporate results.'
            ]
              .filter(Boolean)
              .join('\n')
          }
        }
      ]
    })
  },
  {
    name: 'ux-usability-test-plan',
    title: 'Usability Test Plan',
    description: 'Draft a moderated usability test plan (tasks, success criteria, questions).',
    argsSchema: {
      researchGoal: z.string().min(1).describe('What decision this test informs.'),
      productContext: z.string().min(1).describe('What the product is and what we’re testing.'),
      targetUsers: z.string().optional().describe('Recruiting criteria and target users.'),
      tasksToTest: z.string().optional().describe('Key tasks to include.')
    },
    build: ({ researchGoal, productContext, targetUsers, tasksToTest }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'Create a moderated usability test plan for a web app.',
              '',
              'Requirements:',
              '- Keep it practical and runnable (45–60 minutes).',
              '- Include: goal, hypotheses, participant criteria, setup, tasks (with success criteria), prompts, metrics, and debrief.',
              '- Make tasks scenario-based and non-leading.',
              '',
              `Research goal:\n${researchGoal}`,
              '',
              `Product context:\n${productContext}`,
              targetUsers ? `\nTarget users:\n${targetUsers}` : null,
              tasksToTest ? `\nMust-cover tasks:\n${tasksToTest}` : null,
              '',
              'If helpful, also include a short note on what artifacts to capture (recordings, quotes, timestamps) and how to synthesize findings.'
            ]
              .filter(Boolean)
              .join('\n')
          }
        }
      ]
    })
  },
  {
    name: 'ux-microcopy-variants',
    title: 'UX Microcopy Variants',
    description: 'Generate concise microcopy options with rationale and accessibility notes.',
    argsSchema: {
      currentCopy: z.string().min(1).describe('Existing UI text (button labels, errors, helper text).'),
      context: z.string().min(1).describe('Where the text appears and what the user is trying to do.'),
      tone: z.string().optional().describe('Tone (e.g., neutral, friendly, professional).'),
      maxLength: z.number().int().min(5).max(140).optional().describe('Max characters per variant.')
    },
    build: ({ currentCopy, context, tone, maxLength }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'You are a UX writer.',
              '',
              'Generate 5 improved microcopy variants.',
              'For each variant: provide the text, a 1-sentence rationale, and any accessibility/clarity note (e.g., avoid ambiguity, describe action/result).',
              '',
              tone ? `Tone: ${tone}` : null,
              maxLength ? `Max length: ${maxLength} characters` : null,
              '',
              `Context:\n${context}`,
              '',
              `Current copy:\n${currentCopy}`
            ]
              .filter(Boolean)
              .join('\n')
          }
        }
      ]
    })
  }
];


/* DRAFT, NOT PUBLISHED. No route, not in POSTS, not in sitemap/RSS.
   Planned slug: n8n-or-claude-code. Fill the [WASEEM:] placeholders, then
   move to _content/, add a PostMeta entry to ../posts.ts and a page folder. */
import type { Block } from "../_content/types";

export const draftMeta = {
  slug: "n8n-or-claude-code",
  title: "n8n or Claude Code? How I decide which one builds it",
  description:
    "How I choose between n8n and Claude Code for a job: what each is good at, my decision rule, one real example, and the guardrails I add to either.",
  status: "draft" as const,
};

export const body: Block[] = [
  {
    t: "lead",
    text: "People ask whether Claude Code makes n8n pointless, or the other way round. I use both every week, and I do not think it is either/or. Here is how I decide which one builds a given job.",
  },
  { t: "h2", text: "What n8n is built for" },
  {
    t: "p",
    text: "n8n runs workflows that start from a trigger. Its Webhook node gives a workflow a URL that receives data when an event happens, and it can return the workflow's output, so it can act like a small API endpoint. You can self-host it: n8n's hosting docs list Docker Compose and several cloud providers, and without a licence key it runs as the free Community edition.",
  },
  {
    t: "p",
    text: "What I lean on most is that every run is recorded. n8n keeps an execution history per workflow and across all of them, with status and timing, and you can copy data from a past execution into the workflow to debug it. A client can look at a run and see what happened.",
  },
  {
    t: "p",
    text: "Failure handling is built in too. You can set an error workflow that runs when another workflow's execution fails, starting with an Error Trigger node, so a failure can alert you. A Stop and Error node lets you fail a run on purpose when your own condition is met.",
  },
  { t: "h2", text: "What Claude Code is built for" },
  {
    t: "p",
    text: "Claude Code works in a code base or a folder. It reads files, edits them, runs commands, and can use subagents with their own context windows for side jobs. Plan mode lets it propose changes before it edits anything. That makes it good at work that has no trigger: a one-off build, a refactor, a content or video pipeline, a site audit.",
  },
  {
    t: "p",
    text: "It can also be run on a schedule. Anthropic's docs list cloud scheduled tasks, desktop scheduled tasks, GitHub Actions and the /loop command for this. I treat those with more care than a fixed workflow, for a reason in the next section.",
  },
  { t: "h2", text: "My decision rule" },
  {
    t: "p",
    text: "[WASEEM: your decision rule]",
  },
  { t: "h2", text: "A real example" },
  {
    t: "p",
    text: "[WASEEM: real example, named client OK?]",
  },
  { t: "h2", text: "Guardrails for either one" },
  {
    t: "p",
    text: "Whichever tool runs it, a job that repeats on its own gets a step limit, a time limit and a spend limit, plus a circuit breaker I can trip quickly. And anything that writes words a customer will read stays a draft until a person approves it. I wrote my reasoning for that in a separate post.",
  },
  { t: "h2", text: "When neither is the answer" },
  {
    t: "p",
    text: "Some jobs are a settings change in a tool the client already pays for. If a native feature does it, I would rather tell the owner that than build something they then have to maintain.",
  },
  {
    t: "p",
    text: "Sources: n8n docs on self-hosting (docs.n8n.io/hosting), error handling (docs.n8n.io/flow-logic/error-handling), executions (docs.n8n.io/workflows/executions) and the Webhook node (docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook); Anthropic's Claude Code docs on subagents, hooks and common workflows (code.claude.com/docs).",
  },
];

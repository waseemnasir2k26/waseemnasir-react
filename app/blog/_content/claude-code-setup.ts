import type { Block } from "./types";

export const body: Block[] = [
  {
    t: "lead",
    text: "I use Claude Code as an operations layer for client work, not as a chat window. It is a small set of files and rules that make the same behaviour show up every session. Here is the setup, and three times it failed me and what each failure turned into.",
  },
  { t: "h2", text: "A rules file that loads every session" },
  {
    t: "p",
    text: "The base is a global CLAUDE.md of execution rules. Anthropic's docs describe CLAUDE.md as persistent instructions that load at the start of every session, because each session otherwise begins with a fresh context window. Mine covers how I want work done: read the code before changing it, plan before touching several files, never start an automation loop without limits, never freeze the laptop with a render.",
  },
  {
    t: "p",
    text: "One line in those docs changed how I write it. Claude treats these files as context, not enforced configuration. If a rule must hold no matter what the model decides, the docs point you to a PreToolUse hook instead. I keep that in mind for everything below: instructions for the habits, hooks for the hard stops.",
  },
  { t: "h2", text: "Memory: one fact per file" },
  {
    t: "p",
    text: "I keep a file-based memory. Each durable fact lives in its own small file, and a short MEMORY.md index is loaded at the start of each session. The index only says what exists and where. When I resume a project, I open the one file that matters instead of dragging my whole history into the conversation.",
  },
  {
    t: "p",
    text: "The failure mode is an index that grows without discipline. Mine has already outgrown what loads in one go, and part of it gets cut off. That is a lesson in itself: keep entries to one line, and move detail into the topic files.",
  },
  { t: "h2", text: "Subagents for the jobs I should not grade myself" },
  {
    t: "p",
    text: "Claude Code subagents are Markdown files with a name, a description and a prompt. Each runs in its own context window, with its own tool access, and returns a summary rather than everything it read. I have four I use constantly: a planner that breaks a goal into steps, a security auditor, a content QA agent that checks copy for claims I cannot back up, and a site auditor that checks a site before I hand it over.",
  },
  {
    t: "p",
    text: "The auditors are read-only on purpose. A reviewer that can also edit will quietly fix what it found, and then you never learn what was wrong.",
  },
  { t: "h2", text: "Plan mode before anything multi-file" },
  {
    t: "p",
    text: "For anything that touches more than a file or two, I switch to plan mode first. In plan mode Claude reads and proposes, and makes no edits until I approve. You enter it with Shift+Tab. On client work the approved plan doubles as the written scope of what I said I would do, which has saved me an argument or two.",
  },
  { t: "h2", text: "The ship gate: a judge that is not me" },
  {
    t: "p",
    text: "Before anything goes to a client, gets deployed or gets posted, an independent critic grades it. It is a separate pass whose job is to fail the work unless the work earns a pass. A hook then blocks the deploy command unless a fresh PASS marker exists. I did not want to rely on remembering the rule at midnight.",
  },
  {
    t: "p",
    text: "My phrase for it: AI review is a sensor, never the verdict. It tells me where to look. I am the one who ships. One caveat from Anthropic's hooks docs is worth knowing: a hook that errors out or times out does not block by default, so treat a hook as a strong guard rather than a vault.",
  },
  { t: "h2", text: "Loops need limits" },
  {
    t: "p",
    text: "Any automation that runs on its own, whether a scheduled workflow or a recurring agent, gets three caps before it goes live: a step limit, a time limit and a spend limit. It also gets a circuit breaker, which for me is a plain file. If the file exists, the loop stops. A file is crude, and that is the point: I can create it from my phone without opening a single dashboard.",
  },
  {
    t: "p",
    text: "The same thinking applies to my own machine. Heavy renders hold back a share of the laptop so it never freezes while I am working on it. A slow render is fine. A frozen laptop is a failure.",
  },
  { t: "h2", text: "Three things that broke, and the rule each one became" },
  {
    t: "p",
    text: "None of the rules above came from theory. These did.",
  },
  {
    t: "list",
    ordered: true,
    items: [
      "A static site deploy finished, the log said success, and the host's CDN kept serving the old homepage for about ten minutes. Rule: after a deploy, purge the cache and check the live page itself. The deploy log is not evidence.",
      "A deploy upload briefly left the deploy zip publicly downloadable. Rule: after every deploy, request the archive URL and confirm it returns a 404.",
      "An AI replied to a lead before I had approved anything. Rule: replies are drafts only. I confirm every one. This is the same reasoning I wrote up in my post on why a person checks every AI reply.",
    ],
  },
  { t: "h2", text: "If you want to copy any of it" },
  {
    t: "p",
    text: "Start with the smallest piece that pays back fastest. Write a CLAUDE.md with five rules you actually care about. Add one read-only reviewer subagent. Put one hook on the one command you cannot afford to run by mistake. Then add a rule each time something breaks, and write down what broke next to it, because the incident is what makes the rule stick.",
  },
  {
    t: "p",
    text: "I have deliberately left out any claim about hours saved. I have not measured it in a way I would stand behind, and a number I cannot defend is worse than none.",
  },
  {
    t: "p",
    text: "Sources: Anthropic's Claude Code documentation on memory (code.claude.com/docs/en/memory), subagents (code.claude.com/docs/en/sub-agents), hooks (code.claude.com/docs/en/hooks) and common workflows (code.claude.com/docs/en/common-workflows).",
  },
];

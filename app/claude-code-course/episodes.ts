/* Episode data for /claude-code-course. Source: COURSE-PAGE-CONTENT.json (FINAL-V3). */
export type Episode = {
  n: number;
  label: string;
  title: string;
  intro: string;
  learn: string[];
  repo: string;
  live: string;
  iso: string;
};

export const EPISODES: Episode[] = [
  {
    "n": 1,
    "label": "Episode 1",
    "title": "Claude Code Tutorial: Build a Small Business Website (Ep 1)",
    "intro": "A slow, broken website quietly loses customers, and the owner never finds out. Watch Claude Code take a small-business website from an empty folder to a mobile-ready preview with a working menu and inquiry form.",
    "learn": [
      "How Claude Code works on your own laptop, inside one project folder",
      "Permission prompts and plan mode: you approve what Claude does before it does it",
      "CLAUDE.md: a written rule sheet you control",
      "A five-check quality test that catches what a nice-looking page hides, then fixing the one that fails"
    ],
    "repo": "https://github.com/waseemnasir2k26/agency-ai-delivery-kit",
    "live": "28 Nov",
    "iso": "2026-11-28"
  },
  {
    "n": 2,
    "label": "Episode 2",
    "title": "Claude Code Tutorial: Automate Client Reports With Skills (Ep 2)",
    "intro": "A client report that looks right is not enough, it has to be complete, consistent and honest. Build a repeatable weekly report with a Claude Code skill and guards, then try to beat your own guards.",
    "learn": [
      "Turn a written report procedure into a reusable skill",
      "Test a skill with a check that can fail, and watch it go from zero of three to three of three",
      "Add guards: block reads of the file holding your keys, and require a reviewer before a change is saved",
      "Schedule the report for 7 a.m. and see a failed run leave a clear failure record instead of a fake success"
    ],
    "repo": "https://github.com/waseemnasir2k26/n8n-retainer-report",
    "live": "29 Nov",
    "iso": "2026-11-29"
  },
  {
    "n": 3,
    "label": "Episode 3",
    "title": "Claude Code Subagents Tutorial: Parallel Client Work (Ep 3)",
    "intro": "Three client requests land on the same Monday and the owner is the bottleneck. Learn how Claude Code subagents split suitable work into separate jobs, then how to review the combined result.",
    "learn": [
      "What a subagent is and the three kinds used here: a reader, builders, and a critic",
      "Which jobs can run at the same time and which must wait",
      "Giving each job its own copy of the project, and one owner per shared file",
      "Reviewing combined output, including a review that passed but proved nothing"
    ],
    "repo": "https://github.com/waseemnasir2k26/agency-ai-delivery-kit",
    "live": "30 Nov",
    "iso": "2026-11-30"
  },
  {
    "n": 4,
    "label": "Episode 4",
    "title": "Claude Code Tutorial: Build a Website QA Agent (Ep 4)",
    "intro": "Your client's website can break overnight and nobody notices. Build a small QA agent that opens each site like a customer, clicks the main button, compares it with the client's data and writes a pass or fail report.",
    "learn": [
      "How to give an agent only four tools you wrote, and nothing else",
      "How the agent checked three client sites in about 29 seconds",
      "Four attacks on your own agent, including a hidden line telling the tester to pass everything",
      "A nightly job and a morning report the client can read"
    ],
    "repo": "https://github.com/waseemnasir2k26/lead-leak-audit",
    "live": "1 Dec",
    "iso": "2026-12-01"
  },
  {
    "n": 5,
    "label": "Episode 5",
    "title": "Claude Code MCP Tutorial: Safe Booking Assistant (Ep 5)",
    "intro": "One wrong answer and a customer waits at home for a technician who is double-booked. Build an assistant that reads bookings, finds free slots and drafts a reschedule message, while a person makes every change.",
    "learn": [
      "How a limited MCP connector reads booking data and prepares drafts",
      "Why the existing booking system stays the source of truth",
      "Break tests: a cancel tool added for convenience, a note that gives orders, and a key in the repo",
      "Why a warning is not a lock, and how to rotate a key and scan for leaks"
    ],
    "repo": "https://github.com/waseemnasir2k26/sitebot-in-a-box",
    "live": "2 Dec",
    "iso": "2026-12-02"
  },
  {
    "n": 6,
    "label": "Episode 6",
    "title": "Claude Code Cost Per Task: Price Your AI Work (Ep 6)",
    "intro": "If all you know is your monthly AI plan price, you are pricing client work on a guess. Measure usage, time and cost per run and per client so you can make a more informed price decision.",
    "learn": [
      "A one-page report with cost per run and cost per client, with every number's source",
      "Three ways cost leaks: a note that grows too long, a loop nobody ends, and a job with no cap",
      "A spending cap on every job that runs unattended",
      "A small table of which model handles which step. All dollar figures are list-price estimates."
    ],
    "repo": "https://github.com/waseemnasir2k26/free-llm-router",
    "live": "3 Dec",
    "iso": "2026-12-03"
  },
  {
    "n": 7,
    "label": "Episode 7",
    "title": "Claude Code Plugin Tutorial: Share Your Team Setup (Ep 7)",
    "intro": "Sending a zip file and a long message to every new team member means copies drift apart, and a stale safety hook is a real risk. Package your skills, agents and hooks into one Claude Code plugin.",
    "learn": [
      "What a Claude Code plugin is: skills, agents, hooks and connectors loaded as one named, versioned unit",
      "What to put in the plugin and what to keep out",
      "Three tests on a clean setup, including one that fails quietly",
      "Fixing the system and rerunning the same tests"
    ],
    "repo": "https://github.com/waseemnasir2k26/agency-ai-delivery-kit",
    "live": "4 Dec",
    "iso": "2026-12-04"
  },
  {
    "n": 8,
    "label": "Episode 8",
    "title": "Claude Code Tutorial: AI Customer Support Inbox Agent (Ep 8)",
    "intro": "Booking questions, complaints and refund requests need different handling, and an angry customer should not get a cheerful template. Build an agent that classifies support emails and drafts replies for a person to review.",
    "learn": [
      "How to read, classify, and flag sensitive messages for a human",
      "Setting rules and an approved knowledge boundary before the agent reads mail",
      "Drafting replies into a folder while nothing sends, refunds or changes a booking",
      "Testing a message that tries to take control, plus a one-page operating sheet"
    ],
    "repo": "https://github.com/waseemnasir2k26/sitebot-in-a-box",
    "live": "5 Dec",
    "iso": "2026-12-05"
  },
  {
    "n": 9,
    "label": "Episode 9",
    "title": "Claude Code Tutorial: Write Business Quotes With AI (Ep 9)",
    "intro": "When a quote takes days, customers keep calling or choose someone else. Turn inspection notes and an approved price list into a structured quote draft, with a price check that runs as code.",
    "learn": [
      "Why each input has a different role: notes, photos, measurements, price list, past quotes",
      "Building a job brief and a quote with scope and exclusions",
      "A price check that runs as code, so a wrong line is caught",
      "Timing the workflow honestly and saving a reusable quote template. No promise that it wins jobs."
    ],
    "repo": "https://github.com/waseemnasir2k26/scopeguard",
    "live": "6 Dec",
    "iso": "2026-12-06"
  },
  {
    "n": 10,
    "label": "Episode 10",
    "title": "Claude Code Tutorial: Lead Follow-Up to Invoice Automation (Ep 10)",
    "intro": "A homeowner fills in the website form at 7:24 p.m. and the office is closed. Build a chain from first reply to quote to invoice to reminders, where the model drafts, code checks, and a person approves.",
    "learn": [
      "A four-stage workflow: first reply, quote, invoice, payment reminders",
      "The rule through the whole chain: the model drafts, code checks numbers and dates, a person approves",
      "How to prove nothing sent: Claude can only write drafts, and the sent folder stays empty",
      "Measuring the whole chain and walking one lead from start to finish"
    ],
    "repo": "https://github.com/waseemnasir2k26/lead-leak-audit",
    "live": "7 Dec",
    "iso": "2026-12-07"
  },
  {
    "n": 11,
    "label": "Bonus",
    "title": "Claude Code Bonus: Find and Prepare Upwork Jobs With AI",
    "intro": "Fifty-six job posts is a lot of reading, and most were never going to fit. See a real workflow that fetches jobs through an official connector, filters them, scores the rest and prepares an example proposal for human review.",
    "learn": [
      "How the workflow fetches jobs through Upwork's official connector and only searches, never writes",
      "How kill rules filter jobs before any reading starts",
      "The real result of one run, told as it happened",
      "Preparing one example proposal, with a person reviewing and deciding before anything is submitted"
    ],
    "repo": "https://github.com/waseemnasir2k26/upwork-job-filter",
    "live": "8 Dec",
    "iso": "2026-12-08"
  }
];

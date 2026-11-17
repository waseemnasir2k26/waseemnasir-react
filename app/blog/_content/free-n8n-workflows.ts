import type { Block, Faq } from "./types";

export const body: Block[] = [
  {
    t: "lead",
    text: "I publish my n8n workflows for free because explaining a build in public makes me a better builder, and because it lets the right clients find me while the wrong ones rebuild it themselves. Here is what is actually in the series, what you can import, and what it costs you if you go the free route.",
  },
  { t: "h2", text: "What is actually in the series" },
  {
    t: "p",
    text: "Every workflow I show on video is published as an importable JSON file in a public GitHub repo, under the MIT licence, so you can use it in client work too. Each folder has its own README listing the nodes and the credentials you need. Three examples I can point to:",
  },
  {
    t: "links",
    items: [
      {
        href: "https://youtu.be/hbWm05jjwYU",
        label: "Episode 5, the clinic WhatsApp booking agent",
        note: "simulated WhatsApp messages come in, a rule in code sends anything about symptoms, medication or prices to a human handoff, and the rest goes to an agent that checks a slot grid and books. Every reply lands in an outbox table and is never sent. Import workflow 05 from the repo.",
      },
      {
        href: "https://youtu.be/u8aXog9yphw",
        label: "Episode 10, the Lead Stack",
        note: "an install script that imports five of my published workflows into a fresh n8n, inactive, wired to one shared ledger. The folder is workflow 10 in the repo.",
      },
      {
        href: "https://github.com/waseemnasir2k26/n8n-workflows",
        label: "The repo itself",
        note: "workflows 01 to 21 as workflow.json files, from a shorts factory to a missed-call text back to a review reply drafter that cannot post anything.",
      },
    ],
  },
  {
    t: "p",
    text: "What I keep back is the work around the workflow. Your business has its own tools, its own messy data and its own people, and that part cannot be copied from a video. A workflow is one piece of a working system, and the system is what I sell.",
  },
  { t: "h2", text: "Why free makes sense for me" },
  {
    t: "list",
    ordered: true,
    items: [
      "It forces me to be clear. If I can't explain a workflow well enough for a stranger to rebuild it, I probably don't understand it well enough to charge for it. Recording an episode finds the gaps in my own thinking.",
      "It filters for the right people. Someone who watches a full episode and builds it themselves was never going to hire me for that job, and that's fine. Someone who watches, sees how much care goes into error handling and testing, and thinks \"I'd rather hand this over\" is a good conversation to have.",
      "It is proof I can show. I'd rather you judge my work from how I build in the open than from a sales page. If my approach is sloppy, you will see it before we ever speak.",
      "It matches how I learned. A great deal of what I know about automation came from people who shared their builds. Sharing mine is partly paying that back.",
    ],
  },
  { t: "h2", text: "The caveat people miss" },
  {
    t: "p",
    text: "Importing the JSON is not the same as having it running. The repo README tells you to replace every credential marked REPLACE_ME, and the folder README for each workflow lists what it expects: workflow 05, for example, needs a Postgres database and an OpenAI-compatible key, and I run it against Groq. The first thing people hit is a node that fails because a credential or table is missing, not because the workflow is wrong.",
  },
  {
    t: "p",
    text: "In the Lead Stack episode, two of the five workflows errored on screen when I ran them, and I left that in the video. It is a more honest picture of what the first run of an imported workflow looks like.",
  },
  { t: "h2", text: "What I'm careful about" },
  {
    t: "p",
    text: "Free does not mean careless. The repo's published workflows use placeholder hosts and REPLACE_ME credentials, and the ones that touch customers ship with their send nodes disabled or no send node at all. That is the same rule I explain in my post on why I never let AI send a customer reply without a human check.",
  },
  {
    t: "p",
    text: "I also try to say plainly what a workflow does not cover. A tutorial workflow is a starting point. Before you run it against real customers, you will want your own checks, your own alerts and a person who owns what happens when it fails.",
  },
  { t: "h2", text: "What the free route costs you" },
  {
    t: "p",
    text: "Being honest about the other side: free workflows cost your time. You install and host n8n, connect your accounts, fix the small differences between my setup and yours, and maintain the thing afterwards. If you enjoy that, it is a very good way to learn. If you would rather spend that time running your business, paying someone to build and look after it is a reasonable choice, and I would say the same to anyone who asked me.",
  },
  {
    t: "p",
    text: "My advice if you're deciding: start with one small, boring workflow from the series. I wrote about why the dull jobs come first in what I automate first in a small business. If you can get one working and you find you like it, you will learn quickly what you can run yourself and what you would want help with.",
  },
  { t: "h2", text: "Where to start" },
  {
    t: "p",
    text: "Pick the one repeated task that annoys you most, find the nearest episode in the series, and rebuild it with your own test data before you connect anything real. Browse the repo and pick one, or if you would rather have it built, book a free audit and I'll tell you honestly whether it is a job for you or for me.",
  },
];

export const faq: Faq[] = [
  {
    q: "Are the n8n workflows really free?",
    a: "Yes. The JSON files are in a public repo under the MIT licence, with no signup needed to download them. What you pay for is your own hosting and any services you connect, such as a database or a model API.",
  },
  {
    q: "Why would a founder give workflows away?",
    a: "It is a working portfolio. Anyone can read how I build before they talk to me, and the paid work is the fitting and upkeep that a file cannot carry.",
  },
  {
    q: "Can I use the free workflows for my own business?",
    a: "Yes, including client work, under the licence. Replace the placeholder credentials, test with dummy data first, and keep a person responsible for anything that messages customers.",
  },
];

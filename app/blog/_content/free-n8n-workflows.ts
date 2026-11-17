import type { Block, Faq } from "./types";

export const body: Block[] = [
  {
    t: "lead",
    text: "I publish my n8n workflows for free, in a series on my YouTube channel, and people sometimes ask whether I'm giving away the thing I sell. I understand the worry. Here is my reasoning, including the parts that are not purely generous.",
  },
  { t: "h2", text: "What I actually give away" },
  {
    t: "p",
    text: "The free series shows working n8n workflows: the trigger, the steps, the failure handling, and why I built it that way. You can follow along and rebuild the same thing in your own n8n. I don't hold back the interesting node or save the good version for paying clients. What I show is how I'd really build it.",
  },
  {
    t: "p",
    text: "What I don't give away is the work around the workflow. Your business has its own tools, its own messy data and its own people, and that part cannot be copied from a video. A workflow is a small piece of a working system, and I sell the system.",
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
  { t: "h2", text: "How I decide what goes in the series" },
  {
    t: "p",
    text: "I choose workflows that a small business could realistically use: something that catches a message, sorts it, drafts a reply or tidies a spreadsheet. I skip anything that only looks impressive on camera. If a build needs ten fragile steps to produce a nice demo, it is not teaching you anything you can use on a Monday morning.",
  },
  {
    t: "p",
    text: "I also try to show the unglamorous parts: what happens when an API call fails, how to read an execution log, and how to test a change without touching live data. Those habits matter more than any single node, and they are the part most tutorials leave out because they make for a duller video.",
  },
  {
    t: "p",
    text: "Not every episode lands. Some workflows turn out simpler than I expected, and some need a caveat I only noticed while recording. When that happens I would rather say so in the video than polish it away.",
  },
  { t: "h2", text: "What I'm careful about" },
  {
    t: "p",
    text: "Free does not mean careless. Everything in the series is built on my own test data, never on a client's. I don't show customer messages, real credentials or anything that belongs to someone else's business. When a workflow touches customer communication, I show the human approval step too, for the same reason I explain in my post on why I never let AI send a customer reply without a human check.",
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
    text: "Pick the one repeated task that annoys you most, find the nearest episode in the series, and rebuild it with your own test data before you connect anything real. If you get stuck, or you'd like me to look at what you have in mind, you can book a free audit and I'll tell you honestly whether it is a job for you or for me.",
  },
];

export const faq: Faq[] = [
  {
    q: "Are the n8n workflows really free?",
    a: "Yes. The workflows in my series are free to watch and rebuild. n8n itself can be self-hosted, and the free Community edition works without a licence key, though hosting and any tools you connect have their own costs.",
  },
  {
    q: "Why would a founder give workflows away?",
    a: "Because explaining a build in the open makes me a better builder, it shows my approach before anyone hires me, and the paid work is the part a video cannot copy: fitting a system to one specific business and looking after it.",
  },
  {
    q: "Can I use the free workflows for my own business?",
    a: "You can rebuild them and adapt them to your own tools. Test with dummy data first, add your own error alerts, and keep a person responsible for anything that sends messages to customers.",
  },
];

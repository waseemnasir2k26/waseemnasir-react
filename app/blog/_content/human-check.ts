import type { Block } from "./types";

export const body: Block[] = [
  {
    t: "lead",
    text: "When I design anything that talks to a customer, I follow one rule: the AI drafts, a person sends. I've settled on it after thinking about where the risk sits, and I want to lay out that reasoning so you can judge whether it fits your business.",
  },
  { t: "h2", text: "Where the risk sits" },
  {
    t: "p",
    text: "A language model writes fluent text whether or not it's right. That's useful for drafts and risky for anything final. It can miss that a customer is annoyed, state something about your policy that isn't true, or agree to a thing you'd never agree to. And when the message goes out, the customer sees your business name, not a model's.",
  },
  {
    t: "p",
    text: "Weigh that against the price of a check. Reading a short draft and tapping a button takes a few seconds. A wrong message can cost a customer, or leave you honouring a promise you never made. With stakes that lopsided, I don't need much convincing.",
  },
  { t: "h2", text: "My rules for every build" },
  {
    t: "p",
    text: "Over time the one rule has grown a few companions. These are the ones I don't negotiate on:",
  },
  {
    t: "list",
    ordered: true,
    items: [
      "If a model composes words a customer will read, a named person approves them first. A fixed confirmation you wrote yourself, like a booking receipt, can go out alone, because nothing is being improvised.",
      "Some things never run fully automatic: refunds and credits, complaints, bad news, anything about health, legal matters or someone's money, and any message that commits you to a price, a date or an exception. The system can gather the facts and draft. The decision and the words stay with a person.",
      "I plan for failure in every build. When a step breaks, the message goes to a person with a note on what went wrong, so a customer never gets silence. A loud failure costs an annoying hour. A silent one can cost a customer you never knew you lost.",
      "One person owns the queue of anything the system is unsure about. A queue that belongs to everyone ends up belonging to nobody.",
    ],
  },
  { t: "h2", text: "What approval looks like day to day" },
  {
    t: "p",
    text: "I try to make the check so light that nobody resents it. In the setups I build, the draft shows up where the owner or their team already works, with the customer's original message right beside it. They get three choices: send it as is, change a few words and send, or throw it away and write their own.",
  },
  { t: "h2", text: '"But the models keep getting better"' },
  {
    t: "p",
    text: "They do, and I use that. A better model means better drafts and fewer corrections. What it doesn't change is the shape of the risk. A model that's right nearly every time still has the occasional miss, and the miss tends to arrive on the one message where the customer is already unhappy or the stakes are high. I'd rather pay a few seconds of review on every draft than meet that miss unprepared.",
  },
  {
    t: "p",
    text: "There's a human side too. Staff who approve drafts learn what the system does well and where it stumbles, so they trust it for the right reasons. People who were handed a finished black box tend to either distrust it completely or stop looking at it at all.",
  },
  { t: "h2", text: "It gets lighter over time" },
  {
    t: "p",
    text: "When you correct a draft, you're also correcting the instructions behind it, so the next draft starts from a better place. You'll usually edit less as the drafts improve. Even so, I keep the approval step, because the point was never to catch a high number of errors. It was to make sure the rare bad one doesn't reach a customer.",
  },
  {
    t: "h2",
    text: "If you're adding AI replies to your business, check these four things",
  },
  {
    t: "list",
    ordered: true,
    items: [
      "Who is the named person that approves drafts, and who covers when they're away?",
      "Where do messages go when the system fails or isn't sure of the answer?",
      "Which topics are off limits for AI drafting in your business, and is that written down?",
      "Which single measure will tell you in a month whether this is working?",
    ],
  },
];

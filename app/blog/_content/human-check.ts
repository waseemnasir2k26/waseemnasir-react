import type { Block } from "./types";

export const body: Block[] = [
  {
    t: "lead",
    text: "When I design anything that talks to a customer, I follow one rule: the AI drafts, a person sends. I've settled on it after thinking about where the risk sits, and I want to lay out that reasoning so you can judge whether it fits your business.",
  },
  { t: "h2", text: "Why I design it this way" },
  {
    t: "p",
    text: "A language model writes fluent text whether or not it's right. That's useful for drafts and risky for anything final. It can miss that a customer is annoyed, state something about your policy that isn't true, or agree to a thing you'd never agree to. And when the message goes out, the customer sees your business name, not a model's.",
  },
  {
    t: "p",
    text: "Weigh that against the price of a check. Reading a short draft and tapping a button takes a few seconds. A wrong message can cost a customer, or leave you honouring a promise you never made. With stakes that lopsided, I don't need much convincing.",
  },
  { t: "h2", text: 'What "approve" looks like for a client' },
  {
    t: "p",
    text: "I try to make the check so light that nobody resents it. In the setups I build, the draft shows up where the owner or their team already works, with the customer's original message right beside it. They get three choices: send it as is, change a few words and send, or throw it away and write their own.",
  },
  {
    t: "p",
    text: "Anything the system isn't sure about goes to a named person instead of being guessed at. One person owns that queue, because a queue that belongs to everyone ends up belonging to nobody.",
  },
  { t: "h2", text: "\"But the models keep getting better\"" },
  {
    t: "p",
    text: "They do, and I use that. A better model means better drafts and fewer corrections. What it doesn't change is the shape of the risk. A model that's right nearly every time still has the occasional miss, and the miss tends to arrive on the one message where the customer is already unhappy or the stakes are high. I'd rather pay a few seconds of review on every draft than meet that miss unprepared.",
  },
  {
    t: "p",
    text: "There's a human side too. Staff who approve drafts learn what the system does well and where it stumbles, so they trust it for the right reasons. People who were handed a finished black box tend to either distrust it completely or stop looking at it at all.",
  },
  { t: "h2", text: "What I won't fully automate" },
  {
    t: "p",
    text: "This list is short and I don't negotiate on it. Refunds and credits. Complaints. Bad news of any kind. Anything involving health, legal matters or someone's money. Any message that commits the business to a price, a date or an exception. In those cases the system can gather the facts and prepare a draft, but the decision and the words belong to a person.",
  },
  {
    t: "p",
    text: "There's plenty I do let run alone. A fixed confirmation that you wrote yourself, such as a booking receipt, doesn't need a human in the loop, because no AI is improvising in it. Internal alerts can fire automatically too. The line is simple: if a model composes words a customer will read, someone approves them first.",
  },
  { t: "h2", text: "I plan for failure in every build" },
  {
    t: "p",
    text: "Things break. A connection drops, an input arrives in a shape nobody expected, a step times out. What I care about is what the customer experiences meanwhile. In my builds a failed step hands the message to a person, with a note on what went wrong. A loud failure costs you an annoying hour. A silent one can cost you a customer you never knew you lost.",
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

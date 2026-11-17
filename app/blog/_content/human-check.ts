import type { Block } from "./types";

export const body: Block[] = [
  {
    t: "lead",
    text: "There is one rule I do not bend when I build automations that deal with customer messages. The AI can write the reply. It never gets to send it alone.",
  },
  {
    t: "p",
    text: "People sometimes hear that as timid, or as a sign I do not trust the technology. It is neither. I use AI all day, and it is genuinely good at what it is good at. The rule comes from looking honestly at what each side costs.",
  },
  { t: "h2", text: "What AI is good at, and where it goes wrong" },
  {
    t: "p",
    text: "An AI model is very good at a first draft, and good at remembering the details of a conversation. It is also capable of being confidently wrong. It can sound cold when a customer is upset. It can promise something the business cannot deliver. And when a wrong message goes out, it is your name on it, not the AI's.",
  },
  {
    t: "p",
    text: "Now put the two costs side by side. The cost of checking is small: a draft arrives on your phone, you read it in a few seconds, and you tap approve. The cost of a single bad message can be a lost customer, a public complaint, or a promise you now have to keep. Set next to each other, the choice is easy.",
  },
  { t: "h2", text: "A small example" },
  {
    t: "p",
    text: "Say a customer writes in upset about a late delivery. An AI draft might open with a cheerful greeting and offer a discount nobody approved. That draft is not stupid. It is just doing what it does, which is producing something that sounds helpful.",
  },
  {
    t: "p",
    text: "A person reads it in two seconds, deletes the discount, and adds a real apology. That small edit is the difference between rescuing the customer and making them angrier. The AI saved the typing. The person kept the judgment.",
  },
  {
    t: "quote",
    text: "Customers rarely notice a good reply, but they never forget a bad one.",
  },
  { t: "h2", text: "This does not mean nothing is automatic" },
  {
    t: "p",
    text: "I am not saying every message needs a human. Fixed confirmations, like an appointment-booked note, can be plain templates that you wrote yourself, with no AI improvising anything. Internal alerts can go out automatically too.",
  },
  {
    t: "p",
    text: "The line I draw is simple. If an AI is writing words to a customer, a person approves them. Everything else can run on its own.",
  },
  { t: "h2", text: "What happens when something breaks" },
  {
    t: "p",
    text: "Every automation I build has a plan for failure, because it will fail one day. A service goes down, an input arrives in a shape nobody expected, a step times out. The question is what the customer experiences when it does.",
  },
  {
    t: "p",
    text: "My answer is that the customer still gets a response. If a step breaks, the message is routed to a person, and that person is told what went wrong. One owner, one inbox, one rule. Nothing is silently dropped. A system that fails loudly to a human is annoying for an hour. A system that fails silently can cost you someone's business for months before you notice.",
  },
  { t: "h2", text: "Send it your worst messages first" },
  {
    t: "p",
    text: "Before any of this goes live, I test it on the messages I would least like it to see. An angry customer. A message in another language. A blank one. A question it should not answer. Then I watch what it does, fix what breaks, and decide who gets alerted when it happens for real.",
  },
  {
    t: "p",
    text: "It is a little uncomfortable, but it is the cheapest testing you will ever do. You would much rather find out in a test that your system offers refunds to people who did not ask for one.",
  },
  { t: "h2", text: "It gets better over time" },
  {
    t: "p",
    text: "The part people do not expect is that the human check gets lighter, not heavier. When you fix a bad draft, you fix the instructions behind it once, and every future draft improves. After a few weeks of reading drafts, the edits become rare, and you know which kinds of messages you can trust and which you cannot. You keep control the whole time, and your customer keeps a person behind the message.",
  },
  {
    t: "p",
    text: "That is why I build it this way, and why I will keep building it this way even as the models get better.",
  },
];

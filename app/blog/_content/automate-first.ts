import type { Block } from "./types";

export const body: Block[] = [
  {
    t: "lead",
    text: "Owners tend to open with a wish list: a chatbot that knows the whole business, a dashboard with every number on it. I get it. Those are the things people see online. But when I start on a small business, the first build is usually dull, and I think that's the right call.",
  },
  {
    t: "p",
    text: "My order of work is leaks, then repeats, then reports. I'll take them one at a time.",
  },
  { t: "h2", text: "Leaks first" },
  {
    t: "p",
    text: "Every business has places where customers reach out and nobody catches them. A phone that rings while everyone is busy. A contact form wired to an address nobody opens. A message that arrives at night and gets answered the following afternoon, after the person has already talked to someone else.",
  },
  {
    t: "p",
    text: "Each of those is a lead that was already warm. Spending effort anywhere else before they're fixed makes little sense, because it's like decorating a shop with the front door open to the rain.",
  },
  {
    t: "p",
    text: "The fix is usually small. Make sure every inquiry is seen, acknowledged and routed to a person. If the system writes anything that a customer will read, someone on the team looks at it before it goes out. Nobody will applaud a build like this in a demo. You notice it on an ordinary Monday, when nothing got lost over the weekend.",
  },
  { t: "h2", text: "Repeats second" },
  {
    t: "p",
    text: "Next I look for work your team does the same way again and again: copying details between a spreadsheet and an inbox, sending the same nudge to a different person each day. These make good candidates because the steps are already settled and someone has shown they work.",
  },
  {
    t: "p",
    text: "I'm careful here. A process that's still being worked out shouldn't be automated yet, because the machine will just repeat your indecision faster. Let a person get it right first, then hand over the tedious part.",
  },
  { t: "h2", text: "Reports last" },
  {
    t: "p",
    text: "Everyone wants the dashboard first, and I understand why. But a report can only describe what's underneath it. If inquiries are still slipping through, a dashboard gives you a very clear picture of the slipping. Once the first two layers run, the numbers become worth trusting, and a weekly summary can replace the Sunday-night spreadsheet.",
  },
  { t: "h2", text: "Where I picked this up" },
  {
    t: "p",
    text: "Before I had my own company I worked inside accounting firms, with QuickBooks, payroll runs and spreadsheets that had grown into small unmaintained cities. Payroll by hand taught me that a lot of business work is copying more than thinking. Same figures moved from one sheet to another, every month, forever.",
  },
  {
    t: "p",
    text: "It also taught me that the costly problem is seldom the interesting one. It's whatever quietly fails every week while everyone is too busy to look.",
  },
  { t: "h2", text: "One build, then the next" },
  {
    t: "p",
    text: "Owners often ask for several automations at the same moment. I'd rather ship one. If five new things go live together and a customer complains, you can't tell which of them caused it, and your team has no time to learn to trust any of them. A shaky assumption in the first build also leaks into every build after it.",
  },
  {
    t: "p",
    text: "So I choose the single problem that hurts most and is easiest to see. For the first couple of weeks a person approves everything it produces, and I read along. I fix wording, spot odd cases, and learn how customers really write. Then we add the next piece on top of something the team already relies on. It feels slower at the start and turns out quicker by the end.",
  },
  { t: "h2", text: "A five-minute leak check you can do today" },
  {
    t: "p",
    text: "You don't need me for this. Open these four places and spend a minute on each:",
  },
  {
    t: "list",
    items: [
      "Your phone's call log for the past week. How many missed calls did you ring back, and how quickly?",
      "The inbox your website form sends to. Is it the right address, and does anyone check it?",
      "Your messages and email. Is anything still waiting on a reply after a full day?",
      "The quotes you've sent. Which ones went quiet with no follow-up?",
    ],
  },
  {
    t: "p",
    text: "Wherever you found something sitting there, that's your first build. It probably won't be the exciting one, and it'll probably be the one that matters.",
  },
];

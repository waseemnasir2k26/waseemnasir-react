/** Article body blocks for the founding articles (rendered by ../_article.tsx). */
export type Block =
  | { t: "lead"; text: string }
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "quote"; text: string }
  | { t: "list"; items: string[]; ordered?: boolean };

/** Optional FAQ for an article; rendered as a section and as FAQPage JSON-LD. */
export type Faq = { q: string; a: string };

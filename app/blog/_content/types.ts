/** Article body blocks for the founding articles (rendered by ../_article.tsx). */
export type Block =
  | { t: "lead"; text: string }
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "quote"; text: string };

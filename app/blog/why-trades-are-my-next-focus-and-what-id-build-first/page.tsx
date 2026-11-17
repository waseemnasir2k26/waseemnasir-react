import { ArticlePage, articleMetadata, otherPosts } from "../_article";
import { getPost } from "../posts";
import { body } from "../_content/trades";

const post = getPost("why-trades-are-my-next-focus-and-what-id-build-first")!;

export const metadata = articleMetadata(post);

export default function TradesPost() {
  return (
    <ArticlePage
      post={post}
      body={body}
      related={[
        ...otherPosts(post.slug),
        [
          "/inbox-ops",
          "Inbox Ops Autopilot: a map for a mailbox that sorts itself",
        ],
        ["/book", "Book a free 30-minute automation audit"],
      ]}
    />
  );
}

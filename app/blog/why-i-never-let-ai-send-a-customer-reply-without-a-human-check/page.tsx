import { ArticlePage, articleMetadata, otherPosts } from "../_article";
import { getPost } from "../posts";
import { body } from "../_content/human-check";

const post = getPost("why-i-never-let-ai-send-a-customer-reply-without-a-human-check")!;

export const metadata = articleMetadata(post);

export default function HumanCheckPost() {
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

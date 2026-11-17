import { ArticlePage, articleMetadata, otherPosts } from "../_article";
import { getPost } from "../posts";
import { body } from "../_content/automate-first";

const post = getPost("what-i-automate-first-in-a-small-business")!;

export const metadata = articleMetadata(post);

export default function AutomatePost() {
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

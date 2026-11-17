import { ArticlePage, articleMetadata, otherPosts } from "../_article";
import { getPost } from "../posts";
import { body, faq } from "../_content/free-n8n-workflows";

const post = getPost("why-i-publish-my-n8n-workflows-for-free")!;

export const metadata = articleMetadata(post);

export default function FreeWorkflowsPost() {
  return (
    <ArticlePage
      post={post}
      body={body}
      faq={faq}
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

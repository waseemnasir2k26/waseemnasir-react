import { ArticlePage, articleMetadata, otherPosts } from "../_article";
import { getPost } from "../posts";
import { body } from "../_content/claude-code-setup";

const post = getPost("my-claude-code-setup-for-client-work")!;

export const metadata = articleMetadata(post);

export default function ClaudeCodeSetupPost() {
  return (
    <ArticlePage
      post={post}
      body={body}
      related={[
        ...otherPosts(post.slug),
        ["/mentorship", "1:1 Claude Code mentorship"],
        ["/book", "Book a free 30-minute automation audit"],
      ]}
    />
  );
}

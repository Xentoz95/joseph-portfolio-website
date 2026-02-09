---
memoryVersion: 1
schemaVersion: 1
storyId: US-004
storyTitle: Blog System with Markdown Support
feature: Portfolio CMS
completedDate: 2026-02-06
agents: development-agent
---

# Story US-004: Blog System with Markdown Support

## Implemented

### Packages Installed:
- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub Flavored Markdown support
- `rehype-highlight` - Syntax highlighting for code blocks
- `rehype-raw` - HTML in Markdown support

### Files Created:
1. **`app/blog/page.tsx`** - Blog listing page (282 lines)
   - Server component fetching all posts from Supabase
   - Tag filtering via URL params (?tag=web)
   - Search functionality (?search=query)
   - Post cards with cover images, tags, reading time
   - Filter buttons for all tags
   - Active filters display with remove buttons
   - Empty state handling

2. **`app/blog/[slug]/page.tsx`** - Individual blog post pages (300 lines)
   - Dynamic routing by slug
   - Fetches single post from Supabase
   - SEO metadata with Open Graph and Twitter Cards
   - Cloudinary optimized cover images
   - Related posts section (by tags)
   - Tag cloud for exploration
   - Share functionality (Web Share API)
   - Back to blog button

3. **`components/blog/markdown-renderer.tsx`** - Markdown renderer component (365 lines)
   - Custom components for all Markdown elements
   - Syntax highlighting for code blocks
   - Copy code button with feedback
   - Custom link component (external/internal handling)
   - Custom image component (Cloudinary optimization)
   - Styled headings, paragraphs, lists, tables
   - `calculateReadingTime()` utility function
   - Support for GFM (tables, strikethrough, task lists)

### Data Layer
**`lib/supabase/posts.ts`** with 10 functions:
- `getPosts({ limit, offset })` - Fetch all published posts
- `getPostBySlug(slug)` - Fetch single post
- `getAllPostTags()` - Get all unique tags
- `getPostsByTag(tag)` - Filter by tag
- `searchPosts(query)` - Full-text search in title, excerpt, tags
- `getRelatedPosts(currentSlug, tags, limit)` - Find related posts
- `createPost(post)` - Create new post (admin)
- `updatePost(slug, updates)` - Update post (admin)
- `deletePost(slug)` - Delete post (admin)

## Architecture Decisions

- **Server Components** for data fetching (better performance, SEO)
- **React Markdown** for client-side rendering
- **Supabase** for content storage
- **Cloudinary** for optimized image delivery
- **Markdown in database** (content stored as text, not files)

## UI/UX Patterns

- Tag filter with visual feedback
- Search in URL params (shareable links)
- Reading time calculation (200 words/min)
- Related posts based on shared tags
- Copy code button with visual feedback
- Share button for mobile

## Integration Points

- `@/lib/supabase/posts` - All post queries
- `@/components/optimized-image` - Cloudinary images
- `@/components/blog/markdown-renderer` - Markdown rendering
- `@/types/database` - Post types
- `app/blog/` - New pages for blog

## Tech Stack

- **React Markdown** - Markdown parsing and rendering
- **remark-gfm** - GitHub Flavored Markdown
- **rehype-highlight** - Code syntax highlighting
- **rehype-raw** - HTML in Markdown

## Lessons Learned

- Markdown should be stored in database, not files
- Reading time calculation: word count / 200
- Related posts should exclude current post
- Syntax highlighting requires CSS (highlight.js theme)
- Copy button improves developer experience
- Custom Markdown components allow full styling control

## Best Practices Established

- Use Server Components for content pages
- Implement proper SEO for dynamic blog pages
- Store content as Markdown in database
- Calculate reading time dynamically
- Show related posts for engagement
- Handle 404s gracefully for missing posts

## RSS Feed (Not Yet Implemented)

The acceptance criteria mentioned RSS feed generation - this was not implemented.
Can be added later using `rss` package or by generating XML manually.

## Next Steps

1. US-005: Contact Form with Database Storage
2. Create some sample blog posts in Supabase
3. Consider adding RSS feed generation
4. Add Web Share API fallback for desktop

## Commit
feat: add blog system with markdown support

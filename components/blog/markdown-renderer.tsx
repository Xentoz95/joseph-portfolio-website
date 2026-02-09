/**
 * Markdown Renderer Component
 *
 * Renders Markdown content with support for:
 * - GitHub Flavored Markdown (GFM)
 * - Syntax highlighting for code blocks
 * - HTML in Markdown
 * - Custom styling for links, images, and code
 */

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { buildCloudinaryUrl } from '@/lib/cloudinary-helpers';
import Image from 'next/image';
import Link from 'next/link';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Custom link component that handles external links
 */
function CustomLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (typeof href !== 'string') {
    return <a {...props}>{children}</a>;
  }

  const isExternal = href.startsWith('http');

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline font-medium"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="text-primary hover:underline font-medium"
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Custom image component that uses Cloudinary optimization
 */
function CustomImage({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (typeof src !== 'string' || !alt) {
    return <img src={src || ''} alt={alt || ''} {...props} />;
  }

  // Check if it's a Cloudinary image
  const isCloudinary = src.includes('cloudinary.com') || !src.startsWith('http');
  const imageSrc = isCloudinary && !src.startsWith('http')
    ? buildCloudinaryUrl(src, {
        width: 800,
        quality: 85,
        format: 'auto',
      })
    : src;

  return (
    <div className="relative w-full my-6 rounded-lg overflow-hidden bg-muted">
      <Image
        src={imageSrc}
        alt={alt}
        width={800}
        height={450}
        className="w-full h-auto object-cover"
        sizes="(max-width: 768px) 100vw, 800px"
      />
    </div>
  );
}

/**
 * Code block with copy button
 */
function CodeBlock({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const codeElement = (children as React.ReactElement & { props: { children: string } })?.props?.children;
    if (typeof codeElement === 'string') {
      await navigator.clipboard.writeText(codeElement);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Check if this is a code block with language
  const language = className?.replace(/language-/, '');
  const isCodeBlock = language !== undefined;

  if (!isCodeBlock) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-6">
      {language && (
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-background border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
      )}
      <pre
        className={`${className} !bg-[#0d1117] !p-4 rounded-lg overflow-x-auto border border-border/50`}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

/**
 * Custom components for Markdown rendering
 */
const components = {
  a: CustomLink,
  img: CustomImage,
  pre: CodeBlock,
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={className}
      style={{
        fontSize: '2.25rem',
        fontWeight: '700',
        marginTop: '2rem',
        marginBottom: '1rem',
        lineHeight: '1.2',
        scrollMarginTop: '5rem',
      }}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={className}
      style={{
        fontSize: '1.875rem',
        fontWeight: '600',
        marginTop: '2rem',
        marginBottom: '0.75rem',
        lineHeight: '1.3',
        scrollMarginTop: '5rem',
      }}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={className}
      style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        marginTop: '1.5rem',
        marginBottom: '0.5rem',
        lineHeight: '1.4',
        scrollMarginTop: '5rem',
      }}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={className}
      style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        marginTop: '1.25rem',
        marginBottom: '0.5rem',
        lineHeight: '1.4',
        scrollMarginTop: '5rem',
      }}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={className}
      style={{
        fontSize: '1rem',
        lineHeight: '1.75',
        marginTop: '0',
        marginBottom: '1rem',
      }}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={className}
      style={{
        paddingLeft: '1.5rem',
        marginTop: '1rem',
        marginBottom: '1rem',
        listStyleType: 'disc',
      }}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={className}
      style={{
        paddingLeft: '1.5rem',
        marginTop: '1rem',
        marginBottom: '1rem',
        listStyleType: 'decimal',
      }}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className={className}
      style={{
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
        paddingLeft: '0.5rem',
      }}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={`${className} border-l-4 border-primary/30 pl-4 py-1 my-4 italic text-muted-foreground bg-accent/50 rounded-r`}
      {...props}
    />
  ),
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr
      className={`${className} my-8 border-border/50`}
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto">
      <table
        className={`${className} min-w-full divide-y divide-border/50 border border-border/50 rounded-lg`}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={className} {...props} />
  ),
  tbody: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className={className} {...props} />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={`${className} divide-x divide-border/30`} {...props} />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={`${className} px-4 py-3 text-left text-sm font-semibold bg-muted/50`}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={`${className} px-4 py-3 text-sm`}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className?.includes('hljs');
    if (isInline) {
      return (
        <code
          className={`${className} bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary/90`}
          {...props}
        />
      );
    }
    return <code className={className} {...props} />;
  },
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <strong className={`${className} font-semibold text-foreground`} {...props} />
  ),
  em: ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <em className={`${className} italic`} {...props} />
  ),
};

/**
 * Main Markdown renderer component
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Calculate reading time from Markdown content
 *
 * @param content - The Markdown content
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Seed Script: Blog Posts
 *
 * Run this after database setup to add sample blog posts.
 * Command: npx tsx scripts/seed-blog-posts.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
function loadEnvFile() {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.warn('Could not load .env.local file:', error);
  }
}

loadEnvFile();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Sample blog posts
const blogPosts = [
  {
    title: 'Building Modern Dashboards with Next.js and Chart.js',
    slug: 'building-modern-dashboards-nextjs-chartjs',
    excerpt: 'Learn how to create interactive, real-time dashboards using Next.js, Chart.js, and Supabase for data visualization.',
    content: `# Building Modern Dashboards with Next.js and Chart.js

Dashboards are essential tools for businesses to visualize data and make informed decisions. In this article, I'll walk you through building a modern, responsive dashboard using Next.js and Chart.js.

## Why Next.js for Dashboards?

Next.js provides several advantages for dashboard development:

- **Server-Side Rendering (SSR)**: Fast initial page loads
- **API Routes**: Easy backend integration
- **React Server Components**: Reduced client-side JavaScript
- **Excellent TypeScript Support**: Type-safe development

## Setting Up the Project

\`\`\`bash
npx create-next-app@latest my-dashboard
cd my-dashboard
npm install chart.js react-chartjs-2
\`\`\`

## Creating Your First Chart

Here's a simple example of a sales chart component:

\`\`\`typescript
'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function SalesChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [12000, 19000, 15000, 22000, 18000, 25000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return <Line data={data} />;
}
\`\`\`

## Best Practices

1. **Use memoization** for expensive calculations
2. **Implement lazy loading** for charts
3. **Add loading states** for better UX
4. **Use WebSockets** for real-time data

## Conclusion

Building dashboards with Next.js and Chart.js gives you a powerful, flexible foundation for data visualization. The combination of server-side rendering and interactive charts creates a great user experience.

Happy coding!`,
    tags: ['Next.js', 'Chart.js', 'Dashboard', 'Tutorial'],
    published: true,
    cover_image: null,
  },
  {
    title: 'Microsoft Access vs Web Applications: When to Use Each',
    slug: 'microsoft-access-vs-web-applications',
    excerpt: 'A practical guide to choosing between Microsoft Access and custom web applications for your business systems.',
    content: `# Microsoft Access vs Web Applications: When to Use Each

As a developer who has built numerous business systems, I often get asked: "Should I use Microsoft Access or build a web application?" The answer depends on several factors.

## When Microsoft Access Shines

Microsoft Access is excellent for:

### 1. Small to Medium Datasets
- Up to 2GB of data
- 10-20 concurrent users
- Local network deployment

### 2. Rapid Development
- Drag-and-drop form builder
- Built-in reporting
- VBA for automation

### 3. Familiar Environment
- Part of Microsoft Office
- Easy to train users
- Quick prototyping

## When to Choose Web Applications

Web applications are better for:

### 1. Scalability
- Unlimited users
- Cloud deployment
- Global accessibility

### 2. Modern UI/UX
- Responsive design
- Mobile support
- Modern interfaces

### 3. Integration
- REST APIs
- Third-party services
- Real-time updates

## My Recommendation

| Scenario | Recommended Solution |
|----------|---------------------|
| Internal tool, <20 users | Microsoft Access |
| Customer-facing system | Web Application |
| Need mobile access | Web Application |
| Quick prototype | Microsoft Access |
| Long-term scaling | Web Application |

## Conclusion

Both tools have their place. Microsoft Access is perfect for quick internal tools, while web applications offer better scalability and accessibility. Choose based on your specific needs.

Need help deciding? [Contact me](/contact) to discuss your project. `,
    tags: ['Microsoft Access', 'Web Development', 'Business Systems', 'Comparison'],
    published: true,
    cover_image: null,
  },
  {
    title: 'Creating a Design System from Scratch',
    slug: 'creating-design-system-from-scratch',
    excerpt: 'A step-by-step guide to building a cohesive design system that scales across your projects.',
    content: `# Creating a Design System from Scratch

A design system is more than a component library—it's a collection of reusable components, guidelines, and standards that ensure consistency across your products.

## Why Build a Design System?

### Benefits
- **Consistency**: Same look and feel everywhere
- **Efficiency**: Build once, use everywhere
- **Maintainability**: Update in one place
- **Collaboration**: Shared language for teams

## Step 1: Define Your Design Tokens

Design tokens are the visual design atoms of your system:

\`\`\`css
:root {
  /* Colors */
  --color-primary: #ff7f3f;
  --color-secondary: #6366f1;
  --color-background: #ffffff;
  --color-foreground: #0f172a;

  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-8: 2rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}
\`\`\`

## Step 2: Build Base Components

Start with atomic components:

### Button Component

\`\`\`typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant, size, children }: ButtonProps) {
  return (
    <button className={\`btn btn-\${variant} btn-\${size}\`}>
      {children}
    </button>
  );
}
\`\`\`

## Step 3: Document Everything

Good documentation includes:
- Usage guidelines
- Props/API reference
- Code examples
- Do's and Don'ts

## Tools I Recommend

- **Figma**: Design and prototyping
- **Storybook**: Component documentation
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built accessible components

## Conclusion

A design system is an investment that pays off as your project grows. Start small, iterate, and always prioritize consistency.

Check out my [Fintech UI System project](/projects/fintech-ui-system) to see a design system in action.`,
    tags: ['Design System', 'UI/UX', 'Figma', 'Tutorial'],
    published: true,
    cover_image: null,
  },
  {
    title: '5 Excel VBA Tricks Every Business Should Know',
    slug: 'excel-vba-tricks-for-business',
    excerpt: 'Automate your Excel workflows with these powerful VBA techniques that save hours of manual work.',
    content: `# 5 Excel VBA Tricks Every Business Should Know

Excel VBA (Visual Basic for Applications) is a powerful tool for automating repetitive tasks. Here are 5 tricks I use regularly to save clients hours of work.

## 1. Automatic Email Reports

Send reports automatically via Outlook:

\`\`\`vba
Sub SendReportEmail()
    Dim OutApp As Object
    Dim OutMail As Object

    Set OutApp = CreateObject("Outlook.Application")
    Set OutMail = OutApp.CreateItem(0)

    With OutMail
        .To = "manager@company.com"
        .Subject = "Weekly Report - " & Format(Date, "mm/dd/yyyy")
        .Body = "Please find attached the weekly report."
        .Attachments.Add ActiveWorkbook.FullName
        .Send
    End With

    Set OutMail = Nothing
    Set OutApp = Nothing
End Sub
\`\`\`

## 2. Data Validation Automation

Automatically validate and clean data:

\`\`\`vba
Sub ValidateData()
    Dim ws As Worksheet
    Set ws = ActiveSheet

    ' Remove duplicates
    ws.Range("A:A").RemoveDuplicates Columns:=1

    ' Trim whitespace
    Dim cell As Range
    For Each cell In ws.Range("B2:B100")
        If cell.Value <> "" Then
            cell.Value = Trim(cell.Value)
        End If
    Next cell
End Sub
\`\`\`

## 3. Create Pivot Tables Automatically

Generate pivot tables with code:

\`\`\`vba
Sub CreatePivotTable()
    Dim ws As Worksheet
    Dim pvtCache As PivotCache
    Dim pvt As PivotTable

    Set ws = ActiveSheet
    Set pvtCache = ActiveWorkbook.PivotCaches.Create( _
        SourceType:=xlDatabase, _
        SourceData:=ws.Range("A1:E100"))

    Set pvt = pvtCache.CreatePivotTable( _
        TableDestination:=ws.Range("G1"), _
        TableName:="SalesPivot")
End Sub
\`\`\`

## 4. Import Data from Multiple Files

Combine data from multiple Excel files:

\`\`\`vba
Sub CombineFiles()
    Dim folderPath As String
    Dim fileName As String
    Dim sourceWB As Workbook

    folderPath = "C:\\Reports\\"
    fileName = Dir(folderPath & "*.xlsx")

    Do While fileName <> ""
        Set sourceWB = Workbooks.Open(folderPath & fileName)
        ' Copy data logic here
        sourceWB.Close False
        fileName = Dir
    Loop
End Sub
\`\`\`

## 5. Create Custom Functions

Build your own Excel functions:

\`\`\`vba
Function CalculateTax(amount As Double, rate As Double) As Double
    CalculateTax = amount * rate
End Function
\`\`\`

Use in Excel: \`=CalculateTax(A1, 0.16)\`

## Conclusion

These VBA tricks can transform how your business uses Excel. Need custom Excel solutions? [Get in touch](/contact) to discuss automation for your workflows.`,
    tags: ['Excel', 'VBA', 'Automation', 'Tutorial'],
    published: true,
    cover_image: null,
  },
  {
    title: 'Getting Started with Supabase for Next.js Projects',
    slug: 'supabase-nextjs-getting-started',
    excerpt: 'A complete guide to setting up Supabase with Next.js for authentication, database, and real-time features.',
    content: `# Getting Started with Supabase for Next.js Projects

Supabase is an open-source Firebase alternative that provides a PostgreSQL database, authentication, and real-time features. Here's how to integrate it with Next.js.

## Why Supabase?

- **PostgreSQL**: Full relational database
- **Real-time**: Live updates out of the box
- **Auth**: Built-in authentication
- **Storage**: File uploads made easy
- **Edge Functions**: Serverless functions

## Installation

\`\`\`bash
npm install @supabase/supabase-js @supabase/ssr
\`\`\`

## Setting Up the Client

Create a Supabase client for server components:

\`\`\`typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle cookie errors
          }
        },
      },
    }
  )
}
\`\`\`

## Fetching Data

\`\`\`typescript
// In a Server Component
import { createClient } from '@/lib/supabase/server'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <ul>
      {projects?.map((project) => (
        <li key={project.id}>{project.title}</li>
      ))}
    </ul>
  )
}
\`\`\`

## Real-time Subscriptions

\`\`\`typescript
'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export function RealtimeProjects() {
  const [projects, setProjects] = useState([])
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          console.log('Change received!', payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return <div>{/* Render projects */}</div>
}
\`\`\`

## Row Level Security

Always enable RLS for security:

\`\`\`sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read for published projects
CREATE POLICY "Public read access"
ON projects FOR SELECT
USING (published_at IS NOT NULL);
\`\`\`

## Conclusion

Supabase + Next.js is a powerful combination for modern web applications. The serverless architecture scales automatically and the developer experience is excellent.

Check out my [projects](/projects) to see Supabase in action!`,
    tags: ['Supabase', 'Next.js', 'Database', 'Tutorial'],
    published: true,
    cover_image: null,
  },
];

async function seedBlogPosts() {
  console.log('=== Seeding Blog Posts ===\n');

  let inserted = 0;
  let skipped = 0;
  let errors: string[] = [];

  for (const post of blogPosts) {
    try {
      // Check if post already exists
      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', post.slug)
        .single();

      if (existing) {
        console.log(`Skipping "${post.title}" - already exists`);
        skipped++;
        continue;
      }

      // Insert post
      const { error } = await supabase
        .from('posts')
        .insert({
          ...post,
          published_at: post.published ? new Date().toISOString() : null,
        });

      if (error) {
        throw new Error(error.message);
      }

      console.log(`Inserted "${post.title}"`);
      inserted++;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${post.slug}: ${message}`);
      console.error(`Error inserting "${post.title}": ${message}`);
    }
  }

  console.log('\n=== Results ===');
  console.log(`Inserted: ${inserted}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\nError details:');
    errors.forEach((e) => console.log(`  - ${e}`));
    process.exit(1);
  }
}

seedBlogPosts();

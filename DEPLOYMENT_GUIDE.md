# Deploy Joseph's Portfolio Website to GitHub

## Step 1: Create the GitHub Repository

1. Go to https://github.com/new
2. Repository name: `joseph-portfolio-website`
3. Description: `Joseph Thuo's Professional Portfolio Website - Full Stack Developer`
4. Select **Public**
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

## Step 2: Push to GitHub

Once the repository is created, run these commands in your terminal:

```bash
cd C:\Users\Joseph\Documents\GitHub\joseph-portfolio-website
git remote add origin https://github.com/Xentoz95/joseph-portfolio-website.git
git push -u origin main
```

## Step 3: Deploy to Vercel (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository: `Xentoz95/joseph-portfolio-website`
3. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build` (or `pnpm build`)
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
5. Click "Deploy"

## Repository Location

Your new portfolio repository is at:
`C:\Users\Joseph\Documents\GitHub\joseph-portfolio-website`

This is a clean repository with no conflicts from the old one.

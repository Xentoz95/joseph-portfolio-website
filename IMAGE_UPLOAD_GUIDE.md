# Image Upload Guide for Joseph Thuo Portfolio

## Quick Summary

This guide explains how to add new images to your portfolio website without coding.

---

## Where to Add Images

### 1. Profile Images
Place profile photos in:
```
public/images/profile/
```

### 2. Brand Images (Logo, Mockups, etc.)
Place brand assets in:
```
public/images/brand/
```

### 3. Project Images
Place project screenshots in:
```
public/images/projects/[project-name]/
```

---

## How to Upload Images

### Method 1: Direct File Upload (Recommended)

1. **Copy your image file** (JPG, PNG, SVG, or WebP)
2. **Go to the folder** on your computer
3. **Navigate to** `public/images/` in the project
4. **Create a new folder** if needed (e.g., `new-project`)
5. **Paste or drag** your image file there

### Method 2: Using GitHub Desktop

1. Open GitHub Desktop
2. Select the `joseph-portfolio-website` repository
3. Click "Changes" tab
4. You should see your new images in the file list
5. Add a commit message like "Added new project images"
6. Click "Commit to main"
7. Click "Push origin" to publish

### Method 3: Using VS Code

1. Open the project in VS Code
2. Navigate to `public/images/` in the Explorer
3. Right-click → "New Folder" or "New File"
4. Drag and drop your images
5. Commit and push changes

---

## Cloudinary Image Upload (For Dynamic Content)

Your website has Cloudinary integrated. To upload images via Cloudinary:

### Step 1: Log in to Cloudinary
- Go to [cloudinary.com](https://cloudinary.com)
- Use your account credentials

### Step 2: Upload Your Image
1. Click "Media Library"
2. Click "Upload" button
3. Select your image file
4. Copy the "Delivery URL" after upload

### Step 3: Use the URL
Replace image URLs in the code with your Cloudinary URL:
```
https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/your-image.jpg
```

---

## Image Size Guidelines

| Type | Recommended Size | Format |
|------|-----------------|--------|
| Profile/Hero | 800x1000px minimum | JPG or WebP |
| Project Thumbnails | 400x300px | JPG or WebP |
| Project Gallery | 1200x800px | JPG or WebP |
| Logo | 200x200px (transparent) | PNG or SVG |
| Brand Mockups | 1920x1080px | PNG or JPG |

---

## Updating Project Images

### To add a new project:

1. **Add images** to `public/images/projects/your-project-name/`

2. **Update** `data/projects.ts`:
```typescript
{
  id: 'your-project-id',
  slug: 'your-project-slug',
  title: 'Your Project Title',
  description: 'Brief description',
  images: {
    thumbnail: '/images/projects/your-project-name/thumb.jpg',
    hero: '/images/projects/your-project-name/hero.jpg',
    gallery: [
      '/images/projects/your-project-name/1.jpg',
      '/images/projects/your-project-name/2.jpg',
    ],
    alt: 'Project description',
  },
  // ... other fields
}
```

---

## Adding Images to Pages

### Hero Section (Homepage)
File: `components/hero.tsx`
```tsx
<Image
  src="/images/your-folder/your-image.jpg"
  alt="Description"
  fill
  className="object-cover"
/>
```

### About Section
File: `components/about.tsx`
```tsx
<Image
  src="/images/your-folder/your-image.jpg"
  alt="Description"
  fill
  sizes="(max-width: 1024px) 100vw, 50vw"
/>
```

---

## Need Help?

If you need to add new sections or change image placement, contact your developer or create an issue with:
- The image you want to add
- Where you want it placed
- What it should look like

---

## Color Palette (Orange, White, Black)

- Primary: Orange (#FF6B00 type)
- Background: White/Black
- Text: Black/White

When adding images, ensure they complement this color scheme.

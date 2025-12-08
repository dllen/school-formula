# GitHub Pages Deployment Setup

## What Was Added

### 1. GitHub Actions Workflow
Created [.github/workflows/deploy.yml](file:///Users/shichaopeng/Work/self-dir/school-formula/.github/workflows/deploy.yml)

**Triggers:**
- Automatic deployment on push to `main` branch
- Manual deployment via GitHub Actions UI

**What it does:**
1. Checks out code
2. Sets up Node.js 20
3. Installs dependencies
4. Builds the project
5. Uploads build to GitHub Pages
6. Deploys to GitHub Pages

### 2. Vite Configuration Update
Updated [vite.config.ts](file:///Users/shichaopeng/Work/self-dir/school-formula/vite.config.ts) with:
```typescript
base: '/school-formula/',
```

This ensures assets load correctly when deployed to `https://username.github.io/school-formula/`

## Setup Instructions

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### Step 2: Enable GitHub Pages
1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically run on the next push

### Step 3: Access Your Site
After deployment completes, your site will be available at:
```
https://[your-username].github.io/school-formula/
```

## Build Verification
✅ Build successful with base path configured  
✅ All assets will load correctly on GitHub Pages

## Notes
- The `base` path in `vite.config.ts` assumes repository name is `school-formula`
- If your repository has a different name, update the base path accordingly
- First deployment may take a few minutes

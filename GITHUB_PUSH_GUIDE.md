# GitHub Push Guide for WraithWeave

## Pre-Push Checklist

✅ `.gitignore` updated (excludes node_modules, dist, videos, recordings)
✅ README.md ready (terror-first version)
✅ DEMO_GUIDE.md present
✅ LICENSE file present
✅ All source code in `/src`
✅ All Kiro files in `/.kiro`
✅ Test files included
✅ Configuration files present

## Step-by-Step Push Instructions

### 1. Navigate to the Project Root

```bash
cd wraithweave-core
```

**Important:** Push from `wraithweave-core`, NOT the outer folder!

### 2. Initialize Git (if not already done)

```bash
git init
```

### 3. Add Remote Repository

```bash
git remote add origin https://github.com/AB2511/wraithweave-hr-radio.git
```

If you already have a remote, update it:
```bash
git remote set-url origin https://github.com/AB2511/wraithweave-hr-radio.git
```

### 4. Check What Will Be Committed

```bash
git status
```

Verify that `node_modules/` is NOT listed (should be ignored).

### 5. Add All Files

```bash
git add .
```

### 6. Verify What's Staged

```bash
git status
```

You should see:
- ✅ `.kiro/` directory
- ✅ `src/` directory
- ✅ `public/` directory
- ✅ `README.md`
- ✅ `DEMO_GUIDE.md`
- ✅ `LICENSE`
- ✅ `package.json`
- ✅ `vite.config.js`
- ✅ `vitest.config.js`
- ✅ Test files
- ✅ Configuration files
- ❌ `node_modules/` (should NOT appear)
- ❌ `dist/` (should NOT appear)

### 7. Commit Your Changes

```bash
git commit -m "Initial commit: WraithWeave HR Radio - Psychological horror speech interruption system"
```

Or use a more detailed commit message:
```bash
git commit -m "feat: Complete WraithWeave implementation

- Real-time speech recognition with Chrome/Edge support
- Mid-sentence interruption system
- 6-tier HR escalation
- Synchronized horror effects
- Comprehensive test suite (24 tests)
- Production-ready demo"
```

### 8. Push to GitHub

For the first push:
```bash
git push -u origin main
```

If your default branch is `master`:
```bash
git push -u origin master
```

Or create and push to a new branch:
```bash
git checkout -b main
git push -u origin main
```

### 9. Verify on GitHub

Visit: https://github.com/AB2511/wraithweave-hr-radio

Check that:
- ✅ All folders are present
- ✅ README displays correctly
- ✅ No `node_modules/` folder
- ✅ File structure matches expected layout

## Expected Repository Structure

```
/wraithweave-hr-radio
├── .gitignore
├── .kiro/
│   ├── hooks/
│   ├── specs/
│   ├── steering/
│   ├── vibe_transcripts/
│   └── README.md
├── src/
│   ├── assets/
│   ├── components/
│   ├── lib/
│   ├── test/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
│   └── vite.svg
├── DEMO_GUIDE.md
├── eslint.config.js
├── index.html
├── LICENSE
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
├── SPEECH_RECOGNITION_TEST.md
├── tailwind.config.js
├── test-speech.html
├── vite.config.js
└── vitest.config.js
```

## Troubleshooting

### If you accidentally committed node_modules:

```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules from tracking"
git push
```

### If you need to force push (use carefully):

```bash
git push -f origin main
```

### If you have merge conflicts:

```bash
git pull origin main --rebase
# Resolve conflicts
git add .
git rebase --continue
git push
```

### To check remote URL:

```bash
git remote -v
```

## Post-Push Tasks

1. ✅ Add repository description on GitHub
2. ✅ Add topics/tags: `horror`, `ai`, `speech-recognition`, `react`, `vite`
3. ✅ Enable GitHub Pages (if you want to host the demo)
4. ✅ Add a demo video/GIF to the README
5. ✅ Create a release tag for the contest submission

## Creating a Release

```bash
git tag -a v1.0.0 -m "Kiroween Contest Submission"
git push origin v1.0.0
```

Then create a release on GitHub with:
- Release title: "WraithWeave v1.0.0 - Kiroween Contest Submission"
- Description: Copy from README
- Attach demo video/screenshots

## Quick Commands Reference

```bash
# Check status
git status

# View commit history
git log --oneline

# View remote
git remote -v

# Pull latest changes
git pull origin main

# Push changes
git push origin main

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

## Need Help?

If you encounter issues:
1. Check `.gitignore` is working: `git check-ignore node_modules`
2. Verify remote: `git remote -v`
3. Check branch: `git branch`
4. View what's staged: `git diff --cached --name-only`

---

**Ready to push? Start with Step 1!**
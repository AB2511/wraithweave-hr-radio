# Quick Start: Push to GitHub

## 🎯 Goal
Push WraithWeave to: https://github.com/AB2511/wraithweave-hr-radio.git

## ⚡ Fastest Method (Windows)

1. Open Command Prompt or PowerShell
2. Navigate to project:
   ```bash
   cd path\to\wraithweave-core
   ```
3. Run the automated script:
   ```bash
   push-to-github.bat
   ```
4. Follow the prompts
5. Done! ✅

## ⚡ Fastest Method (Mac/Linux)

1. Open Terminal
2. Navigate to project:
   ```bash
   cd path/to/wraithweave-core
   ```
3. Make script executable and run:
   ```bash
   chmod +x push-to-github.sh
   ./push-to-github.sh
   ```
4. Follow the prompts
5. Done! ✅

## 📝 Manual Method (All Platforms)

```bash
# 1. Navigate to project
cd wraithweave-core

# 2. Initialize git (if needed)
git init

# 3. Add remote
git remote add origin https://github.com/AB2511/wraithweave-hr-radio.git

# 4. Add all files
git add .

# 5. Commit
git commit -m "feat: Complete WraithWeave implementation"

# 6. Push
git push -u origin main
```

## ✅ What Gets Pushed

**INCLUDED:**
- ✅ All source code (`/src`)
- ✅ All Kiro files (`/.kiro`)
- ✅ README.md (terror-first version)
- ✅ DEMO_GUIDE.md
- ✅ LICENSE
- ✅ Test files
- ✅ Configuration files
- ✅ package.json

**EXCLUDED (via .gitignore):**
- ❌ node_modules/
- ❌ dist/
- ❌ Video files (*.mp4, *.webm, etc.)
- ❌ Audio recordings (*.wav, *.m4a)
- ❌ Log files

## 🔍 Quick Verification

After pushing, check:
1. Visit: https://github.com/AB2511/wraithweave-hr-radio
2. Verify folders: `.kiro/`, `src/`, `public/`
3. Check README displays correctly
4. Confirm NO `node_modules/` folder

## 🆘 Troubleshooting

**Problem:** "node_modules in git status"
```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules"
git push
```

**Problem:** "Authentication failed"
- Use GitHub Personal Access Token
- Or set up SSH key

**Problem:** "Push rejected"
```bash
git pull origin main --rebase
git push origin main
```

## 📚 More Help

- **Detailed Guide:** See `GITHUB_PUSH_GUIDE.md`
- **Checklist:** See `PRE_PUSH_CHECKLIST.md`
- **Test Docs:** See `SPEECH_RECOGNITION_TEST.md`

## 🎉 After Successful Push

1. Add repository description on GitHub
2. Add topics: `horror`, `ai`, `speech-recognition`, `react`, `vite`
3. Upload demo video/GIF
4. Create release v1.0.0 for contest
5. Share the link!

---

**Ready? Pick your method above and push! 🚀**
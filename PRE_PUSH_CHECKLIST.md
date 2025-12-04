# Pre-Push Checklist for WraithWeave

## ✅ Files Verification

### Core Files (MUST HAVE)
- [x] `README.md` - Terror-first version present
- [x] `DEMO_GUIDE.md` - Demo instructions present
- [x] `LICENSE` - License file present
- [x] `package.json` - Dependencies listed
- [x] `package-lock.json` - Lock file present

### Configuration Files
- [x] `.gitignore` - Updated with exclusions
- [x] `vite.config.js` - Vite configuration
- [x] `vitest.config.js` - Test configuration
- [x] `eslint.config.js` - ESLint configuration
- [x] `tailwind.config.js` - Tailwind configuration
- [x] `postcss.config.js` - PostCSS configuration

### Source Code
- [x] `src/` directory with all components
- [x] `src/components/` - All React components
- [x] `src/lib/` - All library files
- [x] `src/test/` - Test setup files
- [x] `src/App.jsx` - Main app component
- [x] `src/main.jsx` - Entry point

### Kiro Directory
- [x] `.kiro/` directory present
- [x] `.kiro/specs/` - Specification files
- [x] `.kiro/hooks/` - Hook configurations
- [x] `.kiro/steering/` - Steering files
- [x] `.kiro/vibe_transcripts/` - Vibe transcripts
- [x] `.kiro/README.md` - Kiro documentation

### Test Files
- [x] `src/lib/speechRecognition.test.js` - Speech recognition tests
- [x] `src/components/VoiceRecorder.test.jsx` - Component tests
- [x] `src/test/setup.js` - Test setup
- [x] `test-speech.html` - Manual test page
- [x] `SPEECH_RECOGNITION_TEST.md` - Test documentation

### Public Assets
- [x] `public/` directory
- [x] `public/vite.svg` - Vite logo

### HTML Entry
- [x] `index.html` - Main HTML file

## ❌ Files to EXCLUDE (via .gitignore)

### Build Artifacts
- [ ] `node_modules/` - MUST NOT be committed
- [ ] `dist/` - Build output
- [ ] `dist-ssr/` - SSR build output

### Media Files
- [ ] `*.mp4` - Video files
- [ ] `*.webm` - Video files
- [ ] `*.avi` - Video files
- [ ] `*.mov` - Video files
- [ ] `*.mkv` - Video files
- [ ] `recordings/` - Recording directory
- [ ] `exports/` - Export directory
- [ ] `test-recordings/` - Test recordings
- [ ] `*.wav` - Audio files
- [ ] `*.m4a` - Audio files

### Editor Files
- [ ] `.vscode/*` (except extensions.json)
- [ ] `.idea/` - JetBrains IDE
- [ ] `.DS_Store` - macOS

### Logs
- [ ] `*.log` - All log files
- [ ] `logs/` - Log directory

## 🔍 Pre-Push Verification Commands

Run these commands from `wraithweave-core/` directory:

### 1. Check Git Status
```bash
git status
```
**Expected:** Should NOT show `node_modules/` or `dist/`

### 2. Verify .gitignore is Working
```bash
git check-ignore node_modules
```
**Expected:** Should output `node_modules`

### 3. Check What Will Be Committed
```bash
git status --short
```
**Expected:** Only source files, configs, and documentation

### 4. Count Files to Commit
```bash
git ls-files | wc -l
```
**Expected:** Around 50-100 files (NOT thousands from node_modules)

### 5. Verify No Large Files
```bash
git ls-files | xargs du -h | sort -rh | head -20
```
**Expected:** All files should be < 1MB

### 6. Check Repository Size
```bash
du -sh .git
```
**Expected:** Should be < 10MB

## 📋 Repository Structure Verification

Your repository should look like this:

```
/wraithweave-hr-radio
├── .gitignore
├── .kiro/
│   ├── hooks/
│   │   ├── deploy.hook.yaml
│   │   └── test-and-report.hook.yaml
│   ├── specs/
│   │   └── wraithweave-spec.md
│   ├── steering/
│   │   └── gaslight-voice.md
│   ├── vibe_transcripts/
│   │   └── wraith-vibe-1.md
│   └── README.md
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── CRTTerminal.jsx
│   │   ├── PanicMeter.jsx
│   │   ├── RadioUI.jsx
│   │   ├── VoiceRecorder.jsx
│   │   └── VoiceRecorder.test.jsx
│   ├── lib/
│   │   ├── gaslight.js
│   │   ├── GaslightEngine.js
│   │   ├── horrorEffects.js
│   │   ├── speechRecognition.js
│   │   └── speechRecognition.test.js
│   ├── test/
│   │   └── setup.js
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

## 🚀 Ready to Push?

If all items above are checked, you're ready to push!

### Option 1: Use the Automated Script (Recommended)

**Windows:**
```bash
push-to-github.bat
```

**Mac/Linux:**
```bash
chmod +x push-to-github.sh
./push-to-github.sh
```

### Option 2: Manual Push

```bash
cd wraithweave-core
git init
git remote add origin https://github.com/AB2511/wraithweave-hr-radio.git
git add .
git commit -m "feat: Complete WraithWeave implementation"
git push -u origin main
```

## ⚠️ Common Issues

### Issue: "node_modules appears in git status"
**Fix:** 
```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules"
```

### Issue: "Repository too large"
**Fix:** Check for video/audio files:
```bash
find . -type f -size +1M
```

### Issue: "Authentication failed"
**Fix:** Use GitHub Personal Access Token or SSH key

### Issue: "Push rejected"
**Fix:** 
```bash
git pull origin main --rebase
git push origin main
```

## ✨ Post-Push Tasks

After successful push:

1. **Visit Repository:** https://github.com/AB2511/wraithweave-hr-radio
2. **Verify Structure:** Check all folders are present
3. **Add Description:** "Psychological horror system that interrupts speech and punishes emotion"
4. **Add Topics:** `horror`, `ai`, `speech-recognition`, `react`, `vite`, `kiroween`
5. **Upload Demo:** Add video/GIF to README
6. **Create Release:** Tag v1.0.0 for contest submission
7. **Test Clone:** Clone in a new directory and run `npm install && npm run dev`

## 📞 Need Help?

If you encounter issues:
1. Check this checklist again
2. Review `GITHUB_PUSH_GUIDE.md`
3. Run verification commands above
4. Check GitHub repository settings

---

**All checked? Let's push! 🚀**
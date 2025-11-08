# 🚀 Quick Start Card - AI Debator

## ⚡ 3-Minute Setup

### 1. Get OpenAI API Key (1 min)
```
1. Visit: https://platform.openai.com/api-keys
2. Sign in
3. Click "Create new secret key"
4. Copy the key (starts with sk-...)
```

### 2. Add API Key (30 sec)
```
1. Open: server/.env
2. Find: OPENAI_API_KEY=your_openai_api_key_here
3. Replace with your actual key
4. Save file
```

### 3. Start Application (30 sec)
```bash
npm run dev
```

### 4. Open Browser (30 sec)
```
1. Go to: http://localhost:5173
2. Allow microphone when prompted
3. Start debating!
```

---

## 🎯 First Debate (2 minutes)

```
1. Enter name: "Your Name"
2. Click topic: "Social media does more harm than good"
3. Choose: PRO or CON
4. Click: "Start Debate"
5. Click: 🎤 microphone button
6. Speak: Your argument (45-75 seconds)
7. Click: Stop button
8. Listen: AI responds
9. Repeat: 2-3 more rounds
10. Click: "End Debate & View Summary"
```

---

## 📋 Scoring Cheat Sheet

| Category | Points | How to Score High |
|----------|--------|-------------------|
| **Relevance** | 35 | Use topic keywords, stay focused |
| **Strength** | 40 | Add evidence, use "research shows" |
| **Engagement** | 25 | Speak 45-75 seconds, clear voice |

---

## 🎤 Sample Strong Argument

**Topic**: "AI will replace most human jobs"
**Stance**: PRO

```
"I strongly agree that AI will replace most human jobs 
in the coming decade. According to a 2023 McKinsey study, 
automation could affect up to 800 million jobs globally 
by 2030. 

For example, self-driving technology is already 
threatening 3.5 million truck driving jobs in the US alone. 
However, while AI will create new opportunities in tech 
sectors, the pace of job displacement will exceed the rate 
of job creation.

Therefore, we must prepare workers through retraining 
programs and consider solutions like universal basic income."
```

**Why this scores high:**
- ✅ Keywords: "AI", "replace", "jobs" (Relevance)
- ✅ Evidence: "McKinsey study", "800 million jobs" (Strength)
- ✅ Examples: "truck driving", "3.5 million" (Strength)
- ✅ Connectors: "However", "Therefore" (Strength)
- ✅ Length: ~70 seconds (Engagement)

---

## 🔧 Troubleshooting (Quick Fixes)

| Problem | Solution |
|---------|----------|
| Mic not working | Use Chrome/Edge, allow permissions |
| AI not responding | Check API key in server/.env |
| Port already in use | Kill process or change port |
| Dependencies error | Run `npm install` in client/ |
| Server error | Check OpenAI API credits |

---

## 📂 Project Structure (Quick Reference)

```
ai debator/
├── client/          → React frontend (port 5173)
├── server/          → Node.js backend (port 3000)
├── server/.env      → ⚠️ ADD YOUR API KEY HERE
├── setup.bat        → Windows auto-setup
├── setup.sh         → Linux/Mac auto-setup
├── README.md        → Full documentation
├── SETUP.md         → Setup instructions
├── USER_GUIDE.md    → How to use
└── PROJECT_SUMMARY.md → Project overview
```

---

## 🎯 Commands Cheat Sheet

```bash
# Start everything
npm run dev

# Start only server
npm run server

# Start only client
npm run client

# Install all dependencies
npm run install-all

# Build for production
npm run build
```

---

## 🌟 Pro Tips

1. **Best Browser**: Chrome or Edge (best Speech API)
2. **Ideal Time**: Speak for 60 seconds (±15 seconds)
3. **Use Evidence**: Say "research shows", "studies indicate"
4. **Stay Relevant**: Repeat keywords from topic
5. **Connect Ideas**: Use "however", "therefore", "moreover"
6. **Practice**: Do 3-5 debates to see improvement

---

## 📊 Quick Score Guide

```
90-100 → 🌟 Excellent
80-89  → ✨ Great
70-79  → 👍 Good
60-69  → 👌 Fair
50-59  → 📚 Needs work
<50    → 💪 Keep practicing
```

---

## 🎬 URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health
- **OpenAI Keys**: https://platform.openai.com/api-keys

---

## 📞 Quick Help

**Can't find something?**
- README.md → Full docs
- SETUP.md → Installation help
- USER_GUIDE.md → Usage instructions
- PROJECT_SUMMARY.md → Project details

**Still stuck?**
- Check browser console (F12)
- Check terminal for errors
- Verify API key is correct
- Restart server and client

---

## ✅ Pre-flight Checklist

Before starting your first debate:
- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] OpenAI API key added to `server/.env`
- [ ] Server running (port 3000)
- [ ] Client running (port 5173)
- [ ] Microphone working
- [ ] Browser is Chrome or Edge

---

**🎉 You're Ready! Start with `npm run dev`**

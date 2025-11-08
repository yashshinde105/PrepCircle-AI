# 🎤 AI Debator - Visual User Guide

## 🎯 What You'll Experience

This application provides a complete, professional debate practice environment with AI-powered opponents and real-time voice interaction.

---

## 📱 Page-by-Page Walkthrough

### 1️⃣ Home Page - Setup Your Debate

```
┌─────────────────────────────────────────────────────┐
│              🎤 AI Debator                          │
│    Practice your debate skills with AI-powered      │
│              opponents                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [🎤 Voice]  [📚 Scoring]  [🏆 Compete]            │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Your Name: [_________________________]             │
│                                                     │
│  Select Topic:                                      │
│  ┌──────────────────────────────────────┐          │
│  │ ✓ AI will replace most human jobs    │ [Medium] │
│  │   Social media does more harm        │ [Easy]   │
│  │   Remote work is more productive     │ [Easy]   │
│  │   Climate change is pressing issue   │ [Medium] │
│  └──────────────────────────────────────┘          │
│                                                     │
│  Your Stance:  [PRO (For)] [CON (Against)]         │
│                                                     │
│             [Start Debate] →                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**What to do:**
1. Enter your name
2. Click on a topic to select it
3. Choose Pro or Con
4. Click "Start Debate"

---

### 2️⃣ Debate Room - Main Interface

```
┌─────────────────────────────────────────────────────┐
│  Topic: AI will replace most human jobs    Round 1  │
│                                                     │
│  Your Score: 85        vs        AI Score: 82      │
├─────────────────────────────────────────────────────┤
│                   ⏱️ 67s                            │
│  [████████████████████░░░░░░░░░] 74%               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  👤 YOU (Pro)              🤖 AI OPPONENT (Con)     │
│  ┌─────────────────┐       ┌─────────────────┐    │
│  │                 │       │                 │    │
│  │ "I believe AI   │       │ While AI has    │    │
│  │ will create new │       │ benefits, we    │    │
│  │ opportunities   │       │ must consider   │    │
│  │ for workers..." │       │ job losses..."  │    │
│  │                 │       │                 │    │
│  │                 │       │ 🔊 Speaking...  │    │
│  └─────────────────┘       └─────────────────┘    │
│                                                     │
│  [🎤 Stop Speaking]         [Processing...]        │
│                                                     │
├─────────────────────────────────────────────────────┤
│          [End Debate & View Summary]                │
└─────────────────────────────────────────────────────┘
```

**How it works:**
1. **Green = Your Turn**: Click microphone to speak
2. **Timer Counts Down**: You have 90 seconds
3. **Your Words Appear**: Live transcription shows
4. **AI Responds**: Hear and see AI's argument
5. **Scores Update**: See points after each round

---

### 3️⃣ Summary Page - Results & Analysis

```
┌─────────────────────────────────────────────────────┐
│                  🏆 You Won!                        │
│                 Clear Victory!                      │
│                                                     │
│         Your Score: 258  vs  AI Score: 234         │
├─────────────────────────────────────────────────────┤
│  Debate Topic:                                      │
│  "Artificial Intelligence will replace most human   │
│   jobs in the next decade"                         │
├─────────────────────────────────────────────────────┤
│  Round-by-Round Analysis:                          │
│                                                     │
│  ▌Round 1                                          │
│  │ Your Argument: "AI creates opportunities..."    │
│  │ Score: 85 pts                                   │
│  │                                                  │
│  │ AI Argument: "Job displacement concerns..."     │
│  │ Score: 78 pts                                   │
│                                                     │
│  ▌Round 2                                          │
│  │ Your Argument: "Historical tech advances..."    │
│  │ Score: 88 pts                                   │
│  │                                                  │
│  │ AI Argument: "Speed of AI adoption..."         │
│  │ Score: 82 pts                                   │
├─────────────────────────────────────────────────────┤
│  📈 Strengths:                  📉 Improve:        │
│  • Strong performance           • Argument depth   │
│  • Compelling arguments         • More evidence    │
│  • Good delivery                                   │
├─────────────────────────────────────────────────────┤
│     [🏠 New Debate]    [🏆 Leaderboard]            │
└─────────────────────────────────────────────────────┘
```

**What you get:**
- Winner declaration
- Final scores
- Every round reviewed
- Strengths identified
- Areas to improve
- Next steps

---

### 4️⃣ Leaderboard - Rankings

```
┌─────────────────────────────────────────────────────┐
│               🏆 Leaderboard                        │
│         Top debaters ranked by performance          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Rank  Name            Wins  Avg Score  Debates    │
│  ───────────────────────────────────────────────    │
│  🥇#1  Alex Chen        45      87        50       │
│  🥈#2  Sarah Johnson    42      85        52       │
│  🥉#3  Mike Rodriguez   38      82        48       │
│  #4    Emily Wang       35      80        45       │
│  #5    David Kim        32      78        43       │
│                                                     │
├─────────────────────────────────────────────────────┤
│              [🏠 Back to Home]                      │
└─────────────────────────────────────────────────────┘
```

**Track your progress:**
- See your ranking
- Compare with others
- View statistics
- Get motivated

---

## 🎮 How to Use the App (Step by Step)

### First Time Setup

1. **Install Dependencies**
   ```bash
   # Option 1: Run setup script
   setup.bat
   
   # Option 2: Manual install
   cd client && npm install
   cd ../server && npm install
   ```

2. **Get OpenAI API Key**
   - Go to https://platform.openai.com/api-keys
   - Sign in
   - Create new secret key
   - Copy the key

3. **Configure Environment**
   ```bash
   # Open server/.env
   # Add: OPENAI_API_KEY=sk-your-key-here
   ```

4. **Start the App**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Navigate to http://localhost:5173
   - Allow microphone access

---

### Starting Your First Debate

1. **Home Screen**
   - Type your name: "John Doe"
   - Scroll through topics
   - Click topic: "Social media does more harm than good"
   - Click stance: PRO (you support this statement)
   - Click "Start Debate"

2. **Debate Room**
   - **Wait for timer**: Screen loads, timer shows 90s
   - **Click microphone**: Button turns red
   - **Start speaking**: "I believe social media..."
   - **Watch transcript**: Your words appear live
   - **Stop when done**: Click microphone again
   - **Wait for AI**: Listen to AI's response
   - **Next round**: Repeat!

3. **Best Practices**
   - Speak clearly and at normal pace
   - Use evidence: "Studies show...", "Research indicates..."
   - Connect ideas: "However", "Therefore", "Moreover"
   - Watch the timer: Aim for 45-75 seconds
   - Stay on topic: Use keywords from the debate title

---

## 📊 Understanding Your Score

### Total Score Breakdown (100 points max per round)

```
┌─────────────────────────────────────┐
│  RELEVANCE (35 pts)                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  → Topic keywords mentioned          │
│  → Staying on subject                │
│  → Addressing the issue              │
├─────────────────────────────────────┤
│  STRENGTH (40 pts)                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  → Logical structure                 │
│  → Evidence & examples               │
│  → Persuasive language               │
│  → Word count (30+ words)            │
├─────────────────────────────────────┤
│  ENGAGEMENT (25 pts)                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  → Time management (45-75s ideal)    │
│  → Clear communication               │
│  → Vocabulary balance                │
└─────────────────────────────────────┘
```

### Score Interpretation

| Score Range | Meaning |
|------------|---------|
| 90-100 | 🌟 Excellent - Professional level |
| 80-89  | ✨ Great - Strong performance |
| 70-79  | 👍 Good - Solid argument |
| 60-69  | 👌 Fair - Room for improvement |
| 50-59  | 📚 Needs work - Keep practicing |
| Below 50 | 💪 Practice more - You'll improve! |

---

## 💡 Tips for High Scores

### 🎯 Relevance Tips (35 pts)
```
❌ "I think technology is changing everything"
✅ "AI specifically will replace jobs in manufacturing 
    and customer service sectors"
```
- Repeat key words from the topic
- Stay focused on the specific question
- Address the exact issue being debated

### 💪 Strength Tips (40 pts)
```
❌ "AI is bad because it's bad"
✅ "According to MIT research in 2023, AI automation 
    has already displaced 2.4 million jobs. However, 
    it has also created 1.8 million new positions in 
    tech sectors, showing both benefits and challenges."
```
- Use phrases like: "Studies show", "Evidence suggests"
- Connect ideas: "However", "Therefore", "Moreover"
- Provide specific examples
- Aim for 50-100 words

### 🎤 Engagement Tips (25 pts)
```
❌ Too short (20s): "AI is good. It helps people. Thank you."
✅ Just right (60s): [Full argument with examples, 
                      clear speech, proper pacing]
❌ Too long (95s): [Rambling, rushed ending, timer expired]
```
- Target 45-75 seconds speaking time
- Speak clearly at normal pace
- Mix simple and complex vocabulary
- Don't rush or drag

---

## 🎬 Common Scenarios

### Scenario 1: Microphone Not Working

**Symptoms:**
- "Click microphone" but nothing happens
- Transcript stays empty

**Solutions:**
1. Check browser permissions (top left corner)
2. Use Chrome or Edge (best support)
3. Refresh page and allow microphone
4. Check system microphone settings

---

### Scenario 2: AI Not Responding

**Symptoms:**
- "Processing..." never ends
- No AI voice/text appears

**Solutions:**
1. Check `server/.env` has valid OpenAI key
2. Verify server is running on port 3000
3. Check browser console for errors
4. Ensure you have OpenAI API credits

---

### Scenario 3: Low Scores

**Symptoms:**
- Consistently scoring below 60
- AI winning every round

**Solutions:**
1. **Increase Relevance**: Use more topic keywords
2. **Add Evidence**: Say "research shows", give examples
3. **Better Timing**: Aim for 45-75 seconds
4. **Practice**: Do multiple debates to improve

---

## 🏆 Achievement Goals

### Beginner Goals
- [ ] Complete your first debate
- [ ] Score above 60 in any round
- [ ] Try both Pro and Con stances
- [ ] Debate 3 different topics

### Intermediate Goals
- [ ] Win your first debate
- [ ] Score above 80 in a round
- [ ] Complete 5 debates
- [ ] Use evidence in arguments

### Advanced Goals
- [ ] Score above 90 in a round
- [ ] Win 3 debates in a row
- [ ] Make it to the leaderboard
- [ ] Master all difficulty levels

---

## 🔄 Typical Session Flow

```
1. Launch App (npm run dev)
          ↓
2. Home Page → Enter name, pick topic
          ↓
3. Debate Room → Speak for 60s
          ↓
4. AI responds → Listen and see text
          ↓
5. Scores shown → See your points
          ↓
6. Round 2 → Respond to AI's points
          ↓
7. More rounds → Continue debating
          ↓
8. End debate → Click "View Summary"
          ↓
9. Summary Page → See winner & analysis
          ↓
10. Choose: New Debate OR Leaderboard
```

---

## 📞 Need Help?

### Quick Checks
- ✅ Server running? Check port 3000
- ✅ Client running? Check port 5173
- ✅ API key added? Check server/.env
- ✅ Dependencies installed? Run setup script
- ✅ Microphone allowed? Check browser

### More Help
- 📖 See `README.md` for full documentation
- 🔧 See `SETUP.md` for troubleshooting
- 📋 See `PROJECT_SUMMARY.md` for overview

---

## 🎉 Ready to Start!

1. Run `npm run dev`
2. Open http://localhost:5173
3. Allow microphone
4. Enter your name
5. Pick a topic
6. Start debating!

**Remember**: The more you practice, the better you'll get! 

Good luck and happy debating! 🎤✨

# Using Google Gemini API 🤖

## ✅ Migration Complete!

Your app now uses **Google Gemini** instead of OpenAI!

## 🔑 How to Add Your Gemini API Key

### Step 1: Get a Gemini API Key (FREE!)
1. Go to https://makersuite.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy your API key

### Step 2: Add to .env File
1. Open `server/.env`
2. Replace `your_gemini_api_key_here` with your actual key:
   ```
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
3. Change `USE_MOCK_AI=true` to `USE_MOCK_AI=false`

### Step 3: Restart the Server
```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

## 🎉 Why Gemini?

✅ **FREE Tier**: 60 requests per minute for free!
✅ **No Credit Card Required**: Unlike OpenAI
✅ **High Quality**: Google's latest AI model
✅ **Fast Responses**: Quick API calls
✅ **Generous Limits**: Perfect for practice sessions

## 📊 Gemini Free Tier Limits

- **60 requests per minute** (RPM)
- **1,500 requests per day** (RPD)
- **1 million tokens per minute** (TPM)

More than enough for GD practice! 🚀

## 🔧 Current Setup

- **Model**: gemini-pro (Google's best free model)
- **Cost**: $0 (completely free!)
- **API Library**: @google/generative-ai
- **Fallback**: Mock responses if API fails

## 🧪 Testing

### With Mock AI (Current)
- Uses pre-written moderator responses
- No API key needed
- Good for testing the app

### With Real Gemini API
- Dynamic, contextual responses
- Adapts to your specific arguments
- Much better practice experience

## 🆚 Gemini vs OpenAI

| Feature | Gemini (FREE) | OpenAI GPT-4o-mini |
|---------|---------------|---------------------|
| **Cost** | Free | $0.15 / 1M input tokens |
| **Limits** | 60 RPM | Based on credits |
| **Setup** | No credit card | Credit card required |
| **Quality** | Excellent | Excellent |
| **Speed** | Fast | Fast |

## 📝 Example API Response

When you speak in the GD:
```
You: "Remote work increases productivity because people save commute time"

Gemini AI Moderator: "Interesting point! Can you quantify that with specific 
data? For example, what percentage increase in productivity have studies shown? 
Also, how would you address the concern that remote work might reduce spontaneous 
collaboration and innovation that happens in office settings?"
```

## ⚠️ Troubleshooting

### Error: "API key not valid"
- Check your API key in `server/.env`
- Make sure you copied it correctly from Google AI Studio
- No extra spaces or quotes

### Error: "PERMISSION_DENIED"
- Enable the Generative Language API at https://console.cloud.google.com/
- Or create a new API key

### Still using mock responses?
- Check `USE_MOCK_AI=false` in `.env`
- Restart the server after changes

## 🚀 Ready to Use Real AI?

1. Get API key from https://makersuite.google.com/app/apikey
2. Update `server/.env` with your key
3. Set `USE_MOCK_AI=false`
4. Restart: `npm run dev`

That's it! Your GD Practice Simulator will now use real Gemini AI! 🎓

---

**Current Status**: ✅ App running with Gemini integration (Mock mode enabled)

To switch to real Gemini, just add your API key as described above!

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GD Moderator AI - helps users prepare for Group Discussions
export const generateAIResponse = async (topic, stance, userArgument, previousRounds = []) => {
  try {
    // TEMPORARY: Mock responses for testing (remove when Gemini API key is added)
    const useMockMode = process.env.USE_MOCK_AI === 'true';
    
    if (useMockMode) {
      console.log('🤖 Using MOCK AI Moderator (set USE_MOCK_AI=false in .env to use real Gemini)');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const mockModeratorResponses = [
        `That's an interesting perspective! Let me challenge you on that - can you provide specific examples or data to support your claim? Also, have you considered the counterarguments from those who might disagree?`,
        `Good point. Now, let's dig deeper - what would be the real-world implications of implementing this? How would different stakeholders be affected?`,
        `I appreciate your analysis. Building on what you said, what are the potential risks or drawbacks we should be aware of? Every solution has trade-offs.`,
        `Excellent observation! Can you elaborate on the economic/social impact? Also, are there any successful case studies or examples from other countries we can learn from?`,
        `Interesting angle. Let me play devil's advocate here - what would critics say about this viewpoint? How would you respond to those concerns?`,
        `Strong argument! Now, thinking long-term, what are the sustainable solutions? How do we ensure this approach remains effective 5-10 years from now?`,
        `Valid points raised. What role should government/private sector/individuals play in addressing this? Who is ultimately responsible?`,
        `You've covered several aspects well. However, what about the ethical considerations? Are there any moral dilemmas we need to address here?`
      ];
      
      const roundIndex = previousRounds.length % mockModeratorResponses.length;
      return mockModeratorResponses[roundIndex];
    }
    
    const context = previousRounds.length > 0
      ? previousRounds.map(r => `Participant: ${r.userArgument}\nModerator: ${r.aiArgument}`).join('\n\n')
      : '';
    
    const systemPrompt = `You are an expert GD (Group Discussion) moderator helping someone prepare for job interviews. 
Your role is to:
- Ask probing questions to make the candidate think deeper
- Challenge their assumptions constructively
- Request examples, data, or evidence
- Present counterarguments to test their reasoning
- Encourage consideration of multiple perspectives
- Provide dynamic feedback and guide the discussion

Topic: "${topic}"

Be professional, encouraging yet challenging. Keep responses concise (40-80 words).
Focus on helping them improve their critical thinking and communication skills.`;

    const userPrompt = context
      ? `Previous discussion:\n${context}\n\nParticipant's latest point: "${userArgument}"\n\nAs the moderator, respond with a challenging question or counterpoint to help them think deeper:`
      : `The GD topic is: "${topic}". The participant just opened with: "${userArgument}"\n\nAs the moderator, respond with follow-up questions or points to explore:`;

    // Use stable Gemini model name
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.9,
      }
    });

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback to mock response if API fails
    console.log('⚠️  Falling back to MOCK AI Moderator due to API error');
    const mockFallback = `That's a good starting point on "${topic}". Can you provide specific examples to support your argument? Also, what would be the counterarguments to your position, and how would you address them?`;
    return mockFallback;
  }
};

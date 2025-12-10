import dotenv from 'dotenv';

dotenv.config();

// Placeholder for custom AI model integration
// TODO: Replace mock responses with your trained model API calls

// AI Agent 1 - Alex (Supportive Analyst) - Builds on ideas and asks probing questions
export const generateAIResponse = async (topic, stance, userArgument, previousRounds = []) => {
  try {
    console.log('🤖 AI Agent 1 - Alex (Supportive Analyst)');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // TODO: Replace with custom model API call
    // Example: const response = await fetch('YOUR_MODEL_ENDPOINT', { ... });
    
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
  } catch (error) {
    console.error('AI Response Error:', error);
    const mockFallback = `That's a good starting point on "${topic}". Can you provide specific examples to support your argument? Also, what would be the counterarguments to your position, and how would you address them?`;
    return mockFallback;
  }
};

// AI Agent 2 - Jordan (Critical Thinker) - Challenges and offers counterpoints
export const generateAI2Response = async (topic, stance, userArgument, ai1Response, previousRounds = []) => {
  try {
    console.log('🤖 AI Agent 2 - Jordan (Critical Thinker)');
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    
    // TODO: Replace with custom model API call
    // Example: const response = await fetch('YOUR_MODEL_ENDPOINT', { ... });
    
    const mockCriticalResponses = [
      `I'd like to add a different perspective here. While the points raised are valid, we should also consider the opposing viewpoint. What about those who might be negatively affected by this approach?`,
      `Building on what's been said, I think we're missing a crucial aspect. The implementation challenges are significant - how would we actually make this work in practice?`,
      `I respectfully disagree with some aspects. The data suggests a more nuanced picture. Have we considered the long-term consequences versus short-term gains?`,
      `That's one way to look at it, but let me offer a counterargument. Economic factors aside, what about the social and cultural implications we haven't addressed?`,
      `While I see the merit in these arguments, I'd push back on the assumption that this is a straightforward solution. What are the unintended consequences we might face?`,
      `Good discussion so far. However, I think we need to examine the root cause more carefully. Are we treating symptoms rather than the actual problem?`,
      `I want to challenge the premise here. Is this really the most effective approach, or are there alternative solutions we haven't explored?`,
      `Interesting points, but let's consider the scalability. This might work in theory, but how does it hold up when applied at a larger scale?`
    ];
    
    const roundIndex = previousRounds.length % mockCriticalResponses.length;
    return mockCriticalResponses[roundIndex];
  } catch (error) {
    console.error('AI Agent 2 Response Error:', error);
    const mockFallback = `I'd like to offer a different perspective on "${topic}". While the points raised are valid, we should also consider potential drawbacks and implementation challenges. What about those who might be adversely affected?`;
    return mockFallback;
  }
};

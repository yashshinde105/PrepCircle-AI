import dotenv from 'dotenv';

dotenv.config();

// Custom Model API Configuration
const MODEL_API_URL = process.env.MODEL_API_URL || 'https://your-ngrok-url.ngrok.io';

// Session management
let currentSessionId = null;
let lastModelResponse = null;
let parsedBobResponse = null;
let parsedJannetResponse = null;

// Initialize a new debate session with the custom model
export const initializeModelSession = async (userName, topic) => {
  try {
    console.log('🚀 Initializing model session...');
    console.log(`📡 Connecting to: ${MODEL_API_URL}/debate/start`);
    
    const response = await fetch(`${MODEL_API_URL}/debate/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: userName,
        topic: topic,
        participants: ['Bob', 'Jannet']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Model API error:', errorText);
      throw new Error(`Failed to start session: ${response.status}`);
    }

    const data = await response.json();
    currentSessionId = data.session_id;
    console.log('✅ Model session initialized:', currentSessionId);
    
    return {
      sessionId: data.session_id,
      assistantOutput: data.assistant_output,
      roundNumber: data.round_number,
      isComplete: data.is_complete
    };
  } catch (error) {
    console.error('❌ Error initializing model session:', error);
    return null;
  }
};

// Send user reply and get AI responses from custom model
const getModelResponse = async (sessionId, userReply) => {
  try {
    console.log('📤 Sending to model:', userReply.substring(0, 50) + '...');
    
    const response = await fetch(`${MODEL_API_URL}/debate/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        user_reply: userReply
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Model API error:', errorText);
      
      // Check if debate is completed
      if (errorText.includes('already completed') || errorText.includes('not found')) {
        console.log('🏁 Debate session completed by model');
        currentSessionId = null;
        return { assistantOutput: '', isComplete: true, debateEnded: true };
      }
      
      throw new Error(`Failed to get response: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Model response received');
    console.log('📄 Raw output:', data.assistant_output);
    
    return {
      assistantOutput: data.assistant_output,
      roundNumber: data.round_number,
      isComplete: data.is_complete,
      debateEnded: data.is_complete
    };
  } catch (error) {
    console.error('❌ Error getting model response:', error);
    return null;
  }
};

// Extract only the FIRST response from each speaker (before any "Round" markers)
const parseModelOutput = (output) => {
  if (!output) {
    return { bobResponse: '', jannetResponse: '' };
  }

  console.log('📄 Raw output:', output);
  
  let bobResponse = '';
  let jannetResponse = '';
  
  // Find first Bob: and first Jannet: positions
  const bobIndex = output.indexOf('Bob:');
  const jannetIndex = output.indexOf('Jannet:');
  
  if (bobIndex !== -1 && jannetIndex !== -1) {
    if (bobIndex < jannetIndex) {
      // Bob speaks first, then Jannet
      // Bob's text: from "Bob:" to "Jannet:"
      bobResponse = output.substring(bobIndex + 4, jannetIndex);
      
      // Jannet's text: from "Jannet:" to next "Round" or next "Bob:" (whichever comes first)
      const afterJannet = output.substring(jannetIndex + 7);
      const roundIndex = afterJannet.search(/Round\s*\d+/i);
      const nextBobIndex = afterJannet.indexOf('Bob:');
      
      if (roundIndex !== -1 && (nextBobIndex === -1 || roundIndex < nextBobIndex)) {
        jannetResponse = afterJannet.substring(0, roundIndex);
      } else if (nextBobIndex !== -1) {
        jannetResponse = afterJannet.substring(0, nextBobIndex);
      } else {
        jannetResponse = afterJannet;
      }
    } else {
      // Jannet speaks first, then Bob
      jannetResponse = output.substring(jannetIndex + 7, bobIndex);
      
      const afterBob = output.substring(bobIndex + 4);
      const roundIndex = afterBob.search(/Round\s*\d+/i);
      const nextJannetIndex = afterBob.indexOf('Jannet:');
      
      if (roundIndex !== -1 && (nextJannetIndex === -1 || roundIndex < nextJannetIndex)) {
        bobResponse = afterBob.substring(0, roundIndex);
      } else if (nextJannetIndex !== -1) {
        bobResponse = afterBob.substring(0, nextJannetIndex);
      } else {
        bobResponse = afterBob;
      }
    }
  } else if (bobIndex !== -1) {
    // Only Bob present - get text until "Round" marker
    const afterBob = output.substring(bobIndex + 4);
    const roundIndex = afterBob.search(/Round\s*\d+/i);
    bobResponse = roundIndex !== -1 ? afterBob.substring(0, roundIndex) : afterBob;
  } else if (jannetIndex !== -1) {
    // Only Jannet present
    const afterJannet = output.substring(jannetIndex + 7);
    const roundIndex = afterJannet.search(/Round\s*\d+/i);
    jannetResponse = roundIndex !== -1 ? afterJannet.substring(0, roundIndex) : afterJannet;
    bobResponse = output; // Give Bob something to say
  } else {
    bobResponse = output;
  }
  
  // Clean up - trim whitespace
  bobResponse = bobResponse.trim();
  jannetResponse = jannetResponse.trim();
  
  console.log('✅ Bob (cleaned):', bobResponse);
  console.log('✅ Jannet (cleaned):', jannetResponse);
  
  return { bobResponse, jannetResponse };
};

// AI Agent 1 - Bob
export const generateAIResponse = async (topic, stance, userArgument, previousRounds = []) => {
  try {
    console.log('🤖 AI Agent 1 - Bob');
    
    // Initialize session if needed
    if (!currentSessionId) {
      const session = await initializeModelSession('User', topic);
      if (session) {
        currentSessionId = session.sessionId;
        lastModelResponse = session.assistantOutput;
      }
    } else {
      // Get new response from model
      const modelResponse = await getModelResponse(currentSessionId, userArgument);
      
      if (modelResponse) {
        if (modelResponse.debateEnded) {
          console.log('🏁 Debate ended');
          lastModelResponse = null;
          parsedBobResponse = null;
          parsedJannetResponse = null;
          return { response: null, debateEnded: true };
        }
        lastModelResponse = modelResponse.assistantOutput;
      }
    }
    
    // Parse BOTH responses and store them
    if (lastModelResponse) {
      const { bobResponse, jannetResponse } = parseModelOutput(lastModelResponse);
      parsedBobResponse = bobResponse;
      parsedJannetResponse = jannetResponse;
      
      console.log('📦 Stored Bob response:', parsedBobResponse ? 'Yes' : 'No');
      console.log('📦 Stored Jannet response:', parsedJannetResponse ? 'Yes' : 'No');
      
      // If Bob has a response, return it
      if (parsedBobResponse) {
        return { response: parsedBobResponse, debateEnded: false };
      }
      
      // If only Jannet responded, use full raw output for Bob
      // (Model sometimes only outputs one speaker)
      if (!parsedBobResponse && jannetResponse) {
        console.log('📝 Only Jannet responded, using raw output for Bob');
        return { response: lastModelResponse, debateEnded: false };
      }
    }
    
    // Fallback
    console.log('⚠️ Using fallback for Bob');
    return { 
      response: "That's an interesting perspective. Can you elaborate on your reasoning?", 
      debateEnded: false 
    };
  } catch (error) {
    console.error('Error:', error);
    return { 
      response: "I'd like to hear more about your thoughts on this topic.", 
      debateEnded: false 
    };
  }
};

// AI Agent 2 - Jannet
export const generateAI2Response = async (topic, stance, userArgument, ai1Response, previousRounds = []) => {
  try {
    console.log('🤖 AI Agent 2 - Jannet');
    console.log('📦 Retrieved Jannet response:', parsedJannetResponse ? 'Yes' : 'No');
    
    // Use the stored Jannet response
    if (parsedJannetResponse) {
      const response = parsedJannetResponse;
      parsedJannetResponse = null; // Clear after use
      return response;
    }
    
    // If Jannet has no response but Bob did, skip Jannet's turn
    // (Model only had Bob speak this round)
    if (parsedBobResponse && !parsedJannetResponse) {
      console.log('📝 Only Bob responded this round, Jannet will skip');
      return null; // Signal to skip Jannet
    }
    
    // Fallback
    console.log('⚠️ Using fallback for Jannet');
    return "I'd like to add a different perspective to this discussion.";
  } catch (error) {
    console.error('Error:', error);
    return "Let me offer another viewpoint on this matter.";
  }
};

// Reset session
export const resetModelSession = () => {
  currentSessionId = null;
  lastModelResponse = null;
  parsedBobResponse = null;
  parsedJannetResponse = null;
  console.log('🔄 Session reset');
};

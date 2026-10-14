import dotenv from 'dotenv';

dotenv.config();

// Custom Model API Configuration — points to the Colab FastAPI backend
const MODEL_API_URL = process.env.MODEL_API_URL?.trim();

const getModelApiUrl = () => {
  if (!MODEL_API_URL) {
    const error = new Error('MODEL_API_URL is not configured');
    error.code = 'MODEL_API_URL_MISSING';
    throw error;
  }

  return MODEL_API_URL;
};

const isMissingModelApiUrlError = (error) => error?.code === 'MODEL_API_URL_MISSING';

const createModelApiError = (message, status = 502, code = 'MODEL_API_UNAVAILABLE', details) => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  if (details) {
    error.details = details;
  }
  return error;
};

// Session management
let currentSessionId = null;

// Initialize a new debate session with the Colab FastAPI backend
// Colab endpoint: POST /api/sessions
export const initializeModelSession = async (userName, topic) => {
  try {
    const modelApiUrl = getModelApiUrl();
    console.log('🚀 Initializing model session...');
    console.log(`📡 Connecting to: ${modelApiUrl}/api/sessions`);

    const response = await fetch(`${modelApiUrl}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: userName || 'Student',
        topic: topic,
        duration_minutes: 10,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Model API error:', errorText);
      throw createModelApiError(
        `Model API failed to start session (${response.status}).`,
        502,
        'MODEL_API_HTTP_ERROR',
        errorText
      );
    }

    const data = await response.json();
    currentSessionId = data.session_id;
    console.log('✅ Model session initialized:', currentSessionId);
    console.log('📄 Opening message from', data.opening_speaker, ':', data.opening_message);

    return {
      sessionId: data.session_id,
      // The Colab backend returns opening_message + opening_speaker (always "Bob")
      bobResponse: data.opening_message || '',
      jannetResponse: '', // Jannet doesn't speak at session start
      roundNumber: 0,
      isComplete: false,
      remainingSeconds: data.remaining_seconds,
    };
  } catch (error) {
    if (isMissingModelApiUrlError(error)) {
      throw error;
    }
    console.error('❌ Error initializing model session:', error);
    throw createModelApiError(
      'Unable to initialize model session. Check MODEL_API_URL and model backend availability.',
      502,
      error?.code || 'MODEL_API_UNAVAILABLE',
      error?.message
    );
  }
};

// Send user reply and get AI response from Colab FastAPI
// Colab endpoint: POST /api/sessions/{session_id}/reply
const getModelResponse = async (sessionId, userReply) => {
  try {
    const modelApiUrl = getModelApiUrl();
    console.log('📤 Sending to model:', userReply.substring(0, 50) + '...');

    const response = await fetch(`${modelApiUrl}/api/sessions/${sessionId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: userReply,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Model API error:', errorText);

      // Check if debate is completed or session not found
      if (errorText.includes('has ended') || errorText.includes('not found')) {
        console.log('🏁 Debate session completed/expired');
        currentSessionId = null;
        return { bobResponse: '', jannetResponse: '', isComplete: true, debateEnded: true };
      }

      throw createModelApiError(
        `Model API failed to generate reply (${response.status}).`,
        502,
        'MODEL_API_HTTP_ERROR',
        errorText
      );
    }

    const data = await response.json();
    console.log('✅ Model response received');
    console.log('📄 Speaker:', data.speaker, '| Round:', data.round_number);
    console.log('📄 Response:', data.assistant_output);

    // The updated Colab backend returns both participants for each student turn.
    // Keep the single-response shape as a fallback for older running notebooks.
    const responses = Array.isArray(data.responses) && data.responses.length
      ? data.responses
      : [{ speaker: data.speaker, text: data.assistant_output || data.response }];
    const normalizedResponses = responses
      .map((turn) => ({
        speaker: String(turn.speaker || '').trim(),
        text: String(turn.text || turn.assistant_output || '').trim(),
      }))
      .filter((turn) => turn.text && ['bob', 'jannet'].includes(turn.speaker.toLowerCase()))
      .map((turn) => ({ ...turn, key: turn.speaker.toLowerCase() }));
    const bobResponse = normalizedResponses.find((turn) => turn.key === 'bob')?.text || '';
    const jannetResponse = normalizedResponses.find((turn) => turn.key === 'jannet')?.text || '';
    const speaker = normalizedResponses[0]?.speaker || String(data.speaker || '').trim();
    const botText = normalizedResponses[0]?.text || String(data.assistant_output || data.response || '').trim();

    return {
      bobResponse,
      jannetResponse,
      responses: normalizedResponses.map(({ speaker, text }) => ({ speaker, text })),
      speaker: speaker,
      roundNumber: data.round_number,
      isComplete: data.is_complete,
      debateEnded: data.is_complete,
      remainingSeconds: data.remaining_seconds,
      liveScores: data.live_scores || null,
      studentName: data.student_name || 'Student',
    };
  } catch (error) {
    if (isMissingModelApiUrlError(error)) {
      throw error;
    }
    console.error('❌ Error getting model response:', error);
    throw createModelApiError(
      'Unable to get model reply. Check MODEL_API_URL and model backend availability.',
      502,
      error?.code || 'MODEL_API_UNAVAILABLE',
      error?.message
    );
  }
};

// Finish the session and get the final report from Colab
// Colab endpoint: POST /api/sessions/{session_id}/finish
export const finishModelSession = async (sessionId) => {
  try {
    const modelApiUrl = getModelApiUrl();
    const sid = sessionId || currentSessionId;
    if (!sid) {
      console.log('⚠️ No active session to finish');
      return null;
    }

    console.log('🏁 Finishing session:', sid);
    const response = await fetch(`${modelApiUrl}/api/sessions/${sid}/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Finish API error:', errorText);
      throw createModelApiError(
        `Model API failed to finish session (${response.status}).`,
        502,
        'MODEL_API_HTTP_ERROR',
        errorText
      );
    }

    const data = await response.json();
    console.log('✅ Session finished, got final report');
    currentSessionId = null;

    return {
      sessionId: data.session_id,
      isComplete: data.is_complete,
      finalReport: data.final_report,
    };
  } catch (error) {
    if (isMissingModelApiUrlError(error)) {
      throw error;
    }
    console.error('❌ Error finishing session:', error);
    throw createModelApiError(
      'Unable to finish model session. Check MODEL_API_URL and model backend availability.',
      502,
      error?.code || 'MODEL_API_UNAVAILABLE',
      error?.message
    );
  }
};

// AI Agent 1 - Bob: get response for the current round
export const generateAIResponse = async (topic, stance, userArgument, previousRounds = [], sessionId = currentSessionId) => {
  try {
    console.log('🤖 AI Agent 1 - Bob');

    // Initialize session if needed
    if (!sessionId) {
      const session = await initializeModelSession('User', topic);
      currentSessionId = session.sessionId;
      console.log('📦 Got opening from Bob:', session.bobResponse ? 'Yes' : 'No');

      // Return the opening message — at session start only Bob speaks
      return {
        response: session.bobResponse || 'Let me start the discussion on this topic.',
        jannetResponse: '', // No Jannet response at start
        debateEnded: false,
        liveScores: null,
      };
    }

    // Get new response from model (sends user's argument)
    const modelResponse = await getModelResponse(sessionId, userArgument);
    if (modelResponse.debateEnded) {
      console.log('🏁 Debate ended');
      return { response: null, jannetResponse: null, debateEnded: true, liveScores: null };
    }

    // Return both participant responses in the order produced by Colab.
    console.log('📦 Bob:', modelResponse.bobResponse ? 'Yes' : 'No');
    console.log('📦 Jannet:', modelResponse.jannetResponse ? 'Yes' : 'No');

    return {
      response: modelResponse.bobResponse || '',
      jannetResponse: modelResponse.jannetResponse || '',
      responses: modelResponse.responses || [],
      speaker: modelResponse.speaker,
      debateEnded: false,
      liveScores: modelResponse.liveScores,
    };
  } catch (error) {
    console.error('❌ generateAIResponse failed:', error);
    throw error;
  }
};

// AI Agent 2 - Jannet: The Colab backend alternates speakers automatically.
// With the new integration, generateAIResponse already returns both responses
// when available. This function extracts the Jannet part.
export const generateAI2Response = async (topic, stance, userArgument, ai1Response, previousRounds = []) => {
  // Jannet's response is now bundled into the generateAIResponse result.
  // The controller calls this for backward compatibility; if the AI result already
  // has a jannetResponse, it was set by generateAIResponse. Return null to signal
  // the controller should use what was already returned.
  console.log('🤖 AI Agent 2 - Jannet (handled by Colab alternation)');
  return null;
};

// Reset session
export const resetModelSession = () => {
  currentSessionId = null;
  console.log('🔄 Session reset');
};

// Get the current session ID
export const getCurrentSessionId = () => currentSessionId;

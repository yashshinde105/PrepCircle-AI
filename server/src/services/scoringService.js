// GD Scoring algorithm based on clarity, logic, examples, and communication
export const calculateScore = (argument, topic, duration) => {
  let score = 0;
  
  // Clarity & Articulation (0-30 points)
  const clarityScore = calculateClarity(argument);
  score += clarityScore;
  
  // Logic & Reasoning (0-35 points)
  const logicScore = calculateLogic(argument);
  score += logicScore;
  
  // Examples & Evidence (0-25 points)
  const evidenceScore = calculateEvidence(argument, topic);
  score += evidenceScore;
  
  // Communication Skills (0-10 points)
  const communicationScore = calculateCommunication(argument, duration);
  score += communicationScore;
  
  return Math.round(score);
};

const calculateClarity = (argument) => {
  let score = 0;
  const wordCount = argument.split(' ').length;
  
  // Adequate length (structured response)
  if (wordCount >= 40 && wordCount <= 120) {
    score += 15; // Optimal length
  } else if (wordCount >= 25) {
    score += 10;
  } else {
    score += 5;
  }
  
  // Clear structure indicators
  const structureWords = ['first', 'second', 'third', 'firstly', 'secondly', 
                          'to begin', 'in conclusion', 'finally', 'lastly'];
  structureWords.forEach(word => {
    if (argument.toLowerCase().includes(word)) {
      score += 3;
    }
  });
  
  // Sentence variety (good articulation)
  const sentences = argument.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length >= 3) {
    score += 5;
  }
  
  return Math.min(score, 30);
};

const calculateLogic = (argument) => {
  let score = 0;
  
  // Logical connectors (shows reasoning)
  const logicalWords = ['because', 'therefore', 'thus', 'hence', 'consequently', 
                       'as a result', 'this means', 'which leads to', 'due to'];
  let logicalCount = 0;
  logicalWords.forEach(word => {
    if (argument.toLowerCase().includes(word)) {
      logicalCount++;
      score += 5;
    }
  });
  
  // Multiple perspectives
  const perspectiveWords = ['however', 'on the other hand', 'alternatively', 
                           'conversely', 'while', 'although', 'despite'];
  perspectiveWords.forEach(word => {
    if (argument.toLowerCase().includes(word)) {
      score += 6; // Shows balanced thinking
    }
  });
  
  // Question addressing
  const addressingWords = ['as you mentioned', 'regarding', 'concerning', 
                          'in response to', 'addressing'];
  addressingWords.forEach(word => {
    if (argument.toLowerCase().includes(word)) {
      score += 5;
    }
  });
  
  return Math.min(score, 35);
};

const calculateEvidence = (argument, topic) => {
  let score = 0;
  
  // Evidence indicators
  const evidenceWords = ['for example', 'for instance', 'such as', 'like', 
                        'research shows', 'studies indicate', 'data suggests',
                        'according to', 'statistics show', 'evidence shows',
                        'in my experience', 'i have seen', 'we can see'];
  
  evidenceWords.forEach(word => {
    if (argument.toLowerCase().includes(word)) {
      score += 8;
    }
  });
  
  // Topic relevance (staying on point)
  const topicKeywords = topic.toLowerCase().split(' ');
  const argumentLower = argument.toLowerCase();
  
  let matches = 0;
  topicKeywords.forEach(keyword => {
    if (argumentLower.includes(keyword)) {
      matches++;
    }
  });
  
  const relevanceRatio = matches / topicKeywords.length;
  score += Math.round(relevanceRatio * 10);
  
  return Math.min(score, 25);
};

const calculateCommunication = (argument, duration) => {
  let score = 0;
  
  // Time management (0-5 points)
  if (duration >= 30 && duration <= 75) {
    score += 5; // Ideal duration
  } else if (duration >= 20 && duration < 90) {
    score += 3;
  }
  
  // Confident language (not too hesitant)
  const hesitantWords = ['maybe', 'perhaps', 'i think', 'i guess', 'probably'];
  let hesitantCount = 0;
  hesitantWords.forEach(word => {
    if (argument.toLowerCase().includes(word)) {
      hesitantCount++;
    }
  });
  
  if (hesitantCount === 0) {
    score += 5; // Confident delivery
  } else if (hesitantCount <= 2) {
    score += 3;
  }
  
  return Math.min(score, 10);
};

export const generateDebateSummary = (debate) => {
  const avgScore = debate.userScore / debate.rounds.length;
  
  let performance = 'Needs Improvement';
  if (avgScore >= 80) performance = 'Excellent';
  else if (avgScore >= 70) performance = 'Good';
  else if (avgScore >= 60) performance = 'Average';
  
  return {
    performance,
    finalScore: debate.userScore,
    averageScore: Math.round(avgScore),
    totalRounds: debate.rounds.length,
    strengths: analyzeStrengths(debate.rounds),
    improvements: analyzeImprovements(debate.rounds),
    keyFeedback: generateKeyFeedback(avgScore)
  };
};

const analyzeStrengths = (rounds) => {
  const strengths = [];
  const scores = rounds.map(r => r.userScore);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  if (avgScore >= 75) {
    strengths.push('Strong logical reasoning and argumentation');
  }
  if (scores.filter(s => s >= 70).length >= rounds.length * 0.7) {
    strengths.push('Consistent performance throughout the GD');
  }
  
  // Check for improvement trend
  if (scores.length >= 3) {
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg + 5) {
      strengths.push('Improved as the discussion progressed');
    }
  }
  
  return strengths;
};

const analyzeImprovements = (rounds) => {
  const improvements = [];
  const scores = rounds.map(r => r.userScore);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  if (avgScore < 60) {
    improvements.push('Work on providing more specific examples and evidence');
    improvements.push('Structure your points clearly with logical flow');
  } else if (avgScore < 75) {
    improvements.push('Include more real-world examples to support arguments');
    improvements.push('Consider multiple perspectives before concluding');
  }
  
  if (scores.some(s => s < 50)) {
    improvements.push('Practice speaking within the time limit without rushing');
  }
  
  return improvements;
};

const generateKeyFeedback = (avgScore) => {
  if (avgScore >= 80) {
    return 'Outstanding performance! You demonstrated strong critical thinking, clear communication, and excellent examples. Ready for real GD rounds.';
  } else if (avgScore >= 70) {
    return 'Good job! You showed solid understanding and decent communication. Focus on adding more concrete examples and addressing counterpoints.';
  } else if (avgScore >= 60) {
    return 'Average performance. You have the basics down but need to work on logical reasoning, providing evidence, and structuring your arguments better.';
  } else {
    return 'Needs improvement. Practice organizing your thoughts, providing specific examples, and speaking clearly. Keep practicing regularly.';
  }
};


'use client';

import React, { useState, useEffect } from 'react';
import { Send, Trash2, RefreshCw } from 'lucide-react';

interface AnalysisResult {
  id: string;
  subjectLine: string;
  score: number;
  feedback: string[];
  timestamp: number;
}

const SubjectLineAnalyzer: React.FC = () => {
  const [subjectLine, setSubjectLine] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [pastAnalyses, setPastAnalyses] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const savedAnalyses = localStorage.getItem('pastAnalyses');
    if (savedAnalyses) {
      setPastAnalyses(JSON.parse(savedAnalyses));
    }
  }, []);

  const saveAnalysis = (newAnalysis: AnalysisResult) => {
    const updatedAnalyses = [newAnalysis, ...pastAnalyses].slice(0, 10);
    setPastAnalyses(updatedAnalyses);
    localStorage.setItem('pastAnalyses', JSON.stringify(updatedAnalyses));
  };

  const deleteAnalysis = (id: string) => {
    const updatedAnalyses = pastAnalyses.filter(a => a.id !== id);
    setPastAnalyses(updatedAnalyses);
    localStorage.setItem('pastAnalyses', JSON.stringify(updatedAnalyses));
  };

  const clearAllAnalyses = () => {
    setPastAnalyses([]);
    localStorage.removeItem('pastAnalyses');
  };

  const analyzeSubjectLine = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const trimmedSubject = subjectLine.trim();
      if (trimmedSubject.length < 3) {
        setAnalysis({
          id: Date.now().toString(),
          subjectLine: trimmedSubject,
          score: 0,
          feedback: ['Subject line is too short. Please enter at least 3 characters for a meaningful analysis.'],
          timestamp: Date.now()
        });
        setIsAnalyzing(false);
        return;
      }

      const subjectWithoutPlaceholders = trimmedSubject.replace(/{.*?}/g, '');
      const subjectWithoutEmojis = subjectWithoutPlaceholders.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '');
      const words = subjectWithoutEmojis.toLowerCase().split(/\s+/);
      const wordCount = words.length;

      let score = 30; // Start with a lower base score
      const feedback = [];

      // Length check
      if (subjectWithoutEmojis.length >= 30 && subjectWithoutEmojis.length <= 60) {
        score += 15;
        feedback.push('Optimal length! Your subject line is within the recommended range of 30-60 characters.');
      } else if (subjectWithoutEmojis.length < 30) {
        score += 5;
        feedback.push('Your subject line is concise, which can be effective. Consider adding more detail to reach 30-60 characters for optimal impact.');
      } else {
        feedback.push('Your subject line is longer than recommended. Try to keep it under 60 characters to prevent truncation in some email clients.');
      }

      // Word variety
      const uniqueWords = new Set(words).size;
      if (uniqueWords / wordCount > 0.8) {
        score += 10;
        feedback.push('Good word variety, which can make your subject line more engaging and interesting.');
      }

      // Urgency and scarcity
      const urgencyWords = ['limited', 'exclusive', "don't miss", 'last chance', 'ending soon', 'only', 'hurry', 'quick', 'fast', 'now', 'today'];
      const usedUrgencyWords = urgencyWords.filter(word => words.includes(word));
      if (usedUrgencyWords.length > 0) {
        score += 10;
        feedback.push('Effective use of urgency or scarcity: ' + usedUrgencyWords.join(', ') + '. This can motivate recipients to open your email.');
      }

      // Emoji usage
      const emojiCount = (trimmedSubject.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu) || []).length;
      if (emojiCount === 1) {
        score += 5;
        feedback.push('Good use of a single emoji. This can increase visual appeal without overwhelming.');
      } else if (emojiCount > 1) {
        feedback.push('Multiple emojis detected. While they can add visual interest, use them judiciously to maintain professionalism.');
      }

      // Impactful words
      const impactfulWords = ['new', 'announcement', 'important', 'breaking', 'alert', 'update', 'introducing', 'discover', 'revealed', 'finally'];
      const usedImpactfulWords = impactfulWords.filter(word => words.includes(word));
      if (usedImpactfulWords.length > 0) {
        score += 5;
        feedback.push(`Strong word choice: ${usedImpactfulWords.join(', ')}. These words can grab attention and increase open rates.`);
      }

      // Call to action
      const ctaWords = ['get', 'download', 'try', 'buy', 'subscribe', 'learn', 'find out', 'see', 'watch'];
      const usedCtaWords = ctaWords.filter(word => words.includes(word));
      if (usedCtaWords.length > 0) {
        score += 5;
        feedback.push('Includes a clear call to action: ' + usedCtaWords.join(', ') + '. This can encourage recipients to engage with your email.');
      }

      // Personalization
      if (trimmedSubject.includes('{name}') || trimmedSubject.includes('{company}')) {
        score += 10;
        feedback.push('Good use of personalization! This can significantly increase open rates and engagement.');
      }

      // Capitalization
      if (trimmedSubject !== trimmedSubject.toLowerCase() && trimmedSubject !== trimmedSubject.toUpperCase()) {
        score += 5;
        feedback.push('Proper use of capitalization improves readability and professionalism.');
      } else if (trimmedSubject === trimmedSubject.toUpperCase() && trimmedSubject.length > 10) {
        score -= 10;
        feedback.push('Avoid using ALL CAPS as it may trigger spam filters and appear like shouting.');
      }

      // Question mark
      if (trimmedSubject.includes('?')) {
        score += 5;
        feedback.push('Using a question can pique curiosity and boost open rates.');
      }

      // Numbers
      if (/\b\d+\b/.test(trimmedSubject)) {
        score += 5;
        feedback.push('Including numbers can make your subject line more specific and compelling.');
      }

      // Spam trigger words check
      const spamTriggerWords = ['free', 'guarantee', 'no obligation', 'winner', 'congratulations', 'prize', 'urgent', 'act now'];
      const usedSpamWords = spamTriggerWords.filter(word => words.includes(word));
      if (usedSpamWords.length > 0) {
        score -= 10;
        feedback.push('Caution: Your subject line contains words often associated with spam: ' + usedSpamWords.join(', ') + '. Consider alternatives to improve deliverability.');
      }

      // Final score adjustments
      score = Math.max(0, Math.min(100, score));

      if (score < 50) {
        //
      } else if (score >= 90) {
        feedback.push('Excellent subject line! It effectively uses multiple best practices for email marketing.');
      } else if (score >= 70) {
        feedback.push('Good subject line. Consider the feedback above to potentially improve its effectiveness further.');
      }

      const newAnalysis = {
        id: Date.now().toString(),
        subjectLine: trimmedSubject,
        score,
        feedback,
        timestamp: Date.now(),
      };

      setAnalysis(newAnalysis);
      saveAnalysis(newAnalysis);
      setSubjectLine('');
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="flex-grow flex justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-green-600">
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-iowan">Email Subject Line Analyzer</h1>
        </div>

        <div className="p-6">
          <div className="mb-6 relative">
            <input
              type="text"
              value={subjectLine}
              onChange={(e) => setSubjectLine(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && analyzeSubjectLine()}
              placeholder="Enter your email subject line"
              className="w-full p-3 sm:p-4 pr-12 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
              disabled={isAnalyzing}
            />
            <button
              onClick={analyzeSubjectLine}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-lg transition duration-300 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
              aria-label="Analyze"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>

          {analysis && (
            <div className="mt-8 p-4 sm:p-6 bg-gray-50 rounded-xl shadow-inner animate-fade-in">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 font-iowan">Analysis Results</h2>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center mr-4 sm:mr-6">
                  <span className="text-2xl sm:text-4xl font-bold text-white">{analysis.score}</span>
                </div>
                <div>
                  <p className="font-semibold text-lg sm:text-xl text-gray-800">Effectiveness Score</p>
                  <p className="text-sm sm:text-base text-gray-600">Out of 100</p>
                </div>
              </div>
              <ul className="space-y-3">
                {analysis.feedback.map((item, index) => {
                  let emoji = '📝'; // Default emoji
                  let colorClass = 'text-blue-500'; // Default color

                  if (item.toLowerCase().includes('good') ||
                    item.toLowerCase().includes('effective') ||
                    item.toLowerCase().includes('optimal')) {
                    emoji = '✅';
                    colorClass = 'text-green-500';
                  } else if (item.toLowerCase().includes('consider') ||
                    item.toLowerCase().includes('try') ||
                    item.toLowerCase().includes('could')) {
                    emoji = '💡';
                    colorClass = 'text-yellow-500';
                  } else if (item.toLowerCase().includes('caution') ||
                    item.toLowerCase().includes('avoid') ||
                    item.toLowerCase().includes('too long') ||
                    item.toLowerCase().includes('too short')) {
                    emoji = '⚠️';
                    colorClass = 'text-orange-500';
                  }

                  return (
                    <li key={index} className="flex items-center bg-white p-3 rounded-lg shadow">
                      <span className={`mr-3 flex-shrink-0 text-xl ${colorClass}`}>
                        {emoji}
                      </span>
                      <span className="text-sm sm:text-base text-gray-700 flex-grow">{item}</span>
                    </li>
                  );
                })}
              </ul>
              {analysis.score < 70 && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">To improve your subject line:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Aim for 30-60 characters</li>
                    <li>Use urgency words like "limited" or "exclusive" if appropriate</li>
                    <li>Include a clear call to action</li>
                    <li>Consider personalization with {'{name}'} or {'{company}'}</li>
                    <li>Ensure proper capitalization</li>
                    <li>Try incorporating numbers or asking a question</li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {pastAnalyses.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 font-iowan">Past Analyses</h2>
                <button
                  onClick={clearAllAnalyses}
                  className="text-red-500 hover:text-red-700 flex items-center"
                  aria-label="Clear all analyses"
                >
                  <Trash2 size={18} className="mr-1" />
                  <span className="text-sm sm:text-base">Clear All</span>
                </button>
              </div>
              <ul className="space-y-3">
                {pastAnalyses.map((pastAnalysis) => (
                  <li key={pastAnalysis.id} className="bg-white p-3 sm:p-4 rounded-lg shadow flex justify-between items-center">
                    <div className="overflow-hidden">
                      <p className="font-semibold text-sm sm:text-base truncate">{pastAnalysis.subjectLine}</p>
                      <p className="text-xs sm:text-sm text-gray-500">Score: {pastAnalysis.score}</p>
                    </div>
                    <button
                      onClick={() => deleteAnalysis(pastAnalysis.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      aria-label={`Delete analysis for "${pastAnalysis.subjectLine}"`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectLineAnalyzer;

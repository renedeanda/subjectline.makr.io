
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
      if (!subjectLine.trim()) {
        setAnalysis({ id: Date.now().toString(), subjectLine: '', score: 0, feedback: ['Please enter a subject line.'], timestamp: Date.now() });
        setIsAnalyzing(false);
        return;
      }

      const subjectWithoutPlaceholders = subjectLine.replace(/{.*?}/g, '');
      const subjectWithoutEmojis = subjectWithoutPlaceholders.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '');
      const words = subjectWithoutEmojis.trim().toLowerCase().split(/\s+/);
      const wordCount = words.length;

      let score = 50;
      const feedback = [];

      // Handle extreme edge cases
      if (subjectWithoutEmojis.length > 120 || wordCount > 20) {
        setAnalysis({
          id: Date.now().toString(),
          subjectLine,
          score: 0,
          feedback: [
            'Your subject line is unusually long for email standards.',
            'Consider shortening it to 40-60 characters for better readability and impact.',
            'Focus on the key message you want to convey.'
          ],
          timestamp: Date.now()
        });
        setIsAnalyzing(false);
        return;
      }

      // Personalization
      if (subjectLine.includes('{Name}') || subjectLine.includes('{name}')) {
        score += 10;
        feedback.push('Good use of personalization with name placeholder.');
      }

      // Length check
      if (subjectWithoutEmojis.length >= 30 && subjectWithoutEmojis.length <= 60) {
        score += 15;
        feedback.push('Optimal length! Your subject line is within the recommended range.');
      } else if (subjectWithoutEmojis.length < 30) {
        score += 5;
        feedback.push('Your subject line is concise, which can be effective. Consider if you can add more detail without exceeding 60 characters.');
      } else {
        feedback.push('Your subject line is on the longer side. Try to keep it under 60 characters to prevent truncation in some email clients.');
      }

      // Urgency and scarcity
      const urgencyWords = ['limited', 'exclusive', "don't miss", 'last chance', 'ending soon', 'only', 'hurry', 'quick', 'fast', 'now', 'today'];
      const usedUrgencyWords = urgencyWords.filter(word => words.includes(word));
      if (usedUrgencyWords.length > 0) {
        score += 10;
        feedback.push('Effective use of urgency or scarcity: ' + usedUrgencyWords.join(', '));
      }

      // Emoji usage
      const emojiCount = (subjectLine.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu) || []).length;
      if (emojiCount === 1) {
        score += 5;
        feedback.push('Good use of a single emoji. This can increase visual appeal without overwhelming.');
      } else if (emojiCount > 1) {
        feedback.push('Multiple emojis detected. Use with caution as it may appear unprofessional in some contexts.');
      }

      // Impactful words
      const impactfulWords = ['new', 'announcement', 'important', 'breaking', 'alert', 'update', 'introducing', 'discover', 'revealed', 'finally'];
      const usedImpactfulWords = impactfulWords.filter(word => words.includes(word));
      if (usedImpactfulWords.length > 0) {
        score += 5;
        feedback.push(`Strong word choice: ${usedImpactfulWords.join(', ')}`);
      }

      // Call to action
      const ctaWords = ['get', 'download', 'try', 'buy', 'subscribe', 'learn', 'discover', 'find out', 'see', 'watch'];
      const usedCtaWords = ctaWords.filter(word => words.includes(word));
      if (usedCtaWords.length > 0) {
        score += 5;
        feedback.push('Includes a clear call to action: ' + usedCtaWords.join(', '));
      }

      // Question mark
      if (subjectLine.includes('?')) {
        score += 5;
        feedback.push('Using a question can engage curiosity and boost open rates.');
      }

      // Avoid ALL CAPS
      if (subjectLine === subjectLine.toUpperCase() && subjectLine.length > 10) {
        score -= 10;
        feedback.push('Avoid using ALL CAPS as it may trigger spam filters and appear like shouting.');
      }

      // Numbers
      if (/\b\d+\b/.test(subjectLine)) {
        score += 5;
        feedback.push('Including numbers can make your subject line more specific and compelling.');
      }

      // Spam trigger words check
      const spamTriggerWords = ['free', 'guarantee', 'no obligation', 'winner', 'congratulations', 'prize', 'urgent', 'act now'];
      const usedSpamWords = spamTriggerWords.filter(word => words.includes(word));
      if (usedSpamWords.length > 0) {
        score -= 10;
        feedback.push('Caution: Your subject line contains words often associated with spam: ' + usedSpamWords.join(', '));
      }

      // Final adjustments
      score = Math.max(0, Math.min(100, score));

      if (score >= 90) {
        feedback.push('Excellent subject line! It effectively uses multiple best practices for email marketing.');
      } else if (score >= 70) {
        feedback.push('Good subject line. Consider the feedback to potentially improve its effectiveness.');
      } else {
        feedback.push('There\'s room for improvement. Review the suggestions to craft a more impactful subject line.');
      }

      const newAnalysis = {
        id: Date.now().toString(),
        subjectLine,
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
    <div className="flex justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-green-600">
          <h1 className="text-4xl font-bold text-white font-iowan">Email Subject Line Analyzer</h1>
        </div>

        <div className="p-6">
          <div className="mb-6 relative">
            <input
              type="text"
              value={subjectLine}
              onChange={(e) => setSubjectLine(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && analyzeSubjectLine()}
              placeholder="Enter your email subject line"
              className="w-full p-4 pr-12 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
              disabled={isAnalyzing}
            />
            <button
              onClick={analyzeSubjectLine}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-lg transition duration-300 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
              aria-label="Analyze"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <RefreshCw className="animate-spin" size={24} /> : <Send size={24} />}
            </button>
          </div>

          {analysis && (
            <ul className="space-y-3">
              {analysis && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-inner animate-fade-in">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 font-iowan">Analysis Results</h2>
                  <div className="flex items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center mr-6">
                      <span className="text-4xl font-bold text-white">{analysis.score}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-xl text-gray-800">Effectiveness Score</p>
                      <p className="text-gray-600">Out of 100</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {analysis.feedback.map((item, index) => (
                      <li key={index} className="flex items-center bg-white p-3 rounded-lg shadow">
                        <span className="mr-3 flex-shrink-0">
                          {item.startsWith('Good') || item.includes('piques curiosity') || item.includes('creates a sense of urgency') ? (
                            <span className="text-green-500">✅</span>
                          ) : item.includes('Consider') || item.toLowerCase().includes('caution') || item.toLowerCase().includes('avoid') ? (
                            <span className="text-yellow-500">⚠️</span>
                          ) : (
                            <span className="text-blue-500">ℹ️</span>
                          )}
                        </span>
                        <span className="text-gray-700 flex-grow">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ul>
          )}

          {pastAnalyses.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 font-iowan">Past Analyses</h2>
                <button
                  onClick={clearAllAnalyses}
                  className="text-red-500 hover:text-red-700 flex items-center"
                  aria-label="Clear all analyses"
                >
                  <Trash2 size={20} className="mr-1" />
                  Clear All
                </button>
              </div>
              <ul className="space-y-3">
                {pastAnalyses.map((pastAnalysis) => (
                  <li key={pastAnalysis.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{pastAnalysis.subjectLine}</p>
                      <p className="text-sm text-gray-500">Score: {pastAnalysis.score}</p>
                    </div>
                    <button
                      onClick={() => deleteAnalysis(pastAnalysis.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Delete analysis for "${pastAnalysis.subjectLine}"`}
                    >
                      <Trash2 size={20} />
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

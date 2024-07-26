"use client";

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Send } from 'lucide-react';

const commonWords = ['free', 'urgent', 'limited time', 'exclusive', 'sale', 'discount', 'offer', 'now', 'don\'t miss', 'act fast'];
const spamTriggerWords = ['viagra', 'enlargement', 'miracle', 'guaranteed', 'cash', 'winner', 'prize', 'Nigerian prince'];

const SubjectLineAnalyzer: React.FC = () => {
  const [subjectLine, setSubjectLine] = useState('');
  const [analysis, setAnalysis] = useState<{ score: number; feedback: string[] } | null>(null);

  const analyzeSubjectLine = () => {
    if (!subjectLine.trim()) {
      setAnalysis({ score: 0, feedback: ['Please enter a subject line.'] });
      return;
    }

    let score = 50;
    const feedback: string[] = [];

    // Length check
    if (subjectLine.length < 20) {
      score -= 10;
      feedback.push('Subject line is too short. Aim for 20-60 characters.');
    } else if (subjectLine.length > 60) {
      score -= 10;
      feedback.push('Subject line is too long. Keep it under 60 characters.');
    } else {
      score += 10;
      feedback.push('Good length!');
    }

    // Check for common words
    const usedCommonWords = commonWords.filter(word => subjectLine.toLowerCase().includes(word));
    if (usedCommonWords.length > 0) {
      score += 5;
      feedback.push(`Good use of engaging words: ${usedCommonWords.join(', ')}`);
    } else {
      score -= 5;
      feedback.push('Consider using some engaging words to increase open rates.');
    }

    // Check for spam trigger words
    const usedSpamWords = spamTriggerWords.filter(word => subjectLine.toLowerCase().includes(word));
    if (usedSpamWords.length > 0) {
      score -= 20;
      feedback.push(`Avoid spam trigger words: ${usedSpamWords.join(', ')}`);
    }

    // Capitalization check
    if (subjectLine === subjectLine.toUpperCase()) {
      score -= 10;
      feedback.push('Avoid using all caps as it may trigger spam filters.');
    }

    // Special character check
    const specialChars = subjectLine.match(/[^a-zA-Z0-9\s]/g) || [];
    if (specialChars.length > 2) {
      score -= 5;
      feedback.push('Too many special characters may trigger spam filters.');
    }

    // Personalization check
    if (subjectLine.toLowerCase().includes('{name}') || subjectLine.toLowerCase().includes('{company}')) {
      score += 10;
      feedback.push('Good use of personalization!');
    }

    // Final score adjustments
    score = Math.max(0, Math.min(100, score));

    setAnalysis({ score, feedback });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 font-merriweather">Email Subject Line Analyzer</h1>
      <p className="text-lg text-gray-600 mb-8">Optimize your email campaigns with our AI-powered subject line analyzer. Get instant feedback to boost open rates and engagement.</p>

      <div className="mb-6 relative">
        <input
          type="text"
          value={subjectLine}
          onChange={(e) => setSubjectLine(e.target.value)}
          placeholder="Enter your email subject line"
          className="w-full p-4 pr-12 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition duration-300"
        />
        <button
          onClick={analyzeSubjectLine}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition duration-300"
          aria-label="Analyze"
        >
          <Send size={24} />
        </button>
      </div>

      {analysis && (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-inner">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Analysis Results</h2>
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center mr-6">
              <span className="text-4xl font-bold text-teal-600">{analysis.score}</span>
            </div>
            <div>
              <p className="font-semibold text-xl text-gray-800">Effectiveness Score</p>
              <p className="text-gray-600">Out of 100</p>
            </div>
          </div>
          <ul className="space-y-3">
            {analysis.feedback.map((item, index) => (
              <li key={index} className="flex items-start bg-white p-3 rounded-lg shadow">
                {item.startsWith('Good') || item.includes('personalization') ? (
                  <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                ) : (
                  <AlertCircle className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
                )}
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubjectLineAnalyzer;
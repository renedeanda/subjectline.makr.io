import os

def create_or_update_file(path, content):
    print(f"Updating file: {path}")
    directory = os.path.dirname(path)
    if directory and not os.path.exists(directory):
        os.makedirs(directory)
    with open(path, 'w') as f:
        f.write(content)

def main():
    # Update SubjectLineAnalyzer.tsx
    subject_line_analyzer_content = """
'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Send, Trash2, RefreshCw } from 'lucide-react';

const commonWords = ['free', 'urgent', 'limited time', 'exclusive', 'sale', 'discount', 'offer', 'now', 'don\'t miss', 'act fast'];
const spamTriggerWords = ['viagra', 'enlargement', 'miracle', 'guaranteed', 'cash', 'winner', 'prize', 'Nigerian prince'];

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

      let score = 50;
      const feedback: string[] = [];

      // Length check
      if (subjectLine.length < 20) {
        score -= 10;
        feedback.push('Subject line is too short. Aim for 20-60 characters. Try adding more descriptive words or a call to action.');
      } else if (subjectLine.length > 60) {
        score -= 10;
        feedback.push('Subject line is too long. Keep it under 60 characters. Try removing unnecessary words or simplifying your message.');
      } else {
        score += 10;
        feedback.push('Good length! Your subject line is the optimal length for most email clients.');
      }

      // Check for common words
      const usedCommonWords = commonWords.filter(word => subjectLine.toLowerCase().includes(word));
      if (usedCommonWords.length > 0) {
        score += 5;
        feedback.push(`Good use of engaging words: ${usedCommonWords.join(', ')}. These words can help increase open rates.`);
      } else {
        score -= 5;
        feedback.push('Consider using some engaging words to increase open rates. Try incorporating words like "exclusive", "limited time", or "free" if appropriate.');
      }

      // Check for spam trigger words
      const usedSpamWords = spamTriggerWords.filter(word => subjectLine.toLowerCase().includes(word));
      if (usedSpamWords.length > 0) {
        score -= 20;
        feedback.push(`Avoid spam trigger words: ${usedSpamWords.join(', ')}. These words can cause your email to be flagged as spam. Try rephrasing your subject line to avoid these terms.`);
      }

      // Capitalization check
      if (subjectLine === subjectLine.toUpperCase()) {
        score -= 10;
        feedback.push('Avoid using all caps as it may trigger spam filters and can come across as shouting. Try using sentence case instead.');
      }

      // Special character check
      const specialChars = subjectLine.match(/[^a-zA-Z0-9\s]/g) || [];
      if (specialChars.length > 2) {
        score -= 5;
        feedback.push('Too many special characters may trigger spam filters. Try limiting special characters to one or two for emphasis.');
      }

      // Personalization check
      if (subjectLine.toLowerCase().includes('{name}') || subjectLine.toLowerCase().includes('{company}')) {
        score += 10;
        feedback.push('Good use of personalization! Personalized subject lines can significantly increase open rates.');
      } else {
        feedback.push('Consider adding personalization to your subject line. Using merge tags like {name} or {company} can increase engagement.');
      }

      // Curiosity and urgency check
      if (subjectLine.includes('?') || subjectLine.toLowerCase().includes('how') || subjectLine.toLowerCase().includes('why')) {
        score += 5;
        feedback.push('Your subject line piques curiosity, which can boost open rates. Good job!');
      } else {
        feedback.push('Consider adding an element of curiosity to your subject line. Asking a question or hinting at valuable information can increase opens.');
      }

      if (subjectLine.toLowerCase().includes('limited') || subjectLine.toLowerCase().includes('soon') || subjectLine.toLowerCase().includes('now')) {
        score += 5;
        feedback.push('Your subject line creates a sense of urgency, which can motivate recipients to open the email.');
      } else {
        feedback.push('If appropriate, try adding a sense of urgency to your subject line. Words like "limited time" or "act now" can increase open rates.');
      }

      // Final score adjustments
      score = Math.max(0, Math.min(100, score));

      const newAnalysis: AnalysisResult = {
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
    }, 1000); // Simulated delay for analysis
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-green-500 flex flex-col">
      <div className="bg-blue-600 text-white p-4 text-center">
        <p className="text-lg">Check out 📚 <a href="https://rede.io" className="underline">Rede.io</a> for your daily tech newsletter!</p>
      </div>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-green-600">
            <h1 className="text-4xl font-bold text-white font-iowan">Email Subject Line Analyzer</h1>
            <p className="text-xl text-blue-100 mt-2">Optimize your email campaigns with AI-powered analysis</p>
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
                    <li key={index} className="flex items-start bg-white p-3 rounded-lg shadow">
                      {item.startsWith('Good') || item.includes('personalization') ? (
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                      )}
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
    </div>
  );
};

export default SubjectLineAnalyzer;
"""
    create_or_update_file("src/app/components/SubjectLineAnalyzer.tsx", subject_line_analyzer_content)

    # Update layout.tsx
    layout_content = """
import React from 'react';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Email Subject Line Analyzer | Boost Your Open Rates',
  description: 'Improve your email marketing with our AI-powered subject line analyzer. Get instant feedback to increase open rates and engagement.',
  keywords: 'email marketing, subject line analyzer, open rates, email engagement',
  openGraph: {
    title: 'Email Subject Line Analyzer | Boost Your Open Rates',
    description: 'Improve your email marketing with our AI-powered subject line analyzer. Get instant feedback to increase open rates and engagement.',
    url: 'https://subject-line-analyzer.makr.io',
    siteName: 'Email Subject Line Analyzer',
    images: [
      {
        url: 'https://subject-line-analyzer.makr.io/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Email Subject Line Analyzer | Boost Your Open Rates',
    description: 'Improve your email marketing with our AI-powered subject line analyzer. Get instant feedback to increase open rates and engagement.',
    images: ['https://subject-line-analyzer.makr.io/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link href="https://fonts.googleapis.com/css2?family=Iowan+Old+Style&display=swap" rel="stylesheet" />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
"""
    create_or_update_file("src/app/layout.tsx", layout_content)

    print("Project files have been updated successfully!")
    print("To run the project:")
    print("1. Ensure you have all required dependencies installed:")
    print("   npm install")
    print("2. Start the development server:")
    print("   npm run dev")
    print("3. Open your browser and navigate to http://localhost:3000")

if __name__ == "__main__":
    main()
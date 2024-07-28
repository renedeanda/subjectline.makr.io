
import React from 'react';
import SubjectLineAnalyzer from './components/SubjectLineAnalyzer';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-500 to-green-500">
      <Link href="https://rede.io/?utm_source=subject-line-analyzer" className="bg-blue-600 text-white p-4 text-center hover:bg-blue-700 transition duration-300">
        <p className="text-lg">Check out 📚 Rede.io for your daily tech newsletter!</p>
      </Link>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
        <SubjectLineAnalyzer />
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Crafted with 🧡 + 🤖 by the <Link href="https://rede.io/?utm_source=subject-line-analyzer" className="text-amber-500 hover:underline">Rede team</Link></p>
          <p className="mt-2 text-blue-200">
            A free tool for email marketers and developers to analyze email subject lines instantly.
          </p>
        </div>
      </footer>
    </div>
  );
}

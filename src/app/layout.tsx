import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Email Subject Line Analyzer | Boost Your Open Rates',
  description: 'Improve your email marketing with our powerful subject line analyzer. Get instant feedback to increase open rates and engagement.',
  keywords: 'email marketing, subject line analyzer, open rates, email engagement',
  openGraph: {
    title: 'Email Subject Line Analyzer | Boost Your Open Rates',
    description: 'Improve your email marketing with our powerful subject line analyzer. Get instant feedback to increase open rates and engagement.',
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
    description: 'Improve your email marketing with our powerful subject line analyzer. Get instant feedback to increase open rates and engagement.',
    images: ['https://subject-line-analyzer.makr.io/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
      <body className={`${inter.className} bg-gray-100`}>
        <header className="bg-teal-600 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Subject Line Analyzer</h1>
            <a href="https://rede.io/?utm_source=subject-line-tester" className="hover:underline text-white">
              Check out 📚 Rede.io for your daily tech newsletter!
            </a>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12">{children}</main>
        <footer className="bg-gray-800 text-white p-6">
          <div className="max-w-6xl mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Crafted with 🧡 + 🤖 by the <a href="https://rede.io/?utm_source=dmarc" className="text-teal-300 hover:underline">Rede team</a></p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
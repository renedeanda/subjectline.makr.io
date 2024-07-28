
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

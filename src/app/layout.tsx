import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI Automation for Business Owners | Build Custom AI Tools With Angel Arrieta",
  description: "Turn your processes into AI-powered tools. 1:1 mentoring to build custom AI solutions with Claude, Perplexity, Gemini and more. Free 20-minute strategy call.",
  keywords: ['AI Consulting', 'Automation', 'Custom AI Tools', 'Claude', 'OpenAI', 'Gemini', 'Business AI'],
  openGraph: {
    title: "AI Automation for Business Owners | Build Custom AI Tools With Angel Arrieta",
    description: "Turn your processes into AI-powered tools. 1:1 mentoring to build custom AI solutions with Claude, Perplexity, Gemini and more. Free 20-minute strategy call."
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

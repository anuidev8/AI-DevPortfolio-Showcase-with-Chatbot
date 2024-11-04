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
  title: "Angel Arrieta",
  description: "I’m a skilled web UI developer with a Computer Science degree and over 6 years of experience delivering interactive, accessible, and visually compelling web applications. With expertise in JavaScript frameworks like React.js, Next.js, Vue.js, and Nuxt.js, I create seamless animations and engaging user experiences. My strong foundation in HTML, CSS, and SVG ensures every application is designed for both beauty and functionality. Let’s work together to build something remarkable!",
  keywords:['JavaScript Developer Medellín', "Full Stack Web Developer", "React developer", "Next.js Developer", "Vue.js Developer", "SVG Animation" , "HTML5/CSS3 Development", "Medellín Tech Community", "WebRTC", "Microsoft Entra ID", "Lottie Animation"]
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

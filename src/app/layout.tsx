import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Context Engineering Academy — Master LLM Context Design",
    template: "%s | Context Engineering Academy",
  },
  description:
    "Master the art and science of context engineering for LLMs and AI agents. 11 chapters, 7 interactive code examples, 6 anti-patterns, and a hands-on playground.",
  keywords: [
    "context engineering",
    "LLM",
    "AI agents",
    "prompt engineering",
    "RAG",
    "AI development",
    "context window",
    "system prompts",
    "few-shot learning",
    "AI best practices",
  ],
  authors: [{ name: "Context Engineering Academy" }],
  creator: "Context Engineering Academy",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Context Engineering Academy — Master LLM Context Design",
    description:
      "The complete guide to context engineering. 11 chapters, interactive code examples, anti-patterns, and a hands-on playground to master LLM context design.",
    siteName: "Context Engineering Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Context Engineering Academy",
    description:
      "Master the art and science of filling the LLM context window with the right information. Interactive guide with code examples and a hands-on playground.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Context Engineering Academy",
  description:
    "The complete guide to context engineering for LLMs and AI agents. From fundamentals to production patterns.",
  provider: {
    "@type": "Organization",
    name: "Context Engineering Academy",
  },
  numberOfCredits: 0,
  isAccessibleForFree: true,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT2H",
  },
  about: [
    "Context Engineering",
    "Large Language Models",
    "AI Agents",
    "Prompt Engineering",
    "RAG",
  ],
  teaches: [
    "How to design effective context windows for LLMs",
    "The 6 core components of context engineering",
    "Anti-patterns to avoid in AI agent development",
    "Production-ready context engineering patterns",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-grid`}
      >
        {children}
      </body>
    </html>
  );
}

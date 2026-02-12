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
    default: "LLM/Agent Engineering Academy — Master Every Layer of the AI Agent Stack",
    template: "%s | LLM/Agent Engineering Academy",
  },
  description:
    "The open-source AI training platform that uses your codebase as the curriculum. 6 academies, 70+ modules, interactive playgrounds. Enterprise edition contextualizes everything with your actual code.",
  keywords: [
    "context engineering",
    "LLM",
    "AI agents",
    "prompt engineering",
    "RAG",
    "agentic RAG",
    "multi-agent orchestration",
    "LLM evals",
    "agent observability",
    "MCP",
    "Model Context Protocol",
    "AI training platform",
    "enterprise AI training",
    "AI upskilling",
  ],
  authors: [{ name: "LLM/Agent Engineering Academy" }],
  creator: "LLM/Agent Engineering Academy",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "LLM/Agent Engineering Academy — Master Every Layer of the AI Agent Stack",
    description:
      "6 academies, 70+ modules, interactive playgrounds. Free & open source. Enterprise edition uses your codebase as the curriculum.",
    siteName: "LLM/Agent Engineering Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM/Agent Engineering Academy",
    description:
      "The open-source AI training platform. 6 academies covering context engineering, observability, evals, RAG, multi-agent orchestration, and tool design. Enterprise edition uses your codebase.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "LLM/Agent Engineering Academy",
  description:
    "The open-source AI training platform. 6 academies covering context engineering, observability, evals, RAG, multi-agent orchestration, and tool design — with interactive playgrounds.",
  provider: {
    "@type": "Organization",
    name: "LLM/Agent Engineering Academy",
  },
  numberOfCredits: 0,
  isAccessibleForFree: true,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT10H",
  },
  about: [
    "Context Engineering",
    "Large Language Models",
    "AI Agents",
    "Agent Observability",
    "LLM Evaluations",
    "Retrieval-Augmented Generation",
    "Multi-Agent Orchestration",
    "Model Context Protocol",
  ],
  teaches: [
    "How to design effective context windows for LLMs",
    "How to trace, debug, and monitor AI agents in production",
    "How to build evaluation systems for LLM applications",
    "How to implement production-grade RAG architectures",
    "How to orchestrate teams of specialized AI agents",
    "How to design tools and MCP servers for AI agents",
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

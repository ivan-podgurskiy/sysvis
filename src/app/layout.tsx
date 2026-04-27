import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "System Design Visualizer",
  description:
    "Interactive visualizer of how popular tech companies' systems work under the hood.",
  keywords: ["system design", "architecture", "interactive", "visualization"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}

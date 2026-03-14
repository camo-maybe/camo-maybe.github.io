import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio | camo-maybe",
  description: "Software Engineer - AI, Cloud, and Automation projects",
  openGraph: {
    title: "Portfolio | camo-maybe",
    description: "Software Engineer - AI, Cloud, and Automation projects",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-950 text-gray-100 font-[Inter] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

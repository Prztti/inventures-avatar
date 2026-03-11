import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InVentures AI Avatar",
  description: "AI-powered advisory assistant for InVentures GmbH",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-near-black text-white antialiased">{children}</body>
    </html>
  );
}

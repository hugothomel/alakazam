import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alakazam — AI-Native Games",
  description: "Breaking the cost curve of game creation with AI-native world models, synthetic training data, and local deployment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

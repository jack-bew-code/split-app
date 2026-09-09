import type { Metadata } from "next";
import { APP_VERSION } from "@/lib/version";
import "./globals.css";

export const metadata: Metadata = {
  title: "Split Simple",
  description: "A simple expense splitter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="fixed top-2 right-4 text-xs font-mono text-gray-400 z-50">
          v{APP_VERSION}
        </div>
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import pkg from "../package.json";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
    // suppressHydrationWarning is required by next-themes to prevent console errors
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="fixed top-2 right-4 text-xs font-mono text-gray-500 z-50">
            v{pkg.version}
          </div>
          
          {children}
          
        </ThemeProvider>
      </body>
    </html>
  );
}
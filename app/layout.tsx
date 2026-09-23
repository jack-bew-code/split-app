import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import pkg from "../package.json";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Split Simple",
  description: "A simple expense splitter",
};

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], 
  variable: '--font-roboto',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is required by next-themes to prevent console errors
    <html lang="en" suppressHydrationWarning className={roboto.variable}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="fixed top-2 right-4 z-50 flex items-center gap-2">
            <ThemeToggle />
            <div className="text-xs font-mono text-gray-500">
              v{pkg.version}
            </div>
          </div>    
          {children}
          <Toaster></Toaster>
          
        </ThemeProvider>
      </body>
    </html>
  );
}
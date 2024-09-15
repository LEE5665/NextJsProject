'use client';
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";
import { ThemeProvider } from 'next-themes';

const bold = Noto_Sans_KR({
  weight: "500",
  display: "fallback",
  subsets: ["latin"],
  style: "normal",
  variable: "--noto-sans_KR-bold",
  fallback: ["system-ui"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={bold.className}
      >
        <SessionProvider><ThemeProvider attribute="class">{children}</ThemeProvider></SessionProvider>
      </body>
    </html>
  );
}

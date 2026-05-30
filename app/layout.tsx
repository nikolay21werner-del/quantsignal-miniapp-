import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TelegramProvider } from "@/components/TelegramProvider";

export const metadata: Metadata = {
  title: "QUANTSIGNAL AI",
  description: "Premium AI-driven crypto signals, markets and portfolio — Telegram Mini App.",
  applicationName: "QUANTSIGNAL AI",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#05070A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async />
      </head>
      <body className="font-sans antialiased">
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}

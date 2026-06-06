import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ColorPresetProvider } from "@/components/color-preset-provider";
import { getColorPresetBootScript } from "@/lib/color-presets";

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Mirante Painel",
  description: "Portal de Gestão Pública Municipal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={fontSans.variable}>
      <body className="antialiased">
        <Script id="color-preset-boot" strategy="beforeInteractive">
          {getColorPresetBootScript()}
        </Script>
        <ThemeProvider>
          <ColorPresetProvider>{children}</ColorPresetProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
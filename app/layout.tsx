import type { Metadata } from "next";
import "./globals.css";
import { archivo } from "@/components/ui/fonts";

export const metadata: Metadata = {
  title: "Home",
  description: "Solar Agent",
  keywords: ['solar energy']
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} font-main bg-background text-primary antialiased flex flex-col min-h-screen`}
      >
        {children}

      </body>
    </html>
  )
};
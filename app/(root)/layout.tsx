import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../../app/globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shey Salon & Spa",
  description: "A modern salon and spa finder in your city",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}

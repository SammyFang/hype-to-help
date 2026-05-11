import type { Metadata } from "next";
import { AppNav } from "@/components/AppNav";
import { FirebaseAnalytics } from "@/components/FirebaseAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hype-to-Help: Team USA Fan Impact League",
  description:
    "A Gemini-powered fan quest system that turns Olympic and Paralympic attention into safe, inclusive, measurable Team USA support.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>
        <FirebaseAnalytics />
        <AppNav />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}

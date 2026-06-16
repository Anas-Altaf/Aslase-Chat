import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "AslasChat - Modern Real-time Communication",
  description: "A modern, scalable chat application built with Next.js 15, React 19, and TypeScript",
};

// This is an auth-gated, client-data app — nothing should be statically prerendered.
// Forcing dynamic rendering app-wide also avoids the build-time "useSearchParams must
// be wrapped in Suspense" prerender error on client pages that read query params.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

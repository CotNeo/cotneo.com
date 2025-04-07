import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Furkan Akar | Full Stack Developer",
    template: "%s | Furkan Akar"
  },
  description: "Full Stack Developer specializing in Next.js, TypeScript, and cloud solutions. Building modern web applications with a focus on performance and user experience.",
  keywords: ["Full Stack Developer", "Next.js", "TypeScript", "React", "Node.js", "Web Development", "Cloud Solutions", "Furkan Akar"],
  authors: [{ name: "Furkan Akar" }],
  creator: "Furkan Akar",
  publisher: "Furkan Akar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://cotneo.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Furkan Akar | Full Stack Developer",
    description: "Full Stack Developer specializing in Next.js, TypeScript, and cloud solutions. Building modern web applications with a focus on performance and user experience.",
    url: "https://cotneo.com",
    siteName: "Furkan Akar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Furkan Akar - Full Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Furkan Akar | Full Stack Developer",
    description: "Full Stack Developer specializing in Next.js, TypeScript, and cloud solutions.",
    creator: "@cotneo",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

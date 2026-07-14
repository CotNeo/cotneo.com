import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

const description =
  "Full-Stack & Mobile Software Developer in Istanbul. React, Next.js, TypeScript, Node.js, .NET 8, native Android and Oracle PL/SQL — building web, mobile and enterprise software for real-world logistics operations.";

export const metadata: Metadata = {
  title: {
    default: "Furkan Akar | Full-Stack & Mobile Software Developer",
    template: "%s | Furkan Akar",
  },
  description,
  keywords: [
    "Full-Stack Developer",
    "Mobile Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Node.js Developer",
    ".NET Developer",
    "Android Developer",
    "React Native Developer",
    "Oracle PL/SQL",
    "Enterprise Software Developer",
    "Logistics Software",
    "Software Developer Turkey",
    "Furkan Akar",
  ],
  authors: [{ name: "Furkan Akar", url: "https://cotneo.com" }],
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
    title: "Furkan Akar | Full-Stack & Mobile Software Developer",
    description:
      "Web, mobile and enterprise software for real-world operations — React, Next.js, Node.js, .NET 8, native Android and Oracle PL/SQL.",
    url: "https://cotneo.com",
    siteName: "Furkan Akar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Furkan Akar — Full-Stack & Mobile Software Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Furkan Akar | Full-Stack & Mobile Software Developer",
    description:
      "Web, mobile and enterprise software for real-world operations — React, Next.js, Node.js, .NET 8, Android, Oracle PL/SQL.",
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
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Furkan Akar",
  url: "https://cotneo.com",
  jobTitle: "Full-Stack & Mobile Software Developer",
  email: "mailto:furkanaliakar@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Istanbul",
    addressCountry: "TR",
  },
  sameAs: [
    "https://github.com/CotNeo",
    "https://www.linkedin.com/in/furkanaliakar/",
    "https://stackoverflow.com/users/25318290/cotneo",
    "https://medium.com/@furkanaliakar",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    ".NET",
    "C#",
    "Java",
    "Android",
    "React Native",
    "Oracle Database",
    "PL/SQL",
    "Enterprise Integrations",
    "Logistics Software",
  ],
  knowsLanguage: ["tr", "en"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0a0e14" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}

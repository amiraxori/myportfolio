import { Metadata } from 'next';
import { ThemeProviderWrapper } from '@/components/ThemeProviderWrapper';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL("https://amirshrestha2036.com.np"),
  title: {
    default: "Amir Shrestha | Full Stack Developer",
    template: "%s | Amir Shrestha"
  },
  description: "Premium personal brand freelancer portfolio of Amir Shrestha, a React-first developer with MERN + TypeScript and Django expertise.",
  keywords: ["React", "Next.js", "Full Stack Developer", "MERN", "Django", "TypeScript", "Nepal"],
  authors: [{ name: "Amir Shrestha" }],
  creator: "Amir Shrestha",
  icons: {
    icon: "/profile.jpg",
    apple: "/profile.jpg"
  },
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: "https://amirshrestha2036.com.np",
    siteName: "Amir Shrestha Portfolio",
    title: "Amir Shrestha | Full Stack Developer",
    description: "Premium personal brand freelancer portfolio",
    images: [
      {
        url: "/profile-share.jpg",
        width: 1200,
        height: 630,
        alt: "Amir Shrestha"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Amir Shrestha | Full Stack Developer",
    description: "Premium personal brand freelancer portfolio",
    images: ["/profile-share.jpg"]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProviderWrapper
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}

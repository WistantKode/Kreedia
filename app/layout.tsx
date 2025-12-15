import { Providers } from "@/lib/providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kreedia - Clean the Environment, Earn Crypto",
  description:
    "Turn your environmental actions into tangible rewards. Join the revolutionary movement.",
  keywords: [
    "environmental",
    "crypto",
    "NFT",
    "blockchain",
    "sustainability",
    "Kreedia",
  ],
  authors: [{ name: "Kreedia Team" }],
  openGraph: {
    title: "Kreedia - Clean the Environment, Earn Crypto",
    description: "Turn your environmental actions into tangible rewards",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

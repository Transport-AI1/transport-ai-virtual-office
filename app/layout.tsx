import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Transport AI — Virtual Office",
  description: "Centro de dirección y operaciones de Transport AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

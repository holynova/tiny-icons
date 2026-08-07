import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiny Icons | Small by design",
  description: "Make clear, export-ready icons for Chrome extensions and favicons.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="e01c9f78-4607-4e60-b01c-77c8190b12b4"
          data-domains="holynova.github.io"
          data-exclude-search="true"
          data-exclude-hash="true"
        />
      </body>
    </html>
  );
}

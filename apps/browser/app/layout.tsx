import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Satori Patterns Browser",
  description: "Visual catalogue of Satori-compatible background patterns for OG images",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", background: "#fafafa" }}>
        {children}
      </body>
    </html>
  )
}

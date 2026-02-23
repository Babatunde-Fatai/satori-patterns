import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Satori Patterns",
  description: "Visual catalogue of Satori-compatible background patterns for OG images",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Geist+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          html { -webkit-font-smoothing: antialiased; }
          body {
            margin: 0;
            font-family: 'Inter', system-ui, sans-serif;
            background: #f5f2ee;
            color: #1a1a18;
            line-height: 1.5;
          }
          :root {
            --bg-base: #f5f2ee;
            --bg-surface: #ffffff;
            --bg-dark: #2f3e46;
            --accent: #656d4a;
            --accent-warm: #a68a64;
            --accent-deep: #7f5539;
            --text-primary: #1a1a18;
            --text-secondary: #5a5a52;
            --text-muted: #8a8a7a;
            --border: #e0dbd4;
            --border-dark: #c8c2b8;
            --radius-sm: 6px;
            --radius-md: 10px;
            --radius-lg: 16px;
            --shadow-card: 0 1px 4px rgba(65,72,51,0.08), 0 4px 16px rgba(65,72,51,0.06);
            --shadow-hover: 0 4px 12px rgba(65,72,51,0.14), 0 8px 32px rgba(65,72,51,0.08);
            --font-display: 'Geist Sans', 'Inter', system-ui, sans-serif;
            --font-body: 'Inter', system-ui, sans-serif;
            --transition: 160ms cubic-bezier(0.4, 0, 0.2, 1);
          }
          a { color: inherit; }
          button { font-family: inherit; }
          code, pre { font-family: 'JetBrains Mono', 'Fira Code', monospace; }

          @media (max-width: 640px) {
            :root { --radius-lg: 12px; }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}

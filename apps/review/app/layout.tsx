import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Satori Patterns — Review Tool",
  description: "Local-only approval tool for satori-patterns. Never deployed.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
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
            background: #0e0e0c;
            color: #e8e4dc;
            line-height: 1.5;
          }
          :root {
            --bg-base: #0e0e0c;
            --bg-surface: #111111;
            --bg-elevated: #1a1a16;
            --bg-border: #2a2a2a;
            --bg-border-light: #3a3a32;
            --accent: #656d4a;
            --accent-hover: #76805a;
            --accent-warm: #a68a64;
            --accent-deep: #7f5539;
            --text-primary: #e8e4dc;
            --text-secondary: #a8a49a;
            --text-muted: #6e6a62;
            --green: #4ade80;
            --green-bg: #052e16;
            --green-border: #1e4030;
            --red: #f87171;
            --red-bg: #230f0f;
            --red-border: #3d1818;
            --amber: #fbbf24;
            --amber-bg: #1a1200;
            --amber-border: #4a3800;
            --radius-sm: 6px;
            --radius-md: 10px;
            --radius-lg: 14px;
            --shadow-card: 0 1px 4px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3);
            --font-display: 'Geist Sans', 'Inter', system-ui, sans-serif;
            --font-body: 'Inter', system-ui, sans-serif;
            --transition: 140ms cubic-bezier(0.4, 0, 0.2, 1);
          }
          a { color: inherit; }
          button { font-family: inherit; }
          code, pre { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
          :focus-visible { outline: 2px solid var(--accent-warm); outline-offset: 2px; }
          @media (max-width: 640px) { :root { --radius-lg: 10px; } }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}

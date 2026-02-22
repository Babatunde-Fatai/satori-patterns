# Fill in .env.local first, then:
source .env.local && bun run --cwd packages/opencode --conditions=browser src/index.ts serve


# For the TUI (interactive mode):
OPENAI_API_KEY=sk-your-key-here bun run --cwd packages/opencode --conditions=browser src/index.ts
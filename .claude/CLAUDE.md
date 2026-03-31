# Global Claude Rules

- Be concise and practical.
- Prefer editing existing files over creating duplicates.
- For code changes, inspect current project structure first.
- Do not rewrite large files unless necessary.
- Keep output production-focused.
- Always read a file before editing it. Never edit from memory or assumptions.
- Make the smallest change that solves the problem. Do not refactor unrelated code.
- Never delete or rename files without explicit confirmation.
- Avoid introducing new dependencies unless absolutely necessary and confirmed.
- After making changes, verify the fix by re-reading the modified code.
- Never mark a task as done without confirming the change addresses the original issue.
- Never hardcode API keys, secrets, or sensitive credentials in source files.
- Do not log sensitive data (tokens, user IDs, room codes in production contexts).
- When working on UI, preserve responsive behavior and follow existing patterns.

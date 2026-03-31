# Working Rules

## 1. Documentation Verification
- Always read relevant docs, READMEs, and inline comments before making changes to any module.
- Never assume how a function, hook, or component works — verify by reading the source first.
- Check `package.json` for available scripts and dependency versions before suggesting installs or commands.

## 2. Minimal Safe Changes
- Make the smallest change that solves the problem. Do not refactor unrelated code.
- Never delete or rename files without explicit confirmation.
- Avoid introducing new dependencies unless absolutely necessary and confirmed by the user.
- If a fix touches more than one file, explain why before proceeding.

## 3. Read Before Edit
- Always read a file before editing it. Never edit from memory or assumptions.
- When fixing a bug, read the full function/component context, not just the error line.
- Check for existing patterns in the codebase and follow them (naming, file structure, styling conventions).

## 4. Verification Before Completion
- After making changes, verify the fix makes sense by re-reading the modified code.
- If a build/run command is available, suggest running it to confirm the change works.
- Never mark a task as done without confirming the change addresses the original issue.

## 5. Security
- Never hardcode API keys, secrets, or sensitive credentials in source files.
- Keep Firebase config and RevenueCat keys in their existing locations — do not move or duplicate.
- Do not log sensitive data (tokens, user IDs, room codes in production contexts).

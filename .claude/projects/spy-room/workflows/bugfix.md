# Bugfix Workflow

1. Read the full function/component context, not just the error line
2. Check related files (providers, utils, navigation) for side effects
3. Make the smallest change that fixes the problem
4. Re-read modified code to verify correctness
5. Log the fix in `session-log.md`

# Counting progression

Only compter-des-objets uses this policy. Other activities and parent screens are unchanged.

- Level 1: quantities 1-3, two choices. Level 2: 1-5, three choices. Level 3: 1-10, four choices.
- Start at level 1. Six consecutive correct answers without an example or earlier errors, across at least two visits, increase the level. These are initial product rules, not a validated assessment.
- Two incorrect attempts lower the saved level by one for the next round. Two errors within a round also reveal a numbered example. The current question and choices stay stable.
- Tapping objects is an allowed counting strategy at every level and does not prevent advancement. Response time is never used.
- Each visit has three completed rounds. Stars reward completion; they are not a mastery score.

## Future parent integration

Import countingStorageKey, readCountingProgress, and saveCountingProgress from src/bublii/utils/countingProgress.js. Pass a Storage implementation and the actual child ID. Data is in localStorage under bublii:learning:v1:<encoded-child-id>:compter-des-objets, separate from sessionStorage profiles. It persists on this browser/device only; clearing browser data removes it.

The version-1 record contains level, successStreak, successSessions, errorStreak, and the latest 200 answer attempts. Each attempt includes sessionId, round, level, target, answer, correct, helpUsed, hadError, objectsTapped, and recordedAt. No audio, video, age, or response duration is stored. An example without a subsequent answer is not recorded.

To reset, save freshCountingProgress() for the child. Account sync, parent UI, and access settings are separate integration work.

Run: node --test tests/countingProgress.test.mjs

Browser check (with the Vite server running): node scripts/test-counting-browser.mjs. Set COUNTING_TEST_URL to override http://127.0.0.1:5182. Requires Playwright and Chrome.

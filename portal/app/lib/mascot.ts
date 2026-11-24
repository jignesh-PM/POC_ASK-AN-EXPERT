/**
 * Mascot configuration — the single place to rename, re-voice or switch off
 * the portal guide. The artwork lives in `components/mascot/MascotArt.tsx`
 * and uses brand tokens only, so it follows light/dark themes automatically.
 * Admins can also hide it at runtime (Admin › Settings › Show portal guide).
 */
export type MascotMood = "idle" | "wave" | "think" | "happy" | "curious" | "oops";

export const mascotConfig = {
  /**
   * Code-level kill switch. Day to day, admins show or hide the guide in
   * Admin › Settings › Show portal guide (off by default).
   */
  enabled: true,
  name: "Ember",
  /** Short description used in accessible labels. */
  role: "your Morgan guide",
  /** What the mascot says in each mood. The first line is the default. */
  lines: {
    idle: ["I’m here if you need me."],
    wave: ["Hi, I’m Ember. Ask me about any Morgan product.", "Welcome back! What are you working on today?"],
    think: ["Searching Morgan products and documents…", "Checking approved sources…"],
    happy: ["Done! Here’s what I found.", "Saved. Nice work!"],
    curious: ["Nothing here yet. Try another search?", "Hmm, no matches. Let’s try different words."],
    oops: ["Oops, that page has moved.", "Something went wrong. Let’s try again."],
  } satisfies Record<MascotMood, string[]>,
} as const;

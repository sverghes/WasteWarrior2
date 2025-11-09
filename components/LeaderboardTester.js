/**
 * Legacy stub kept to avoid build errors after removing the leaderboard testing UI.
 * If this module is imported, it warns and renders nothing.
 */

const warnOnce = (() => {
  let warned = false;
  return () => {
    if (warned) {
      return;
    }
    warned = true;
    if (typeof console !== "undefined") {
      console.warn("LeaderboardTester has been removed. Please remove any remaining imports.");
    }
  };
})();

export default function LeaderboardTester() {
  warnOnce();
  return null;
}
/**
 * All leaderboard test utilities have been retired.
 * Each function now simply warns so any lingering imports do not break the build.
 */

const warn = (() => {
  let warned = false;
  return (method) => {
    if (warned) {
      return;
    }
    warned = true;
    if (typeof console !== "undefined") {
      console.warn(`Leaderboard testing utility '${method}' has been removed.`);
    }
  };
})();

const makeStub = (method) => async () => {
  warn(method);
  return false;
};

export const populateTestData = makeStub("populateTestData");
export const clearTestData = makeStub("clearTestData");
export const addCurrentUserTestData = makeStub("addCurrentUserTestData");
export const verifyLeaderboardData = makeStub("verifyLeaderboardData");
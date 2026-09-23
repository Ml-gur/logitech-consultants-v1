/**
 * Console-error filter for the E2E suite.
 *
 * The site loads two third-party embeds that we do not control:
 *   - the Dograh voice-agent widget (index.html), which fetches its config from
 *     api.dograh.com at runtime;
 *   - the Google Fonts / icon CDNs some browsers probe.
 * When the test environment has no route to those origins (CI, a sandbox, an
 * offline runner) the browser logs a network failure that has nothing to do
 * with our code, which made "zero console errors" fail for environmental
 * reasons only.
 *
 * Everything else — any error originating from our own scripts, React
 * warnings, unhandled rejections — still fails the test.
 */

const THIRD_PARTY_NOISE = [
  // Dograh voice widget: network + config fetches out of our control.
  /dograh/i,
  /ERR_NETWORK_CHANGED/,
  /Failed to load resource: net::ERR_(FAILED|BLOCKED|CONNECTION)/i,
]

export function isThirdPartyNoise(message: string): boolean {
  return THIRD_PARTY_NOISE.some((pattern) => pattern.test(message))
}

/** Keep only the console errors the site itself is responsible for. */
export function ownConsoleErrors(messages: string[]): string[] {
  return messages.filter((m) => !isThirdPartyNoise(m))
}

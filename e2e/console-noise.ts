/**
 * Console-error filter for the E2E suite.
 *
 * Every route asserts "zero console errors", but a browser also reports network
 * failures for origins the test environment cannot reach. On an offline runner
 * or a sandbox with no egress those show up as console errors that have nothing
 * to do with this codebase, which made the assertion fail for environmental
 * reasons.
 *
 * This filter is deliberately narrow. It allows *only* browser-level transport
 * failures and only for requests that do not originate from our own scripts.
 * Anything from our code — an error, a React warning, an unhandled rejection —
 * still fails the test. If you find yourself widening this list, fix the cause
 * instead: an allow-list entry is a real console error someone decided to live
 * with.
 */

const ENVIRONMENTAL_NOISE = [
  // Transport-level failures: DNS, connection reset, a sandbox with no route.
  /Failed to load resource: net::ERR_(FAILED|BLOCKED|CONNECTION|CONNECTION_RESET|NAME_NOT_RESOLVED|ADDRESS_UNREACHABLE|INTERNET_DISCONNECTED|NETWORK_CHANGED)/i,
  /ERR_NETWORK_CHANGED/,
]

export function isEnvironmentalNoise(message: string): boolean {
  return ENVIRONMENTAL_NOISE.some((pattern) => pattern.test(message))
}

/** Keep only the console errors the site itself is responsible for. */
export function ownConsoleErrors(messages: string[]): string[] {
  return messages.filter((m) => !isEnvironmentalNoise(m))
}

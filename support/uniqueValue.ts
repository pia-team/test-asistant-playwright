/**
 * Unique identifier values for form fields (personal number, account id, …).
 * Not for names, emails, or addresses.
 *
 * Pattern tokens (javafaker bothify-compatible):
 * - `#` → digit (prefers trailing digits of Date.now(), then random)
 * - `?` → uppercase letter A–Z
 * Other characters are kept as-is.
 */
export function uniqueFromPattern(pattern: string): string {
  if (!pattern) {
    throw new Error('uniqueFromPattern requires a non-empty pattern');
  }

  const digits = Date.now().toString();
  let digitIndex = digits.length;

  return pattern.replace(/#|\?/g, (token) => {
    if (token === '?') {
      return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    digitIndex -= 1;
    if (digitIndex >= 0) {
      return digits[digitIndex];
    }
    return String(Math.floor(Math.random() * 10));
  });
}

/**
 * Helper to format phone number to E.164 standard.
 * E.g.
 * - 08033221100 -> +2348033221100
 * - +2348033221100 -> +2348033221100
 * - 2348033221100 -> +2348033221100
 * - 8033221100 -> +2348033221100
 */
export function formatToE164(phone: string): string {
  if (!phone) return "";

  // Remove all non-digit characters except the leading '+'
  let cleaned = phone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  // If it starts with '0', it's a local Nigerian number (e.g. 08012345678)
  if (cleaned.startsWith("0")) {
    return "+234" + cleaned.slice(1);
  }

  // If it starts with '234' without '+', prepend '+'
  if (cleaned.startsWith("234") && cleaned.length >= 13) {
    return "+" + cleaned;
  }

  // If it's a 10-digit number without leading '0', assume it's a local number without '0'
  if (cleaned.length === 10) {
    return "+234" + cleaned;
  }

  // Default fallback: if it doesn't start with '+', prepend '+234'
  return "+234" + cleaned;
}

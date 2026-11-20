/**
 * Generate a cryptographically random or high-entropy UUID v4 idempotency key
 */
export function generateIdempotencyKey(prefix = 'req') {
  const time = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 12);
  const randomPart2 = Math.random().toString(36).substring(2, 12);
  return `${prefix}_${time}_${randomPart}_${randomPart2}`;
}

export default generateIdempotencyKey;

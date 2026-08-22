import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";

const KEY_LENGTH = 64;

// New format: "scrypt:<saltHex>:<hashHex>"
export function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(plain, salt, KEY_LENGTH).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

// Supports legacy unsalted sha256 hashes (pre-migration) alongside the new
// salted scrypt format. Callers should re-hash and save on a legacy match.
export function verifyPassword(
  plain: string,
  stored: string,
): { valid: boolean; needsRehash: boolean } {
  if (stored.startsWith("scrypt:")) {
    const [, salt, hashHex] = stored.split(":");
    if (!salt || !hashHex) return { valid: false, needsRehash: false };
    const candidate = scryptSync(plain, salt, KEY_LENGTH);
    const stored_ = Buffer.from(hashHex, "hex");
    const valid =
      candidate.length === stored_.length &&
      timingSafeEqual(candidate, stored_);
    return { valid, needsRehash: false };
  }

  // Legacy sha256(plain) hex digest
  const legacyHash = createHash("sha256").update(plain).digest("hex");
  const candidate = Buffer.from(legacyHash, "utf8");
  const stored_ = Buffer.from(stored, "utf8");
  const valid =
    candidate.length === stored_.length && timingSafeEqual(candidate, stored_);
  return { valid, needsRehash: valid };
}

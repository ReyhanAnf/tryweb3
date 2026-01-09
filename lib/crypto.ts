export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  // In a real app with a backend, we'd use a unique random salt per user.
  // Since this is a single-user private tool with no backend DB, we'll use a hardcoded salt
  // or one stored in config. For simplicity/portability of the hash, we use a fixed app-specific salt.
  // Warning: This reduces rainbow table protection if the salt is known, but acceptable for this threat model (local private tool).
  const salt = enc.encode("DEGEN_ANALYSIS_SYSTEM_SALT_V1");

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // Export the key as hex for storage/comparison
  const exported = await crypto.subtle.exportKey("raw", key);
  return Buffer.from(exported).toString("hex");
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

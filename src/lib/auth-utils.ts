export type ParsedSignupInput =
  | { ok: true; fullName: string; email: string; password: string }
  | { ok: false; message: string }

export function parseSignupInput(
  fullNameValue: unknown,
  emailValue: unknown,
  passwordValue: unknown,
): ParsedSignupInput {
  if (typeof fullNameValue !== 'string' || typeof emailValue !== 'string' || typeof passwordValue !== 'string') {
    return { ok: false, message: 'Enter your name, email address, and password.' }
  }

  const fullName = fullNameValue.trim()
  const email = emailValue.trim().toLowerCase()

  if (!fullName || fullName.length > 120) {
    return { ok: false, message: 'Your name must be between 1 and 120 characters.' }
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: 'Enter a valid email address.' }
  }

  if (!passwordValue || passwordValue.length > 128) {
    return { ok: false, message: 'Your password must be between 1 and 128 characters.' }
  }

  return { ok: true, fullName, email, password: passwordValue }
}

export function buildCandidateSignupMetadata(fullName: string) {
  return { full_name: fullName, role: 'candidate' as const }
}

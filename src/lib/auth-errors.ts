export function translateAuthError(message: string): string {
  const m = message.toLowerCase();

  if (m.includes("rate limit") || m.includes("over_email_send_rate_limit")) {
    return "Terlalu banyak percobaan email. Coba lagi dalam beberapa menit.";
  }
  if (m.includes("invalid login")) return "Email atau password salah.";
  if (
    m.includes("already registered") ||
    m.includes("already been registered") ||
    m.includes("user already registered")
  ) {
    return "Email sudah terdaftar. Silakan masuk.";
  }
  if (m.includes("password")) return "Password minimal 6 karakter.";
  if (m.includes("email")) return "Format email tidak valid.";

  return message;
}

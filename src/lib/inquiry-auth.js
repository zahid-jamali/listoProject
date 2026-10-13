/**
 * Shared handler for listing-inquiry soft-signup responses.
 * Call after a successful inquiry API response.
 */
export function applyInquiryAuthResult(data, { login, isLoggedIn } = {}) {
  const auth = data?.auth;
  const accountExists = Boolean(data?.account_exists);
  const provider = data?.provider;

  if (auth?.token && typeof login === "function") {
    login({
      token: auth.token,
      name: auth.name,
      email: auth.email,
      verified: auth.verified === true,
      must_set_password: Boolean(auth.must_set_password),
    });

    return {
      type: "soft_signup",
      needs_verify: true,
      email: auth.email,
      toast:
        "Inquiry sent. Check your email for your login PIN and verification link.",
    };
  }

  if (accountExists) {
    if (provider) {
      return {
        type: "account_exists_social",
        toast: `Inquiry sent. This email is registered with ${provider} — please sign in with ${provider}.`,
      };
    }
    return {
      type: "account_exists",
      needs_login: !isLoggedIn,
      toast: isLoggedIn
        ? "Inquiry sent. We'll get back to you shortly."
        : "Inquiry sent. Sign in with your email and PIN from your welcome email.",
    };
  }

  return {
    type: "inquiry_only",
    toast: "Your inquiry has been sent.",
  };
}

export function extractInquiryError(data, fallback = "Failed to send inquiry") {
  if (!data) return fallback;
  if (typeof data.message === "string") return data.message;
  if (data.message?.message) return data.message.message;
  if (Array.isArray(data.errors) && data.errors.length) {
    const first = data.errors[0];
    const val = Object.values(first || {})[0];
    return val || fallback;
  }
  return fallback;
}

import { NextResponse } from "next/server";
import { LISTO_BASE_URL, DEFAULT_HEADERS } from "@/lib/listo-proxy";

/**
 * Proxy: POST /api/user/verify-and-set-password
 * Body: { token, password, password_confirm? }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const token = body.token;
    const password = body.password;
    const password_confirm = body.password_confirm;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Verification token is required." },
        { status: 400 },
      );
    }

    if (!password || String(password).length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters.",
          inputError: "password",
        },
        { status: 400 },
      );
    }

    if (
      password_confirm != null &&
      String(password) !== String(password_confirm)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match.",
          inputError: "password",
        },
        { status: 400 },
      );
    }

    const upstream = await fetch(
      `${LISTO_BASE_URL}/api/user/verify-and-set-password`,
      {
        method: "POST",
        headers: {
          ...DEFAULT_HEADERS,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          password_confirm,
        }),
        cache: "no-store",
      },
    );

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        success: false,
        message: text || "Verification failed",
      };
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("verify-and-set-password proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "There was a problem verifying your account. Please try again.",
      },
      { status: 500 },
    );
  }
}

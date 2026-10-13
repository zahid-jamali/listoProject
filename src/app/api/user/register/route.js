import { NextResponse } from "next/server";
import { LISTO_BASE_URL, DEFAULT_HEADERS } from "@/lib/listo-proxy";

export async function POST(req) {
  try {
    let body = await req.json();
    body = {
      ...body,
      plan: "free",
      "g-recaptcha-response":
        body["g-recaptcha-response"] ||
        body.recaptchaToken ||
        body.captchaToken,
    };

    const response = await fetch(`${LISTO_BASE_URL}/api/account`, {
      method: "POST",
      headers: {
        ...DEFAULT_HEADERS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Signup Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create account",
      },
      { status: 500 },
    );
  }
}

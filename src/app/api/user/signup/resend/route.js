import { NextResponse } from "next/server";
import {
  LISTO_BASE_URL,
  DEFAULT_HEADERS,
  buildForwardHeaders,
} from "@/lib/listo-proxy";

/** POST /api/user/signup/resend — regenerate PIN + verify email */
export async function POST(req) {
  try {
    const upstream = await fetch(`${LISTO_BASE_URL}/api/user/signup/resend`, {
      method: "POST",
      headers: buildForwardHeaders(req, {
        ...DEFAULT_HEADERS,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({}),
      cache: "no-store",
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text || "{}");
    } catch {
      data = { success: upstream.ok, message: text || "Resend complete" };
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("signup/resend proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to resend email" },
      { status: 500 },
    );
  }
}

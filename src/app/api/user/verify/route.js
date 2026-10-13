import { NextResponse } from "next/server";
import { LISTO_BASE_URL, DEFAULT_HEADERS } from "@/lib/listo-proxy";

/** POST /api/user/verify — email token verify only (PIN already set) */
export async function POST(req) {
  try {
    const body = await req.json();
    if (!body?.token) {
      return NextResponse.json(
        { success: false, message: "Verification token is required." },
        { status: 400 },
      );
    }

    const upstream = await fetch(`${LISTO_BASE_URL}/api/user/verify`, {
      method: "POST",
      headers: {
        ...DEFAULT_HEADERS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: body.token }),
      cache: "no-store",
    });

    const text = await upstream.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (upstream.ok) {
      return NextResponse.json(
        {
          success: true,
          message:
            data?.message ||
            "Email verified. Return to the app and click Refresh to continue.",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          (typeof data?.message === "string" && data.message) ||
          data?.message?.message ||
          "There was a problem verifying your account. The link may have expired.",
      },
      { status: upstream.status || 500 },
    );
  } catch (error) {
    console.error("verify proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "There was a problem verifying your account. Please try again.",
      },
      { status: 500 },
    );
  }
}

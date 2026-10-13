import { NextResponse } from "next/server";
import { LISTO_BASE_URL, DEFAULT_HEADERS } from "@/lib/listo-proxy";

/** POST /api/user/pin/forgot — regenerate + email new PIN */
export async function POST(req) {
  try {
    const body = await req.json();
    const upstream = await fetch(`${LISTO_BASE_URL}/api/user/pin/forgot`, {
      method: "POST",
      headers: {
        ...DEFAULT_HEADERS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: body.email }),
      cache: "no-store",
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: text || "Request failed" };
    }

    if (data?.message && typeof data.message === "object") {
      data = {
        ...data,
        message: data.message.message || data.message.msg || "Request failed",
      };
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("pin/forgot proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send PIN reset email" },
      { status: 500 },
    );
  }
}

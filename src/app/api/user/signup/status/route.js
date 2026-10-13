import { NextResponse } from "next/server";
import {
  LISTO_BASE_URL,
  DEFAULT_HEADERS,
  buildForwardHeaders,
} from "@/lib/listo-proxy";

/** GET /api/user/signup/status — check email verified */
export async function GET(req) {
  try {
    const upstream = await fetch(`${LISTO_BASE_URL}/api/user/signup/status`, {
      method: "GET",
      headers: buildForwardHeaders(req, { ...DEFAULT_HEADERS }),
      cache: "no-store",
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text || "{}");
    } catch {
      data = { success: false, message: text || "Status check failed" };
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("signup/status proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to check verification status" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import {
  LISTO_BASE_URL,
  DEFAULT_HEADERS,
  buildForwardHeaders,
} from "@/lib/listo-proxy";

/** PATCH /api/user — update profile (name / phone) during signup */
export async function PATCH(req) {
  try {
    const body = await req.json();
    const upstream = await fetch(`${LISTO_BASE_URL}/api/user`, {
      method: "PATCH",
      headers: buildForwardHeaders(req, {
        ...DEFAULT_HEADERS,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text || "{}");
    } catch {
      data = { message: text || "Update failed" };
    }

    if (data?.message && typeof data.message === "object") {
      data = {
        ...data,
        message: data.message.message || data.message.msg || "Profile updated",
      };
    }

    return NextResponse.json(
      { success: upstream.ok, ...data },
      { status: upstream.status },
    );
  } catch (error) {
    console.error("user PATCH proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 },
    );
  }
}

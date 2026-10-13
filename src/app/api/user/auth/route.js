import { NextResponse } from "next/server";
import { LISTO_BASE_URL, DEFAULT_HEADERS } from "@/lib/listo-proxy";

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch(`${LISTO_BASE_URL}/api/user/auth`, {
      method: "POST",
      headers: {
        ...DEFAULT_HEADERS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    // Normalize nested message objects from legacy error handler
    if (data?.message && typeof data.message === "object") {
      data = {
        ...data,
        message: data.message.message || data.message.msg || "Login failed",
        needs_verification:
          data.needs_verification || data.message.needs_verification,
        inputError: data.inputError || data.message.inputError,
      };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Login Proxy Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to authenticate user",
      },
      { status: 500 },
    );
  }
}

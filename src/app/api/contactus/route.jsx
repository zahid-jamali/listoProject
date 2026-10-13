import { NextResponse } from "next/server";
import { LISTO_BASE_URL, buildForwardHeaders } from "@/lib/listo-proxy";

const PURPOSE_MAP = {
  general: "GENERAL",
  investment: "INVESTMENT",
  partnership: "PARTNERSHIP",
};

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    // Map the redesigned form fields onto the legacy /v1/api/contact schema.
    const payload = {
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      msg: body.msg || body.message || "",
      purpose:
        body.purpose ||
        PURPOSE_MAP[String(body.category || "general").toLowerCase()] ||
        "GENERAL",
    };

    const response = await fetch(`${LISTO_BASE_URL}/v1/api/contact`, {
      method: "POST",
      headers: buildForwardHeaders(req, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    return NextResponse.json(
      { success: response.ok, ...data },
      { status: response.ok ? 200 : response.status }
    );
  } catch (error) {
    console.error("Contact API Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}

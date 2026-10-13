import { NextResponse } from "next/server";
import {
  LISTO_BASE_URL,
  DEFAULT_HEADERS,
  buildForwardHeaders,
} from "@/lib/listo-proxy";

/**
 * Proxy: POST /v1/api/listing-inquiry
 *
 * Soft-signup response (passthrough):
 *  { message, auth?, account_exists?, provider? }
 */
export async function POST(req) {
  try {
    const body = await req.json();

    const prop_id = body.prop_id || body.id;
    const prop_type = body.prop_type || body.type || "RS";
    const brd = body.brd || "TREB";

    if (!prop_id || !prop_type || !brd) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: prop_id, prop_type, brd",
          errors: [{ prop_id: !prop_id ? "Invalid value" : undefined }].filter(
            Boolean,
          ),
        },
        { status: 422 },
      );
    }

    const payload = {
      prop_id: String(prop_id),
      prop_type: String(prop_type),
      brd: String(brd),
      access_url: body.access_url || "",
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      msg: body.msg || body.message || "",
    };

    const headers = {
      ...buildForwardHeaders(req, {
        ...DEFAULT_HEADERS,
        "Content-Type": "application/json",
      }),
    };

    const upstream = await fetch(`${LISTO_BASE_URL}/v1/api/listing-inquiry`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text || "Inquiry failed" };
    }

    // Passthrough legacy shape so frontend can read auth / account_exists
    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("Listing inquiry proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong sending your inquiry" },
      { status: 500 },
    );
  }
}

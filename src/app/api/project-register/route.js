import { NextResponse } from "next/server";
import { LISTO_BASE_URL, DEFAULT_HEADERS } from "@/lib/listo-proxy";

/**
 * Proxy for the legacy pre-construction registration endpoint.
 *
 * Legacy: POST /api/project_register
 * Fields: development_id, project_id, access_url, first_name, last_name,
 *         email, phone, realtor, models, br, locker, parking, questions
 * NOTE: the legacy controller renders an HTML thank-you page (not JSON), so we
 * normalise the response to JSON based on the upstream HTTP status.
 */
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.email || (!body.first_name && !body.name)) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    const payload = {
      development_id: body.development_id || body.dv_id || "",
      project_id: body.project_id || "",
      access_url: body.access_url || "",
      first_name: body.first_name || body.name || "",
      last_name: body.last_name || "",
      email: body.email || "",
      phone: body.phone || "",
      realtor: body.realtor || "No",
      questions: body.questions || body.msg || body.message || "",
    };

    const upstream = await fetch(`${LISTO_BASE_URL}/api/project_register`, {
      method: "POST",
      headers: {
        ...DEFAULT_HEADERS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    // Legacy returns an HTML message page; treat a 2xx as success.
    return NextResponse.json(
      {
        success: upstream.ok,
        message: upstream.ok
          ? "Registration received. Our team will reach out shortly."
          : "Registration could not be completed. Please try again.",
      },
      { status: upstream.ok ? 200 : upstream.status }
    );
  } catch (error) {
    console.error("Project register proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong with your registration" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

const API_BASE_URL = "https://listo.ca";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log(body);

    const response = await fetch(`${API_BASE_URL}/v1/api/contact`, {
      method: "POST",
      headers: {
        Referer: `${API_BASE_URL}/`,
        Origin: API_BASE_URL,
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        // Ek bilkul standard Chrome browser ka User-Agent istemal karein
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
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

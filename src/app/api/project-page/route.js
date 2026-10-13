import { NextResponse } from "next/server";
import { buildProjectPageData } from "@/lib/build-project-page-data";

/**
 * Build a full pre-construction project page payload.
 * GET or POST with: access_url | area_slug+slug | dv_id | search
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const data = await buildProjectPageData({
      access_url: searchParams.get("access_url") || "",
      area_slug: searchParams.get("area_slug") || "",
      slug: searchParams.get("slug") || "",
      dv_id: searchParams.get("dv_id") || searchParams.get("id") || "",
      project_id: searchParams.get("project_id") || "",
      search: searchParams.get("search") || "",
      title: searchParams.get("title") || "",
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("project-page GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to load project",
      },
      { status: error?.message === "Project not found" ? 404 : 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const data = await buildProjectPageData({
      access_url: body.access_url || "",
      area_slug: body.area_slug || "",
      slug: body.slug || "",
      dv_id: body.dv_id || body.development_id || body.id || "",
      project_id: body.project_id || "",
      search: body.search || "",
      title: body.title || "",
      ...body,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("project-page POST error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to load project",
      },
      { status: error?.message === "Project not found" ? 404 : 500 },
    );
  }
}

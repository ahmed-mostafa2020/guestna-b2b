import axios from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ROOT_HOST = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  ""
).replace(/\/b2b\/?$/, "");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const siteType = searchParams.get("siteType") || "b2b";

  if (!ROOT_HOST) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_API_URL" },
      { status: 500 }
    );
  }

  const upstream = `${ROOT_HOST.replace(
    /\/$/,
    ""
  )}/guestnaInfos/isActive?siteType=${encodeURIComponent(siteType)}`;

  try {
    const response = await axios.get(upstream, {
      headers: {
        "Content-Type": "application/json",
        reqKey: process.env.SECURE_REQ_KEY,
        lang: request.headers.get("lang") || "ar",
      },
      timeout: 8000,
    });

    return NextResponse.json(response.data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "site-status proxy error" };
    return NextResponse.json(data, { status });
  }
}

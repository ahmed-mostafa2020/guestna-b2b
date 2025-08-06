import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  const backendURL = `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    reqKey: process.env.SECURE_REQ_KEY,
    lang: request.headers.get("lang") || "ar",
  };

  const authHeader = request.headers.get("authorization");
  if (authHeader) headers.authorization = authHeader;

  try {
    const response = await axios.get(backendURL, { headers });
    return NextResponse.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Proxy error" };
    return NextResponse.json(data, { status });
  }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  const body = await request.json();

  if (!path) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  const backendURL = `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    reqKey: process.env.SECURE_REQ_KEY,
    lang: request.headers.get("lang") || "ar",
  };

  const authHeader = request.headers.get("authorization");
  if (authHeader) headers.authorization = authHeader;

  try {
    const response = await axios.post(backendURL, body, { headers });
    return NextResponse.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Proxy error" };
    return NextResponse.json(data, { status });
  }
}

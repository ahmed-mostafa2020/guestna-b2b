import axios from "axios";
import { NextResponse } from "next/server";

/** Remove the /b2b/ segment (and any trailing path) from the base URL */
function getBaseURL(withB2b = true) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  if (withB2b) return base;
  // Strip everything from /b2b/ onward so we get the root origin
  return base.replace(/\/b2b\/.*$/, "/").replace(/\/b2b$/, "/");
}

/** Shared headers sent to the backend on every request */
function buildHeaders(request, extra = {}) {
  const token = request.headers.get("authorization");
  const devicespecificid = request.headers.get("devicespecificid");
  const profileOrganizations = request.headers.get("profile-organizations");

  return {
    "Content-Type": "application/json",
    reqKey: process.env.SECURE_REQ_KEY,
    lang: request.headers.get("lang") || "ar",
    ...(token && { authorization: token }),
    ...(devicespecificid && { devicespecificid }),
    ...(profileOrganizations && {
      "profile-organizations": profileOrganizations,
    }),
    ...extra,
  };
}

/** Build the backend URL, appending siteType as a query param when provided */
function buildBackendURL(basePath, siteType) {
  if (!siteType) return basePath;
  const separator = basePath.includes("?") ? "&" : "?";
  return `${basePath}${separator}siteType=${siteType}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  const withB2b = searchParams.get("b2b") !== "false";
  const siteType = searchParams.get("siteType");

  const backendURL = buildBackendURL(`${getBaseURL(withB2b)}${path}`, siteType);
  const headers = buildHeaders(request);

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
  const pathPost = searchParams.get("path");

  if (!pathPost) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  const withB2b = searchParams.get("b2b") !== "false";
  const siteType = searchParams.get("siteType");
  const contentType = request.headers.get("content-type");

  const backendURL = buildBackendURL(`${getBaseURL(withB2b)}${pathPost}`, siteType);
  const headers = buildHeaders(request);

  let body = undefined;
  if (contentType?.includes("application/json")) {
    body = await request.json();
    headers["Content-Type"] = "application/json";
  } else if (contentType?.includes("multipart/form-data")) {
    const formData = await request.formData();
    const axiosFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      axiosFormData.append(key, value);
    }
    body = axiosFormData;
  }

  try {
    const response = await axios.post(backendURL, body, { headers });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Proxy error" };
    return NextResponse.json(data, { status });
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const pathPut = searchParams.get("path");

  if (!pathPut) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  const withB2b = searchParams.get("b2b") !== "false";
  const siteType = searchParams.get("siteType");
  const contentType = request.headers.get("content-type");

  const backendURL = buildBackendURL(`${getBaseURL(withB2b)}${pathPut}`, siteType);
  const headers = buildHeaders(request);

  let body = undefined;
  if (contentType?.includes("application/json")) {
    body = await request.json();
    headers["Content-Type"] = "application/json";
  } else if (contentType?.includes("multipart/form-data")) {
    const formData = await request.formData();
    const axiosFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      axiosFormData.append(key, value);
    }
    body = axiosFormData;
  }

  try {
    const response = await axios.put(backendURL, body, { headers });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Proxy error" };
    return NextResponse.json(data, { status });
  }
}

export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const pathPatch = searchParams.get("path");

  if (!pathPatch) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  const withB2b = searchParams.get("b2b") !== "false";
  const siteType = searchParams.get("siteType");
  const contentType = request.headers.get("content-type");

  const backendURL = buildBackendURL(`${getBaseURL(withB2b)}${pathPatch}`, siteType);
  const headers = buildHeaders(request);

  let body = undefined;
  if (contentType?.includes("application/json")) {
    body = await request.json();
    headers["Content-Type"] = "application/json";
  } else if (contentType?.includes("multipart/form-data")) {
    const formData = await request.formData();
    const axiosFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      axiosFormData.append(key, value);
    }
    body = axiosFormData;
  }

  try {
    const response = await axios.patch(backendURL, body, { headers });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Proxy error" };
    return NextResponse.json(data, { status });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const pathDelete = searchParams.get("path");

  if (!pathDelete) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  const withB2b = searchParams.get("b2b") !== "false";
  const siteType = searchParams.get("siteType");

  const backendURL = buildBackendURL(`${getBaseURL(withB2b)}${pathDelete}`, siteType);
  const headers = buildHeaders(request);

  try {
    const response = await axios.delete(backendURL, { headers });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Proxy error" };
    return NextResponse.json(data, { status });
  }
}

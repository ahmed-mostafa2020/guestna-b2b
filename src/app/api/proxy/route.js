import axios from "axios";
import { NextResponse } from "next/server";

const getBackendUrl = (path) => {
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  if (path && path.startsWith("clientInfoBooking/")) {
    baseUrl = baseUrl.replace(/\/b2b\/?$/, "/");
  }
  const cleanBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  const token = request.headers.get("authorization");
  const devicespecificid = request.headers.get("devicespecificid");
  const profileOrganizations = request.headers.get("profile-organizations");

  const urlObj = new URL(getBackendUrl(path));
  searchParams.forEach((value, key) => {
    if (key !== "path") {
      urlObj.searchParams.append(key, value);
    }
  });
  const backendURL = urlObj.toString();

  const headers = {
    "Content-Type": "application/json",
    reqKey: process.env.SECURE_REQ_KEY,
    lang: request.headers.get("lang") || "ar",
    ...(token && { authorization: token }),
    ...(devicespecificid && { devicespecificid }),
    ...(profileOrganizations && {
      "profile-organizations": profileOrganizations,
    }),
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
  const pathPost = searchParams.get("path");

  if (!pathPost) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  const token = request.headers.get("authorization");
  const devicespecificid = request.headers.get("devicespecificid");
  const contentType = request.headers.get("content-type");
  const profileOrganizations = request.headers.get("profile-organizations");

  const backendURL = getBackendUrl(pathPost);

  const headers = {
    reqKey: process.env.SECURE_REQ_KEY,
    lang: request.headers.get("lang") || "ar",
    ...(token && { authorization: token }),
    ...(devicespecificid && { devicespecificid }),
    ...(profileOrganizations && {
      "profile-organizations": profileOrganizations,
    }),
  };

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

  const token = request.headers.get("authorization");
  const devicespecificid = request.headers.get("devicespecificid");
  const contentType = request.headers.get("content-type");
  const profileOrganizations = request.headers.get("profile-organizations");

  const backendURL = getBackendUrl(pathPut);

  const headers = {
    reqKey: process.env.SECURE_REQ_KEY,
    lang: request.headers.get("lang") || "ar",
    ...(token && { authorization: token }),
    ...(devicespecificid && { devicespecificid }),
    ...(profileOrganizations && {
      "profile-organizations": profileOrganizations,
    }),
  };

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

  const token = request.headers.get("authorization");
  const devicespecificid = request.headers.get("devicespecificid");
  const contentType = request.headers.get("content-type");
  const profileOrganizations = request.headers.get("profile-organizations");

  const backendURL = getBackendUrl(pathPatch);

  const headers = {
    reqKey: process.env.SECURE_REQ_KEY,
    lang: request.headers.get("lang") || "ar",
    ...(token && { authorization: token }),
    ...(devicespecificid && { devicespecificid }),
    ...(profileOrganizations && {
      "profile-organizations": profileOrganizations,
    }),
  };

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

  const token = request.headers.get("authorization");
  const devicespecificid = request.headers.get("devicespecificid");
  const profileOrganizations = request.headers.get("profile-organizations");

  const backendURL = getBackendUrl(pathDelete);

  const headers = {
    "Content-Type": "application/json",
    reqKey: process.env.SECURE_REQ_KEY,
    lang: request.headers.get("lang") || "ar",
    ...(token && { authorization: token }),
    ...(devicespecificid && { devicespecificid }),
    ...(profileOrganizations && {
      "profile-organizations": profileOrganizations,
    }),
  };

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

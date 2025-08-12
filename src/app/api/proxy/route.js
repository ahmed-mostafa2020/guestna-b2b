import axios from "axios";
import { NextResponse } from "next/server";

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const path = searchParams.get("path");

//   if (!path) {
//     return NextResponse.json(
//       { error: "Missing path parameter" },
//       { status: 400 }
//     );
//   }

//   const token = request.headers.get("authorization");
//   const devicespecificid = request.headers.get("devicespecificid");

//   const backendURL = `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
//   const headers = {
//     "Content-Type": "application/json",
//     reqKey: process.env.SECURE_REQ_KEY,
//     lang: request.headers.get("lang") || "ar",
//     ...(token && { authorization: token }),
//     ...(devicespecificid && { devicespecificid }),
//   };

//   const authHeader = request.headers.get("authorization");
//   if (authHeader) headers.authorization = authHeader;

//   try {
//     const response = await axios.get(backendURL, { headers });
//     return NextResponse.json(response.data);
//   } catch (error) {
//     const status = error.response?.status || 500;
//     const data = error.response?.data || { error: "Proxy error" };
//     return NextResponse.json(data, { status });
//   }
// }

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pathToDownload = searchParams.get("path");

  if (!pathToDownload) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  const token = request.headers.get("authorization");
  const devicespecificid = request.headers.get("devicespecificid");

  const backendURL = `${process.env.NEXT_PUBLIC_BASE_URL}${pathToDownload}`;

  const headers = {
    reqKey: process.env.SECURE_REQ_KEY,
    lang: request.headers.get("lang") || "ar",
    ...(token && { authorization: token }),
    ...(devicespecificid && { devicespecificid }),
  };

  try {
    const response = await axios.get(backendURL, {
      headers,
      responseType: "arraybuffer", // Important for file downloads
    });

    // Forward the file with proper headers
    return new NextResponse(response.data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers["content-type"] || "application/octet-stream",
        "Content-Disposition":
          response.headers["content-disposition"] || "attachment",
        "Content-Length": response.headers["content-length"],
      },
    });
  } catch (error) {
    console.error(
      "Download proxy error:",
      error.response?.data || error.message
    );
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Download proxy error" };
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

  const backendURL = `${process.env.NEXT_PUBLIC_BASE_URL}${pathPost}`;

  const headers = {
    reqKey: process.env.SECURE_REQ_KEY,
    lang: request.headers.get("lang") || "ar",
    ...(token && { authorization: token }),
    ...(devicespecificid && { devicespecificid }),
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

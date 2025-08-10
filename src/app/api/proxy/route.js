// import axios from "axios";
// import { NextResponse } from "next/server";

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

// export async function POST(request) {
//   const { searchParams } = new URL(request.url);
//   const path = searchParams.get("path");
//   const body = await request.json();

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
//     const response = await axios.post(backendURL, body, { headers });
//     return NextResponse.json(response.data);
//   } catch (error) {
//     const status = error.response?.status || 500;
//     const data = error.response?.data || { error: "Proxy error" };
//     return NextResponse.json(data, { status });
//   }
// }

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

  const token = request.headers.get("authorization");
  const devicespecificid = request.headers.get("devicespecificid");

  const backendURL = `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    reqKey: process.env.SECURE_REQ_KEY,
    lang: request.headers.get("lang") || "ar",
    ...(token && { authorization: token }),
    ...(devicespecificid && { devicespecificid }),
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

  if (!path) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  const token = request.headers.get("authorization");
  const devicespecificid = request.headers.get("devicespecificid");
  const contentType = request.headers.get("content-type");

  const backendURL = `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;

  // Initialize headers
  const headers = {
    reqKey: process.env.SECURE_REQ_KEY,
    lang: request.headers.get("lang") || "ar",
    ...(token && { authorization: token }),
    ...(devicespecificid && { devicespecificid }),
  };

  let body;
  let axiosConfig = { headers };

  if (contentType && contentType.includes("multipart/form-data")) {
    // Handle form data
    const formData = await request.formData();
    body = formData;

    // For FormData, let axios set the Content-Type with the proper boundary
    headers["Content-Type"] = "multipart/form-data";
  } else {
    // Handle JSON data
    headers["Content-Type"] = "application/json";
    body = await request.json();
  }

  try {
    const response = await axios.post(backendURL, body, axiosConfig);
    return NextResponse.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: "Proxy error" };
    return NextResponse.json(data, { status });
  }
}

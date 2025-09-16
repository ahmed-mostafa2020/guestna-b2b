import { NextResponse } from "next/server";

// This route exists to handle any legacy/incorrect calls to /api/checkout
// All checkout functionality should use the proxy pattern via /api/proxy
export async function GET(request) {
  return NextResponse.json(
    { 
      error: "This endpoint has been moved. Please use the proxy API instead.",
      redirect: "/api/proxy",
      message: "All API calls should go through /api/proxy with the appropriate path parameter"
    },
    { status: 404 }
  );
}

export async function POST(request) {
  return NextResponse.json(
    { 
      error: "This endpoint has been moved. Please use the proxy API instead.",
      redirect: "/api/proxy", 
      message: "All API calls should go through /api/proxy with the appropriate path parameter"
    },
    { status: 404 }
  );
}

export async function PUT(request) {
  return NextResponse.json(
    { 
      error: "This endpoint has been moved. Please use the proxy API instead.",
      redirect: "/api/proxy",
      message: "All API calls should go through /api/proxy with the appropriate path parameter"
    },
    { status: 404 }
  );
}

export async function PATCH(request) {
  return NextResponse.json(
    { 
      error: "This endpoint has been moved. Please use the proxy API instead.",
      redirect: "/api/proxy",
      message: "All API calls should go through /api/proxy with the appropriate path parameter"
    },
    { status: 404 }
  );
}

export async function DELETE(request) {
  return NextResponse.json(
    { 
      error: "This endpoint has been moved. Please use the proxy API instead.",
      redirect: "/api/proxy",
      message: "All API calls should go through /api/proxy with the appropriate path parameter"
    },
    { status: 404 }
  );
}

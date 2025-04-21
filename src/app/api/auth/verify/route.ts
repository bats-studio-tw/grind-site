import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    const payload = await verifyToken(token);
    return NextResponse.json({ address: payload.address });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

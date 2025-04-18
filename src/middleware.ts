import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

// 需要認證的路由
const protectedRoutes = ["/api/game", "/api/user"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 檢查是否是需要保護的路由
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
      // 驗證 token
      const payload = verifyToken(token);
      
      // 將使用者地址添加到請求頭中
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-address", payload.address);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return new NextResponse("Invalid token", { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
}; 
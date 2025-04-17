import { verifyMessage } from "viem";

export async function POST(req: Request) {
  const { address, signature } = await req.json();
  const message = `Login to Game at ${new Date().toISOString().slice(0, 10)}`; // 建議加上 timestamp or nonce

  const isValid = await verifyMessage({
    address,
    message,
    signature,
  });

  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  // TODO: 發送 JWT 或創建 user
  return new Response("OK");
}

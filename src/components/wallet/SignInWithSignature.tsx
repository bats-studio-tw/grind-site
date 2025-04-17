import { useSignMessage, useAccount } from "wagmi";

export function VerifyAndGetTokenButton() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleVerify = async () => {
    if (!address) return;

    const message = `Login to GuGuGame at ${new Date()
      .toISOString()
      .slice(0, 10)}`;
    const signature = await signMessageAsync({ message });

    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ address, signature, message }),
    });

    const data = await res.json();
    localStorage.setItem("token", data.token); // 儲存 JWT
  };

  return (
    <button
      onClick={handleVerify}
      className="mt-2 bg-white text-black px-4 py-2 rounded"
    >
      Verify & Get Token
    </button>
  );
}

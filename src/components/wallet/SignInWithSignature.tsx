import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { useAbstractClient } from "@abstract-foundation/agw-react";
import { useRouter } from "next/navigation";

export function VerifyAndGetTokenButton() {
  const router = useRouter();
  const { address } = useAccount();
  const { data: agwClient } = useAbstractClient();
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    isValid?: boolean;
    error?: string;
  } | null>(null);

  const hasSigned = !!signature;

  // Auto-verify when signature is available
  useEffect(() => {
    if (signature && address) {
      handleVerify();
    }
  }, [signature, address]);

  const handleSignMessage = async () => {
    if (!address || !agwClient) return;
    setSignature(null);
    setVerificationResult(null);

    const message = `Login to Grind Tap at ${new Date()
      .toISOString()
      .slice(0, 10)}`;
    const formattedMessage = `\x19Ethereum Signed Message:\n${message.length}${message}`;

    try {
      const sig = await agwClient.signMessage({
        message: formattedMessage,
      });

      if (!sig.startsWith("0x")) {
        throw new Error("Invalid signature format");
      }

      setSignature(sig);
    } catch (err) {
      console.error("Sign in error:", err);
      setVerificationResult({
        error: err instanceof Error ? err.message : "An error occurred",
      });
    }
  };

  const handleVerify = async () => {
    if (!address || !agwClient || !signature) return;

    setIsLoading(true);
    setVerificationResult(null);

    try {
      const message = `Login to Grind Tap at ${new Date()
        .toISOString()
        .slice(0, 10)}`;
      const formattedMessage = `\x19Ethereum Signed Message:\n${message.length}${message}`;

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          signature,
          message: formattedMessage,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Authentication failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      setVerificationResult({ isValid: true });

      // 跳轉至play頁
      router.push("/play");
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationResult({
        error: err instanceof Error ? err.message : "Verification failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <button
        onClick={handleSignMessage}
        disabled={!address || (hasSigned && isLoading)}
        className={`rounded-full border border-solid transition-colors flex items-center justify-center text-white gap-2 text-sm h-10 px-5 font-[family-name:var(--font-roobert)] w-full
          ${
            hasSigned && isLoading
              ? "bg-gray-500 cursor-not-allowed opacity-50"
              : hasSigned
              ? verificationResult?.isValid
                ? "bg-gradient-to-r from-green-500 to-green-700 border-transparent"
                : "bg-gradient-to-r from-red-500 to-red-700 border-transparent"
              : "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 hover:cursor-pointer border-transparent"
          }`}
      >
        {hasSigned ? (
          <>
            {isLoading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="w-full text-center">Verifying...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      verificationResult?.isValid
                        ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    }
                  />
                </svg>
                <span className="w-full text-center">
                  {verificationResult?.isValid
                    ? "Verified"
                    : "Verify & Get Token"}
                </span>
              </>
            )}
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <span className="w-full text-center">Sign Message</span>
          </>
        )}
      </button>

      {hasSigned && (
        <div className="mt-2 p-4 bg-white/5 border border-white/10 rounded-lg text-left w-full">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium font-[family-name:var(--font-roobert)]">
              Signature:
            </p>
            <p className="text-xs font-mono break-all text-green-300">
              {signature}
            </p>

            {verificationResult && !isLoading && (
              <div className="mt-2 p-2 rounded-md bg-white/5">
                <p className="text-xs font-medium font-[family-name:var(--font-roobert)] flex items-center">
                  Status:
                  <span
                    className={`ml-2 ${
                      verificationResult.isValid
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {verificationResult.isValid ? "Valid ✅" : "Invalid ❌"}
                  </span>
                </p>
                {verificationResult.error && (
                  <p className="text-xs text-red-300 mt-1">
                    {verificationResult.error}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

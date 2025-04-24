import axios from "axios";
import { useAccount } from "wagmi";
import { useState, useEffect, useCallback } from "react";
import { useAbstractClient } from "@abstract-foundation/agw-react";
import { useRouter } from "next/navigation";
import { SyStemButtom } from "@/components/ui/SyStemButtom";
import { LoadingSpinnerIcon } from "@/components/ui/LoadingSpinnerIcon";
import { CheckCircleIcon } from "@/components/ui/CheckCircleIcon";
import { PencilIcon } from "@/components/ui/PencilIcon";

export function VerifyAndGetTokenButton() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data: agwClient } = useAbstractClient();
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    isValid?: boolean;
    error?: string;
  } | null>(null);

  const hasSigned = !!signature;

  const handleVerify = useCallback(async () => {
    if (!address || !agwClient || !signature) {
      console.error(
        "Missing required parameters",
        address,
        agwClient,
        signature
      );
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);

    try {
      const message = `Login to Grind Tap at ${new Date()
        .toISOString()
        .slice(0, 10)}`;
      const formattedMessage = `\x19Ethereum Signed Message:\n${message.length}${message}`;

      const res = await axios.post(
        "/api/auth",
        {
          address,
          signature,
          message: formattedMessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;
      if (!data.token) {
        throw new Error("No token received from server");
      }

      // 確保 token 格式正確
      const formattedToken = data.token.startsWith("Bearer ")
        ? data.token
        : `Bearer ${data.token}`;

      // 存儲 token 到 localStorage
      localStorage.setItem("token", formattedToken);

      // 設置驗證結果
      setVerificationResult({ isValid: true });

      // 立即跳轉到 play 頁面
      router.push("/play");
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationResult({
        error: err instanceof Error ? err.message : "Verification failed",
      });
    } finally {
      setIsLoading(false);
    }
  }, [address, agwClient, signature, router]);

  // Auto-verify when signature is available
  useEffect(() => {
    // Only run verify if we have a signature and are connected
    if (isConnected && address && signature) {
      handleVerify();
    }
    // Depend on signature as well
  }, [isConnected, address, signature, handleVerify]);

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

  return (
    <>
      <SyStemButtom
        onClick={handleSignMessage}
        disabled={!address || (hasSigned && isLoading)}
        topColor="bg-[#00AAFF]"
        bottomColor="bg-[#0061BF]"
        textColor="text-[#FFF]"
        className={`${
          hasSigned && isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        leftSlot={
          hasSigned ? (
            isLoading ? (
              <LoadingSpinnerIcon size={"100%"} color="#FFF" />
            ) : (
              <CheckCircleIcon
                isValid={verificationResult?.isValid}
                size={"100%"}
              />
            )
          ) : (
            <PencilIcon size={"100%"} color="#FFF" />
          )
        }
        rightSlot={
          hasSigned
            ? isLoading
              ? "Verifying..."
              : verificationResult?.isValid
              ? "Verified"
              : "Verify & Get Token"
            : "Sign Message"
        }
      />
    </>
  );
}

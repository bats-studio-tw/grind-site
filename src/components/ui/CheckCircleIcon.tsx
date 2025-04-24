import React from "react";

interface CheckCircleIconProps {
  color?: string;
  size?: number | string;
  isValid?: boolean;
}

export function CheckCircleIcon({
  color = "currentColor",
  size = 16,
  isValid = true,
}: CheckCircleIconProps) {
  return (
    <svg
      className={`w-[${size}] h-[${size}]`}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={
          isValid
            ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        }
      />
    </svg>
  );
}

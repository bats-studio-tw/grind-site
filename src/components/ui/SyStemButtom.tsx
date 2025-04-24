"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import type React from "react";
import { RootState } from "@/store/store";

interface SyStemButtomProps {
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  topColor?: string;
  bottomColor?: string;
  borderColor?: string;
  textColor?: string;
  disabled?: boolean;
}

export const SyStemButtom: React.FC<SyStemButtomProps> = ({
  leftSlot,
  rightSlot,
  onClick,
  className = "",
  topColor = "bg-yellow-300",
  bottomColor = "bg-orange-600",
  borderColor = "border-[#0A0A0A]",
  textColor = "text-[#0A0A0A]",
  disabled = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSelector((state: RootState) => state.unityScale.scale);

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    if (onClick && !disabled) onClick();
  };

  return (
    <div
      className={`relative `}
      style={{
        width: `${600 * scale}px`,
        height: `${120 * scale}px`,
      }}
    >
      {/* Bottom layer with border */}
      <div
        className={`absolute w-full h-full ${bottomColor} ${borderColor}`}
        style={{
          top: `${24 * scale}px`,
          borderRadius: `${16 * scale}px`,
          borderWidth: `${8 * scale}px`,
        }}
      ></div>

      {/* Top layer with border and press animation */}
      <button
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        disabled={disabled}
        className={`absolute w-full h-full ${topColor} ${borderColor} ${textColor} font-bold transition-all duration-75 
          ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        style={{
          fontSize: `${50 * scale}px`,
          transform: isPressed ? `translateY(${24 * scale}px)` : "none",
          borderRadius: `${16 * scale}px`,
          borderWidth: `${8 * scale}px`,
        }}
      >
        <div className="flex items-center justify-center w-full h-full gap-2">
          {leftSlot && (
            <div
              className="flex items-center justify-center"
              style={{ width: `${50 * scale}px`, height: `${50 * scale}px` }}
            >
              {leftSlot}
            </div>
          )}
          <div
            className="flex text-center whitespace-nowrap w-fit"
            style={{ fontSize: `${50 * scale}px` }}
          >
            {rightSlot}
          </div>
        </div>
      </button>
    </div>
  );
};

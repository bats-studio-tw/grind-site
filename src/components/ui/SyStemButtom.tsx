"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import type React from "react";
import { RootState } from "@/store/store";

interface SyStemButtomProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  topColor?: string;
  bottomWidth?: string;
  bottomColor?: string;
  borderColor?: string;
  textColor?: string;
  borderWidth?: string;
  disabled?: boolean;
}

export const SyStemButtom: React.FC<SyStemButtomProps> = ({
  children,
  onClick,
  className = "",
  topColor = "bg-yellow-300",
  bottomWidth = "w-[600px]",
  bottomColor = "bg-orange-600",
  borderColor = "border-[#0A0A0A]",
  textColor = "text-[#0A0A0A]",
  borderWidth = "border-6",
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
      className={`relative ${bottomWidth} h-[120px]`}
      style={{ zoom: scale }}
    >
      {/* Bottom layer with border */}
      <div
        className={`absolute w-full h-full ${bottomColor} ${borderColor} ${borderWidth} rounded-2xl top-6`}
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
        className={`absolute w-full h-full ${topColor} ${borderColor} ${borderWidth} ${textColor} rounded-2xl font-bold text-[50px] transition-all duration-75 
          ${isPressed ? "translate-y-6" : ""} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      >
        {children}
      </button>
    </div>
  );
};

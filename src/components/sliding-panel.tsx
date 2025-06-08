// components/SlidingPanel.tsx
"use client";

import React from "react";

interface SlidingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SlidingPanel({
  isOpen,
  onClose,
  children,
}: SlidingPanelProps) {
  return (
    <div
      className={`fixed top-16 right-0 h-[calc(100vh-80px)] rounded-lg w-1/3 bg-background shadow-lg z-40 transform transition-transform duration-300 ${
        isOpen ? "translate-x-[-16px]" : "translate-x-full"
      }`}
    >
      <div className="p-4 overflow-y-auto h-full">{children}</div>
    </div>
  );
}

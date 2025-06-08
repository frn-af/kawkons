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
      className={`fixed top-16 right-0 h-[calc(100%-128px)] rounded-lg w-1/3 bg-background shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-[-16px]" : "translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold">Panel</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-black">
          Close
        </button>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">{children}</div>
    </div>
  );
}

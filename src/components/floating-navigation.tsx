"use client";

import { Menu } from "@/components/navigation-menu";
import { TreePine } from "lucide-react";
import Link from "next/link";

export function FloatingNavigation() {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4">
      {/* Logo/Brand */}
      <Link
        href="/"
        className="flex items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border rounded-lg px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <TreePine className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm hidden sm:inline-block">
          Kawasan Konservasi
        </span>
      </Link>

      {/* Navigation Menu */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
        <Menu />
      </div>
    </div>
  );
}

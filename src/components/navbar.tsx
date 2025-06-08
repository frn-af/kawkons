"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { 
  Menu, 
  Home, 
  MapPin, 
  BarChart3, 
  TreePine,
  Shield,
  Leaf,
  Mountain,
  FileText,
  ChevronDown,
  X
} from "lucide-react"

const navigationItems = [
  {
    title: "Beranda",
    href: "/",
    icon: Home,
    description: "Halaman utama dengan peta kawasan konservasi"
  },
  {
    title: "Efektifitas Pengelolaan",
    href: "/efektifitas",
    icon: BarChart3,
    description: "Penilaian efektifitas pengelolaan kawasan konservasi"
  }
]

const kawasanItems = [
  {
    title: "Tutupan Lahan & Open Area",
    href: "/kawasan/tutupan-lahan",
    icon: Mountain,
    description: "Data tutupan lahan dan area terbuka kawasan konservasi"
  },
  {
    title: "Tipe Ekosistem",
    href: "/kawasan/ekosistem",
    icon: TreePine,
    description: "Informasi tipe ekosistem di kawasan konservasi"
  },
  {
    title: "Keragaman Hayati",
    href: "/kawasan/biodiversity",
    icon: Leaf,
    description: "Data keragaman hayati pada kawasan konservasi"
  },
  {
    title: "Biofisik",
    href: "/kawasan/biofisik",
    icon: Mountain,
    description: "Komponen biotik dan abiotik kawasan konservasi"
  },
  {
    title: "Luas & Pengukuhan",
    href: "/kawasan/luas-pengukuhan",
    icon: MapPin,
    description: "Data luas dan status pengukuhan kawasan"
  },
  {
    title: "Data Lainnya",
    href: "/kawasan/lainnya",
    icon: FileText,
    description: "Data tambahan dan informasi pendukung"
  }
]

const otherItems = [
  {
    title: "Pengawasan Peredaran TSL",
    href: "/pengawasan-tsl",
    icon: Shield,
    description: "Monitoring peredaran tumbuhan dan satwa liar"
  }
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo/Brand */}
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <TreePine className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Kawasan Konservasi
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 transition-colors hover:text-foreground/80",
                  isActive(item.href) ? "text-foreground" : "text-foreground/60"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}

          {/* Kawasan Konservasi Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Kawasan Konservasi</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80">
              <DropdownMenuLabel>Data Kawasan Konservasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {kawasanItems.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-start space-x-2 p-2">
                      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Other Items */}
          {otherItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 transition-colors hover:text-foreground/80",
                  isActive(item.href) ? "text-foreground" : "text-foreground/60"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <TreePine className="h-5 w-5 text-primary" />
                  <span>Kawasan Konservasi</span>
                </SheetTitle>
                <SheetDescription>
                  Navigasi sistem informasi kawasan konservasi
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Main Navigation */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Menu Utama
                  </h4>
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                          isActive(item.href) ? "bg-accent text-accent-foreground" : "text-foreground/80"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span>{item.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* Kawasan Navigation */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Data Kawasan Konservasi
                  </h4>
                  {kawasanItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                          isActive(item.href) ? "bg-accent text-accent-foreground" : "text-foreground/80"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span>{item.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* Other Navigation */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Lainnya
                  </h4>
                  {otherItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                          isActive(item.href) ? "bg-accent text-accent-foreground" : "text-foreground/80"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span>{item.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Logo */}
        <div className="flex md:hidden">
          <Link className="flex items-center space-x-2" href="/">
            <TreePine className="h-6 w-6 text-primary" />
            <span className="font-bold">Kawasan Konservasi</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

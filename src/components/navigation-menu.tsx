"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "TL dan OA",
    href: "/docs/primitives/alert-dialog",
    description:
      "Tutupan lahan dan Open Area Kawasan Konservasi"
  },
  {
    title: "Ekosistem",
    href: "/docs/primitives/hover-card",
    description:
      "Tipe Ekosistem Kawasan Konservasi"
  },
  {
    title: "Keragaman Hayati",
    href: "/docs/primitives/progress",
    description:
      "Keragaman Hayati Pada Kawasan Konservasi",
  },
  {
    title: "Biofisik",
    href: "/docs/primitives/scroll-area",
    description: "Komponen Biotik dan Abiotik Kawasan Konservasi",
  },
  {
    title: "Luas dan Pengukuhan",
    href: "/docs/primitives/tabs",
    description:
      "Luas dan Pengukuhan Kawasan Konservasi",
  },
  {
    title: "Lainnya",
    href: "/docs/primitives/tooltip",
    description:
      "Temukan data selengkapnya disini",
  },
]

export function Menu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <li className="row-span-2">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Kawasan Konservasi
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Data Peta Kawasan Konservasi
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li className="row-span-2">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Efektifitas Pengelolaan Kawasan
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Penilaian Efektifitas Pengelolaan Kawasan Konservasi
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Kawasan Konservasi</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pengawasan Peredaran TSL
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

"use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"

// const navItems = [
//   { href: "/", label: "进度展示" },
//   { href: "/progress", label: "进度修改" },
//   { href: "/date-definitions", label: "统计日期修改" },
//   { href: "/tunnels", label: "区间修改" },
//   { href: "/plans", label: "计划修改" },
// ]

// export default function SiteNav() {
//   const pathname = usePathname()

//   return (
//     <nav className="h-12 sticky top-0 z-20 color-mix(in oklch, white 92%, var(--brand-100))" aria-label="主导航">
//       <div className="flex flex-row gap-2 max-w-6xl mx-auto my-0 px-8 py-3">
//         {navItems.map((item) => {
//           const isActive =
//             item.href === "/"
//               ? pathname === item.href
//               : pathname.startsWith(item.href)

//           return (
//             <Link
//               aria-current={isActive ? "page" : undefined}
//               className={isActive ? "active" : ""}
//               href={item.href}
//               key={item.href}
//             >
//               {item.label}
//             </Link>
//           )
//         })}
//       </div>
//     </nav>
//   )
// }

// "use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleDashedIcon,
} from "lucide-react"

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
    title: "进度展示",
    href: "/",
    description: "展示当前的进度信息。",
  },
  {
    title: "进度修改",
    href: "/progress",
    description: "修改当前的进度信息。",
  },
  {
    title: "统计日期修改",
    href: "/date-definitions",
    description: "修改统计日期的定义。",
  },
  {
    title: "区间修改",
    href: "/tunnels",
    description: "修改区间信息。",
  },
  {
    title: "计划修改",
    href: "/plans",
    description: "修改计划信息。",
  },
]

export function NavMenu() {
  const pathname = usePathname()

  return (
    <NavigationMenu className="h-12 w-full max-w-none sticky top-0 z-20 flex justify-center border-b border-brand-500 color-mix(in oklch, white 92%, var(--brand-100))">
      <NavigationMenuList>
        {components.map((component) => {
          const active =
            component.href === "/"
              ? pathname === "/"
              : pathname.startsWith(component.href)

          return (
            <NavigationMenuItem key={component.href}>
              <NavigationMenuLink
                active={active}
                className={`${navigationMenuTriggerStyle()} text-base`}
                render={<Link href={component.href}>{component.title}</Link>}
              />
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

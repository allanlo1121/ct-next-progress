"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopBarMenu() {
  const pathname = usePathname()

  const components = [
    {
      title: "首页",
      href: "/",
    },
    {
      title: "进度展示",
      href: "/dashboard",
    },
    {
      title: "掘进管理",
      href: "/ring-record",
    },
    {
      title: "统计日期修改",
      href: "/date-definition",
    },
    {
      title: "区间修改",
      href: "/tunnel",
    },
    {
      title: "计划修改",
      href: "/plan",
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-cyan-100 hover:bg-white/10 hover:text-white"
          >
            <Menu className="size-5" />
          </Button>
        }
      />

      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>功能菜单</DropdownMenuLabel>

          <DropdownMenuSeparator />

          {components.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)

            return (
              <DropdownMenuItem
                key={item.href}
                render={
                  <Link
                    href={item.href}
                    className={active ? "font-semibold text-primary" : ""}
                  >
                    {item.title}
                  </Link>
                }
              />
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

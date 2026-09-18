import type { ComponentProps } from "react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

type LinkButtonProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants>

export function LinkButton({
  className,
  variant = "outline",
  size = "default",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }),"min-w-32", className)}
      {...props}
    />
  )
}

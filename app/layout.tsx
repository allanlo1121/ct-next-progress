import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NavMenu } from "@/components/site-nav"

export const metadata = {
  title: "现场进度展示",
  description: "盾构区间进度管理与现场进度展示",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="h-screen overflow-hidden">
        <ThemeProvider>
          <NavMenu />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

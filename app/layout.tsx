import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"

import { noto_sans_sc } from "@/components/ui/fonts"
import { TopBar } from "@/components/topbar"
import type { Tunnel } from "@/lib/tunnel/definition"
import { fetchTunnelById } from "@/lib/tunnel/repository"
import { FooterBar } from "@/components/footerbar"
import { Toaster } from "@/components/ui/toast"

export const metadata = {
  title: "现场进度展示",
  description: "盾构区间进度管理与现场进度展示",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const tunnel: Tunnel | null = fetchTunnelById(1)
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`h-dvh overflow-hidden ${noto_sans_sc.className} antialiased`}
      >
        {/* <ThemeProvider> */}
        <div className="flex h-full flex-col">
          {/* <NavMenu /> */}
          <TopBar tunnel={tunnel} />
          <main className="min-h-0 flex-1 overflow-auto bg-linear-to-b from-background to-brand-100">
            {children}
          </main>
          <FooterBar projectName={tunnel?.project_name} />
        </div>
        <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}

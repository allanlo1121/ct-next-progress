import { Inter, Lusitana, Noto_Sans_SC, Orbitron, JetBrains_Mono } from "next/font/google"

export const inter = Inter({ subsets: ["latin"] })

export const lusitana = Lusitana({
  weight: ["400", "700"],
  subsets: ["latin"],
})

export const noto_sans_sc = Noto_Sans_SC({
  weight: ["400", "700", "900"],
  subsets: ["latin", "cyrillic"],
})
export const orbitron = Orbitron({
  weight: ["400", "700","900"],
  subsets: ["latin"],
})
export const jetbrains_mono = JetBrains_Mono({
  weight: ["400", "700","800"],
  subsets: ["latin"],
})

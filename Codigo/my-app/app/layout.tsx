// Next
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
// CSS
import "./globals.css"
// React
import { ReactNode } from "react"
// Shadcn
import { Toaster } from "@/components/ui/sonner"
// Components
import { ThemeProvider } from "./components/theme-provider"

const montserrat = Montserrat({
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Tuscan",
  description: "Soluções para eventos"
}

type Props = {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${montserrat.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
            
          {children}
          
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

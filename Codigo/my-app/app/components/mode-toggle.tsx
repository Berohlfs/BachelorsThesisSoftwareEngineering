"use client"

// React
import { useEffect, useState } from "react"
// Icons
import { Moon, Sun } from "lucide-react"
// Libs
import { useTheme } from "next-themes"
// Shadcn
import { Button } from "@/components/ui/button"

type Props = {
  variant?: 'button'
}

export function ModeToggle({ variant }: Props) {
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      onClick={()=> setTheme(theme === 'dark' ? 'light' : 'dark')}
      variant={variant === 'button' ? 'ghost' : 'outline'}
      size={variant === 'button' ? 'default' : 'icon'}>
      {variant === 'button' && 'Trocar tema'}
      {theme === 'dark' ? <Moon /> : <Sun />}
      <span className="sr-only">Trocar tema</span>
    </Button>
  )
}

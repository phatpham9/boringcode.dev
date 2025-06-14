"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeMeta() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Update theme-color meta tag based on current theme
    const themeColor = resolvedTheme === "dark" ? "#111827" : "#ffffff"

    // Update existing theme-color meta tag
    let themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", themeColor)
    } else {
      // Create new theme-color meta tag if it doesn't exist
      themeColorMeta = document.createElement("meta")
      themeColorMeta.setAttribute("name", "theme-color")
      themeColorMeta.setAttribute("content", themeColor)
      document.head.appendChild(themeColorMeta)
    }

    // Update Apple status bar style
    const appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    if (appleStatusBarMeta) {
      appleStatusBarMeta.setAttribute("content", resolvedTheme === "dark" ? "black-translucent" : "default")
    }

    // Update MSApplication tile color
    const msTileColorMeta = document.querySelector('meta[name="msapplication-TileColor"]')
    if (msTileColorMeta) {
      msTileColorMeta.setAttribute("content", themeColor)
    }
  }, [mounted, resolvedTheme])

  return null
}

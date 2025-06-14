"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeMeta() {
  const [mounted, setMounted] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    // Check if running as PWA (standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true
    setIsStandalone(standalone)
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

    // Update Apple status bar style based on theme and standalone mode
    let appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    if (!appleStatusBarMeta) {
      appleStatusBarMeta = document.createElement("meta")
      appleStatusBarMeta.setAttribute("name", "apple-mobile-web-app-status-bar-style")
      document.head.appendChild(appleStatusBarMeta)
    }

    if (isStandalone) {
      // In standalone mode, always use black-translucent for transparency with safe areas
      appleStatusBarMeta.setAttribute("content", "black-translucent")
    } else {
      // In browser mode, use theme-appropriate style
      appleStatusBarMeta.setAttribute("content", resolvedTheme === "dark" ? "black-translucent" : "default")
    }

    // Update MSApplication tile color
    const msTileColorMeta = document.querySelector('meta[name="msapplication-TileColor"]')
    if (msTileColorMeta) {
      msTileColorMeta.setAttribute("content", themeColor)
    }

    // Add viewport-fit=cover for iPhone X and newer with notch
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    if (viewportMeta && isStandalone) {
      const currentContent = viewportMeta.getAttribute("content") || ""
      if (!currentContent.includes("viewport-fit=cover")) {
        viewportMeta.setAttribute("content", currentContent + ", viewport-fit=cover")
      }
    }
  }, [mounted, resolvedTheme, isStandalone])

  return null
}

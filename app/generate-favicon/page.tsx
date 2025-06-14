"use client"

import { useState } from "react"
import { Download } from "lucide-react"

export default function GenerateFavicon() {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateFavicon = async () => {
    setIsGenerating(true)

    try {
      // Fetch the organization logo
      const orgResponse = await fetch("/api/github?type=org")
      const orgData = await orgResponse.json()

      if (!orgData.avatar_url) {
        throw new Error("No avatar URL found")
      }

      // Create canvas to generate favicon
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("Could not get canvas context")
      }

      // Create different sizes
      const sizes = [16, 32, 48, 64, 128, 180, 192, 512]

      for (const size of sizes) {
        canvas.width = size
        canvas.height = size

        // Clear canvas
        ctx.clearRect(0, 0, size, size)

        // Load and draw the image
        const img = new Image()
        img.crossOrigin = "anonymous"

        await new Promise((resolve, reject) => {
          img.onload = () => {
            // Draw image to fit canvas
            ctx.drawImage(img, 0, 0, size, size)

            // Convert to blob and download
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `favicon-${size}x${size}.png`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              }
              resolve(null)
            }, "image/png")
          }

          img.onerror = reject
          img.src = orgData.avatar_url
        })
      }

      // Generate ICO file (16x16)
      canvas.width = 16
      canvas.height = 16
      ctx.clearRect(0, 0, 16, 16)

      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 16, 16)

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = "favicon.ico"
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
            }
            resolve(null)
          }, "image/png")
        }

        img.src = orgData.avatar_url
      })
    } catch (error) {
      console.error("Error generating favicon:", error)
      alert("Error generating favicon. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Generate Favicon</h1>
        <p className="text-gray-600 mb-8">
          Click the button below to generate favicon files from your GitHub organization logo. This will download
          multiple sizes for different devices and browsers.
        </p>

        <button
          onClick={generateFavicon}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Generate Favicon Files"}
        </button>

        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">This will generate the following files:</p>
          <ul className="text-left max-w-md mx-auto space-y-1">
            <li>• favicon.ico (16x16)</li>
            <li>• favicon-16x16.png</li>
            <li>• favicon-32x32.png</li>
            <li>• apple-touch-icon.png (180x180)</li>
            <li>• icon-192x192.png (Android)</li>
            <li>• icon-512x512.png (Android)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

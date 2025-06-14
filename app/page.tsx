import { GitHubOrg } from "@/components/github-org"
import { StructuredData } from "@/components/structured-data"
import { PWAInstall } from "@/components/pwa-install"
import { OfflineIndicator } from "@/components/offline-indicator"

export default function Home() {
  return (
    <>
      <StructuredData />
      <main className="min-h-screen bg-white">
        <GitHubOrg />
      </main>
      <PWAInstall />
      <OfflineIndicator />
    </>
  )
}

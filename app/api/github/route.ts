import { type NextRequest, NextResponse } from "next/server"

const GITHUB_API_BASE = "https://api.github.com"
const ORG_NAME = "boringcode-dev"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  try {
    // GitHub API headers for better rate limiting
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "BoringCode-Landing-Page",
    }

    // Add token if available (server-side only)
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`
    }

    if (type === "org") {
      // Fetch organization info
      const orgResponse = await fetch(`${GITHUB_API_BASE}/orgs/${ORG_NAME}`, {
        headers,
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      if (!orgResponse.ok) {
        if (orgResponse.status === 404) {
          // Return fallback data if org not found
          return NextResponse.json({
            login: "boringcode-dev",
            name: "BoringCode.dev",
            description: "We write the boring stuff, so you don't have to.",
            avatar_url: "/logo.png",
            html_url: "https://github.com/boringcode-dev",
            public_repos: 0,
          })
        }
        throw new Error(`Failed to fetch organization: ${orgResponse.status}`)
      }

      const orgData = await orgResponse.json()
      // Override avatar_url to use our custom logo
      orgData.avatar_url = "/logo.png"
      return NextResponse.json(orgData)
    }

    if (type === "repos") {
      // Fetch repositories
      const reposResponse = await fetch(`${GITHUB_API_BASE}/orgs/${ORG_NAME}/repos?sort=updated&per_page=50`, {
        headers,
        next: { revalidate: 1800 }, // Cache for 30 minutes
      })

      if (!reposResponse.ok) {
        if (reposResponse.status === 404) {
          // Return empty repos if org not found
          return NextResponse.json({
            repos: [],
            totalCount: 0,
          })
        }
        throw new Error(`Failed to fetch repositories: ${reposResponse.status}`)
      }

      const reposData = await reposResponse.json()

      // Filter out forks, test repos, and sort by stars
      const filteredRepos = reposData
        .filter((repo: any) => !repo.name.includes(".github") && !repo.name.toLowerCase().includes("test"))
        .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)

      return NextResponse.json({
        repos: filteredRepos.slice(0, 9), // Only return first 9 repositories
        totalCount: filteredRepos.length,
      })
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
  } catch (error) {
    console.error("GitHub API Error:", error)

    // Return fallback data on error
    if (type === "org") {
      return NextResponse.json({
        login: "boringcode-dev",
        name: "BoringCode.dev",
        description: "We write the boring stuff, so you don't have to.",
        avatar_url: "/logo.png",
        html_url: "https://github.com/boringcode-dev",
        public_repos: 0,
      })
    }

    if (type === "repos") {
      return NextResponse.json({
        repos: [],
        totalCount: 0,
      })
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 })
  }
}

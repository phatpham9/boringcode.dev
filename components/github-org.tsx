"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, GitFork, ExternalLink, Calendar, MapPin, Mail, Github } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

interface Repository {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  pushed_at: string
}

interface Organization {
  login: string
  name: string
  description: string | null
  avatar_url: string
  html_url: string
  public_repos: number
}

export function GitHubOrg() {
  const [org, setOrg] = useState<Organization | null>(null)
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalRepos, setTotalRepos] = useState(0)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if running as PWA (standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true
    setIsStandalone(standalone)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch organization info
      const orgResponse = await fetch("/api/github?type=org")
      if (!orgResponse.ok) {
        throw new Error("Failed to fetch organization data")
      }
      const orgData = await orgResponse.json()
      setOrg(orgData)

      // Fetch repositories
      const reposResponse = await fetch("/api/github?type=repos")
      if (!reposResponse.ok) {
        throw new Error("Failed to fetch repositories data")
      }
      const reposData = await reposResponse.json()

      setRepos(reposData.repos || [])
      setTotalRepos(reposData.totalCount || 0)
    } catch (err) {
      console.error("API Error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")

      // Set fallback data on error
      setOrg({
        login: "boringcode-dev",
        name: "BoringCode.dev",
        description: "We write the boring stuff, so you don't have to.",
        avatar_url: "/logo.png",
        html_url: "https://github.com/boringcode-dev",
        public_repos: 0,
      })
      setRepos([])
      setTotalRepos(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-500",
      Shell: "bg-green-500",
      HTML: "bg-orange-500",
      CSS: "bg-purple-500",
      Python: "bg-blue-600",
      Go: "bg-cyan-500",
    }
    return colors[language || ""] || "bg-gray-400"
  }

  if (loading) {
    return (
      <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors ${isStandalone ? "pt-safe" : ""}`}>
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors ${isStandalone ? "pt-safe" : ""}`}>
      {/* Theme Toggle - Adjusted for PWA safe area */}
      <div className={`fixed top-4 right-4 z-50 ${isStandalone ? "safe-area-inset-top" : ""}`}>
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 transition-colors">
              <Image
                src="/logo.png"
                alt="BoringCode.dev logo"
                width={80}
                height={80}
                className="rounded-full"
                priority
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            {org?.name || "BoringCode.dev"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 transition-colors">
            {org?.description || "We write the boring stuff, so you don't have to."}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 transition-colors">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>Ho Chi Minh, Vietnam</span>
            </div>
            <div className="flex items-center gap-1">
              <Github className="w-4 h-4" />
              <a
                href={org?.html_url || "https://github.com/boringcode-dev"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                GitHub
              </a>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <a
                href="mailto:hi@boringcode.dev"
                className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                hi@boringcode.dev
              </a>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 max-w-md mx-auto transition-colors">
              <p>Using cached data. Some information may not be up to date.</p>
            </div>
          )}
        </header>

        {/* Projects Section */}
        <section aria-labelledby="featured-projects">
          <h2 id="featured-projects" className="sr-only">
            Featured Projects
          </h2>

          {repos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">
                No repositories found or still loading...
              </p>
              <a
                href="https://github.com/boringcode-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repos.map((repo) => (
                <article key={repo.id}>
                  <Card className="hover:shadow-lg dark:hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-900/50 transition-all h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-900 dark:text-white"
                            >
                              {repo.name}
                            </a>
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                            {repo.description || "No description available"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Language and Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            {repo.language && (
                              <div className="flex items-center gap-1">
                                <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />
                                <span>{repo.language}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>{repo.stargazers_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="w-4 h-4" />
                              <span>{repo.forks_count}</span>
                            </div>
                          </div>
                        </div>

                        {/* Topics */}
                        {repo.topics && repo.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {repo.topics.slice(0, 3).map((topic) => (
                              <Badge
                                key={topic}
                                variant="secondary"
                                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                              >
                                {topic}
                              </Badge>
                            ))}
                            {repo.topics.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                              >
                                +{repo.topics.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Last Updated */}
                        {repo.updated_at && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>Updated {formatDate(repo.updated_at)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* View More Section */}
        {totalRepos > 9 && (
          <section className="text-center mt-12">
            <a
              href={org?.html_url || "https://github.com/boringcode-dev"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              aria-label="View all projects on GitHub"
            >
              View More Projects <ExternalLink className="w-4 h-4" />
            </a>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors">
          <p>Built with Next.js and Tailwind CSS • Data from GitHub API</p>
        </footer>
      </div>
    </div>
  )
}

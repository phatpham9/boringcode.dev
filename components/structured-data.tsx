export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BoringCode.dev",
    description: "We write the boring stuff, so you don't have to.",
    url: "https://boringcode.dev",
    logo: "https://boringcode.dev/logo.png",
    sameAs: ["https://github.com/boringcode-dev"],
    foundingDate: "2023",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "technical support",
      url: "https://github.com/boringcode-dev",
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BoringCode.dev",
    description: "Open source development tools and code generators",
    url: "https://boringcode.dev",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://github.com/boringcode-dev?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BoringCode Development Tools",
    description: "Collection of open source development tools, code generators, and configuration packages",
    url: "https://boringcode.dev",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "BoringCode.dev",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
    </>
  )
}

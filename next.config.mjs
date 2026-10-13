/** @type {import('next').NextConfig} */

/**
 * SEO URL compatibility layer.
 *
 * The redesigned Next.js app uses short, modern route folders (e.g. /faq, /sell),
 * but the legacy site deployed on listo.ca is indexed by Google under different
 * paths (e.g. /faqs, /sell-with-listo). To avoid breaking SEO we:
 *
 *  1. `rewrites()`  -> serve the new redesigned page when a LEGACY url is requested,
 *                      keeping the legacy url visible in the browser (canonical url).
 *  2. `redirects()` -> permanently (308) send the internal/new path to the legacy
 *                      canonical url, so a single canonical url is exposed and there
 *                      is no duplicate content.
 *
 * Legacy canonical url  <->  internal new route
 */
const urlMap = [
  { legacy: "/join-us", internal: "/join-listo" },
  { legacy: "/real-estate-agents", internal: "/team" },
  { legacy: "/faqs", internal: "/faq" },
  { legacy: "/sell-with-listo", internal: "/sell" },
  { legacy: "/exclusive-real-estate-listings-overview", internal: "/exclusive" },
  { legacy: "/ontario-first-time-home-buyers-guide", internal: "/first-time-buyers" },
  { legacy: "/real-estate-for-new-buyers", internal: "/new-buyers" },
  { legacy: "/real-estate-for-new-buyers/what-can-i-buy", internal: "/what-i-can-get" },
  { legacy: "/real-estate-for-new-buyers/where-can-i-buy", internal: "/where-i-can-get" },
  { legacy: "/real-estate-by-location", internal: "/quick-browser" },
  { legacy: "/user-property-feed", internal: "/new-for-you" },
  { legacy: "/trending", internal: "/trendings" },
  { legacy: "/home-and-condos-for-investment", internal: "/investors" },
  { legacy: "/real-estate-market-stats", internal: "/stats" },
  { legacy: "/top-condo-buildings-in-ontario", internal: "/buildings" },
  { legacy: "/pre-construction-projects-by-area", internal: "/preconstruction" },
  { legacy: "/real-estate-listings", internal: "/listings" },
];

/**
 * Dynamic single-segment mappings.
 * `:seg` captures one path segment and is forwarded to the destination.
 */
const dynamicUrlMap = [
  // /investment-properties-in-toronto  ->  /investors/toronto
  { legacy: "/investment-properties-in-:city", internal: "/investors/:city" },
  // /real-estate-market-stats/toronto--toronto  ->  /stats/toronto--toronto
  { legacy: "/real-estate-market-stats/:slug", internal: "/stats/:slug" },
];

const nextConfig = {
  allowedDevOrigins: [
    "67dd-2407-aa80-15-8e3-b490-7cba-d71-f6d0.ngrok-free.app",
    "*.ngrok-free.app",
  ],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.listo.ca" },
      { protocol: "https", hostname: "listo.ca" },
      { protocol: "https", hostname: "**.listo.ca" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.cloudfront.net" },
    ],
  },

  async rewrites() {
    return {
      beforeFiles: [
        // Legacy country-root home page.
        { source: "/ca", destination: "/" },
        { source: "/feed", destination: "/new-for-you" },
        { source: "/watchlist", destination: "/bookmarks?tab=watchlist" },
        { source: "/my-postings", destination: "/account?tab=postings" },

        ...urlMap.map(({ legacy, internal }) => ({
          source: legacy,
          destination: internal,
        })),

        ...dynamicUrlMap.map(({ legacy, internal }) => ({
          source: legacy,
          destination: internal,
        })),

        // Legacy condo buildings list filtered by area:
        //   /top-condo-buildings-in-ontario/:area
        {
          source: "/top-condo-buildings-in-ontario/:area",
          destination: "/buildings?area=:area",
        },

        // Legacy pre-construction project detail (numeric ids):
        //   /pre-construction/<project_id>/<development_id>/<name>
        // Served by the shared project detail page, which parses the ids from
        // the (browser-visible) path. Must come BEFORE the single-segment area
        // rule below so 3-segment project urls are not mis-routed.
        {
          source: "/pre-construction/:projectId/:devId/:name",
          destination: "/preconstruction/project",
        },

        // Legacy pre-construction project detail (condos style2 slug):
        //   /pre-construction-condos-<area>/<title-slug>
        {
          source: "/pre-construction-condos-:area/:slug",
          destination: "/preconstruction/project",
        },

        // Legacy pre-construction area page: /pre-construction/<area>.
        { source: "/pre-construction/:city", destination: "/preconstruction/:city" },

        // Legacy condo building detail:
        //   /condo-building/:area/:munc/:addr/:title?
        // Served by /buildings/[slug]; page parses addr_slug from the path.
        {
          source: "/condo-building/:area/:munc/:addr/:title",
          destination: "/buildings/:addr",
        },
        {
          source: "/condo-building/:area/:munc/:addr",
          destination: "/buildings/:addr",
        },
      ],

      // afterFiles runs only when no real page/route matched, so these broad
      // location patterns never shadow the app's own routes.
      afterFiles: [
        // Legacy location search urls (from main_search access_url), e.g.
        //   /peel/brampton/toronto-gore-rural-estate/homes-for-sale  (area/munc/comm)
        //   /toronto/toronto/condos-for-sale                         (area/munc)
        //   /toronto/homes-for-sale                                  (area)
        // -> functional listings search page. Unused params (area/munc/comm/
        //    saletype) are auto-forwarded to the destination as query.
        {
          source:
            "/:area/:munc/:comm/:saletype(homes-for-sale|homes-for-lease|houses-for-sale|houses-for-lease|condos-for-sale|condos-for-lease)",
          destination: "/listings",
        },
        {
          source:
            "/:area/:munc/:saletype(homes-for-sale|homes-for-lease|houses-for-sale|houses-for-lease|condos-for-sale|condos-for-lease)",
          destination: "/listings",
        },
        {
          source:
            "/:area/:saletype(homes-for-sale|homes-for-lease|houses-for-sale|houses-for-lease|condos-for-sale|condos-for-lease)",
          destination: "/listings",
        },
      ],
    };
  },

  async redirects() {
    return [
      ...urlMap.map(({ legacy, internal }) => ({
        source: internal,
        destination: legacy,
        permanent: true,
      })),
      {
        source: "/investors/:city",
        destination: "/investment-properties-in-:city",
        permanent: true,
      },
      {
        source: "/stats/:slug",
        destination: "/real-estate-market-stats/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

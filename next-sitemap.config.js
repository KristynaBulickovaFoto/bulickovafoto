/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://kristynafoto.cz",
  generateRobotsTxt: true,
  exclude: ["/admin/*", "/klient/*", "/login", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/klient", "/login", "/api"],
      },
    ],
  },
};

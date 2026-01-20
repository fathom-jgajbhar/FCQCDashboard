export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "FischCast QC Dashboard",
  description: "A quality control dashboard for FischCast project data.",
  navItems: [
    {
      label: "Regions",
      href: "/regions",
    },
  ],
  navMenuItems: [
    {
      label: "Regions",
      href: "/regions",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenu,
} from "@heroui/navbar";
import NextLink from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-center items-center gap-2" href="/">
            <Logo />
            <h1 className="font-bold text-inherit">QC Dash</h1>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem>
          {/* <ul className="text-sm items-center justify-center">
            {siteConfig.navMenuItems.map((item) => (
              <li key={item.href}>
                <NextLink href={item.href}>{item.label}</NextLink>
              </li>
            ))}
          </ul> */}
        </NavbarItem>
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
        <NavbarMenu>
          {/* <ul className="text-sm items-center justify-center">
            {siteConfig.navMenuItems.map((item) => (
              <li key={item.href}>
                <NextLink href={item.href}>{item.label}</NextLink>
              </li>
            ))}
          </ul> */}
        </NavbarMenu>
      </NavbarContent>
    </HeroUINavbar>
  );
};

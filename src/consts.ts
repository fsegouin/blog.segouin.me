import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "blog.segouin.me",
  DESCRIPTION: "Yet another blog.",
  EMAIL: "florent@segouin.me",
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: SITE.DESCRIPTION,
};

export const SOCIALS: Socials = [
  {
    NAME: "GitHub",
    HREF: "https://github.com/fsegouin",
  },
  {
    NAME: "Website",
    HREF: "https://segouin.me",
  },
  {
    NAME: "LinkedIn",
    HREF: "https://www.linkedin.com/in/florentsegouin",
  },
];

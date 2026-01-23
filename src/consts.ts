import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "blog.segouin.me",
  DESCRIPTION: "Yet another blog.",
  EMAIL: "florent@segouin.me",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Yet another blog.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles that might be of interest (or not).",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of my projects." 
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

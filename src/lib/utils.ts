import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

const WORDS_PER_MINUTE = 200;

export function readingTime(markdown: string) {
  const textOnly = markdown
    // MDX compiles ESM import/export statements away, so they never reach
    // the reader. Tag markup is stripped by the next rule, but these are
    // bare statements with no angle brackets to catch them.
    .replace(/^[ \t]*(?:import|export)\s[^\n]*$/gm, "")
    .replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = (wordCount / WORDS_PER_MINUTE + 1).toFixed();
  return `${readingTimeMinutes} min read`;
}

export type NavLink = {
  label: string;
  href: string;
};

export type NavSection = {
  heading: string;
  links?: NavLink[];
};

export type NavColumn = {
  sections: NavSection[];
};

export type NavItem = {
  label: string;
  href: string;
  featured?: string;
  featuredLabel?: string;
  featuredTitle?: string;
  featuredHref?: string;
  children?: NavLink[];
  columns?: NavColumn[];
};

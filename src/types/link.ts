export type LinkSection = "main" | "resume";

export type LinkData = {
  name: string;
  url: string;
  section?: LinkSection
};

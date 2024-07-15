import type { JobCompany } from "./JobCompany";
import type { JobLocation } from "./JobLocation";
import type { JobLocationType } from "./JobLocationType";
import type { JobTitle } from "./JobTitle";
import type { Skill } from "./Skill";

type ResumeExperience = {
  title: JobTitle;
  companyName: JobCompany;
  startDate: Date;
  endDate?: Date;
  location: JobLocation;
  locationType: JobLocationType;
  bulletPoints: string[];
  skills: Skill[];
};

type ResumeCertificate = {
  title: string;
  issuedBy: string;
  issuedDate: string;
  certUrl: string;
  length?: string;
  items: string[][];
  itemsTitle: string;
  includesPractice: boolean;
};

export type ResumeData = {
  experience: ResumeExperience[];
  certifications: ResumeCertificate[];
};

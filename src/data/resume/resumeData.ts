import type { ResumeData } from "~/types/resume/ResumeData";
import { resumeCertifications } from "./certifications";
import { resumeExperience } from "./experience";

export const resumeData: ResumeData = {
  experience: resumeExperience,
  certifications: resumeCertifications
};

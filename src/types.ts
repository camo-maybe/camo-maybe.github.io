export interface ProjectData {
  name: string;
  description: string;
  highlights: string[];
  techStack: string[];
  category: string;
  status: string;
}

export interface SkillData {
  name: string;
  category: string;
}

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  links: {
    github: string;
    email?: string;
  };
}

export interface PortfolioData {
  profile: ProfileData;
  skills: SkillData[];
  projects: ProjectData[];
}

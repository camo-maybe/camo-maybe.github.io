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
  months?: number;
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

export interface WorkProject {
  date: string;
  endDate: string;
  name: string;
  description: string;
  role: string;
  skills: string[];
  duration: number;
  type: string;
}

export interface PortfolioData {
  profile: ProfileData;
  skills: SkillData[];
  projects: ProjectData[];
  experience?: WorkProject[];
}

import type { Step } from "./workspace";

export interface setproject {
  title: string;
  category: string;
  targetUsers: string[];
  coreFeatures: string[];
  technologyStack: string[];
  problemSolving: {
    currentProblem: string;
    solutionIdea: string;
    expectedBenefits: string[];
  };
}
export interface getproject extends setproject {
  projectInfoId: number;
}
export interface similarproject {
  workspaceId: number,
  projectName: string,
  teamName: string,
  isPublic: boolean,
  ownerId: number,
  progressStep: Step
}
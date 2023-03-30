export interface JobsModel {
  id: number;
  disabled?: boolean;
  jobNumber: string;
  jobTitle: string;
  jobStartDate: string;
  jobCloseDate: string;
  experienceRequired: boolean;
  numberOfOpenings: number;
  jobNotes: string;
}

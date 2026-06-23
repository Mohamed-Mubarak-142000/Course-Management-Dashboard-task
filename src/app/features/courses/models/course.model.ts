export enum CourseStatus {
  Active = 'active',
  Draft = 'draft',
  Archived = 'archived',
}

export interface Course {
  id: number;
  courseName: string;
  instructorName: string;
  category: string;
  duration: number;
  price: number;
  status: CourseStatus;
  description?: string;
  createdDate: string;
}

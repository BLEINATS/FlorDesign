
export enum Screen {
  UPLOAD,
  EDIT,
  RESULT,
  PROJECTS,
}

export interface Project {
  id: string;
  originalImage: string;
  generatedImage: string;
  prompt: string;
  createdAt: string;
}

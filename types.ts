
export interface ImageData {
  data: string; // base64 encoded image data
  mimeType: string;
}

export type EditMode = 'edit' | 'create' | 'humanize';

export interface EditConfig {
  prompt: string;
  negativePrompt?: string;
  mode: EditMode;
  isHighQuality: boolean;
  fidelityLevel: 'strict' | 'balanced' | 'creative';
}

export interface Project {
  id: string;
  prompt: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  createdAt: string; // ISO string date
}

export type Screen = 'landing' | 'upload' | 'edit' | 'result' | 'projects' | 'projectDetail';

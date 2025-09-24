export interface ImageData {
  data: string; // base64 encoded image data
  mimeType: string;
}

export type EditMode = 'edit' | 'create';

export interface Project {
  id: string;
  prompt: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  createdAt: string; // ISO string date
}

// FIX: Added Screen type to resolve type errors in App.tsx
export type Screen = 'landing' | 'upload' | 'edit' | 'result' | 'projects' | 'projectDetail';

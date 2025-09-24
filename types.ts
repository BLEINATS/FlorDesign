export interface Project {
  id: string;
  prompt: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  createdAt: string;
}

export interface ImageData {
  data: string;
  mimeType: string;
}

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
  cost: number; // Custo em créditos desta geração
}

export type Screen = 'landing' | 'dashboard' | 'upload' | 'choice' | 'edit' | 'result' | 'projects' | 'projectDetail' | 'profile' | 'store' | 'catalog' | 'admin';

export interface CreditPackage {
  id: string;
  credits: number;
  price: string;
  label: string;
  popular?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isGuest: boolean;
  isAdmin?: boolean;
  createdAt?: string;
  credits?: number; // Novo campo para persistir o saldo no cadastro
}

// Nova Interface de Transação Financeira (Entrada de Dinheiro)
export interface Transaction {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    packageId: string;
    packageLabel: string;
    creditsAmount: number;
    price: string; // Valor formatado (ex: "R$ 29,90")
    value: number; // Valor numérico para cálculos (ex: 29.90)
    date: string;
    status: 'completed' | 'pending' | 'failed';
    paymentMethod: 'credit_card' | 'pix';
    billingCycle?: 'one-time' | 'monthly' | 'yearly';
}

// Nova Interface de Log de Uso (Saída de Dinheiro / Custo API)
export interface UsageLog {
    id: string;
    userId: string;
    action: 'generate' | 'humanize';
    costInBrl: number; // Custo real em R$ para a empresa
    date: string;
}

export interface SystemSettings {
    geminiApiKey: string;
    stripePublicKey: string;
    stripeSecretKey: string;
    currency: string;
}

export interface FlowerItem {
    id: string;
    name: string;
    scientificName: string;
    category: 'classic' | 'tropical' | 'wild' | 'foliage' | 'dried';
    season: string;
    colors: string[];
    image: string;
    description: string;
    photographer?: string;
    photographerUrl?: string;
    downloadLocation?: string;
}

// Custo em CRÉDITOS (Moeda do Jogo - O que o usuário gasta)
export const COSTS = {
    STANDARD: 5,
    HUMANIZE: 10
};

// Custo em REAIS (Custo Operacional da API Gemini Flash - O que a empresa gasta)
export const AI_OPERATIONAL_COSTS = {
    STANDARD: 0.0015, // R$ 0,0015 por requisição
    HUMANIZE: 0.0030  // R$ 0,0030 (Estimado para prompts maiores de humanização)
};

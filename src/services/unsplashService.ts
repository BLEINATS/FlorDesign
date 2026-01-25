import { FlowerItem } from '../types';
import { FLOWERS_DATA } from '../data/catalogData';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '';
const API_URL = 'https://api.unsplash.com/search/photos';

// Mapeia o resultado da Unsplash para o nosso formato FlowerItem
const mapUnsplashToFlower = (photo: any): FlowerItem => {
    return {
        id: photo.id,
        name: photo.description || photo.alt_description || 'Flor Desconhecida',
        scientificName: 'Unsplash Collection', // A API não retorna nome científico, usamos placeholder
        category: 'wild', // Categoria genérica para busca dinâmica
        season: 'Variável',
        colors: [photo.color || '#ffffff'],
        image: photo.urls.regular, // URL direta (Hotlink)
        description: photo.alt_description || 'Imagem fornecida via Unsplash API.',
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        downloadLocation: photo.links.download_location
    };
};

export const searchFlowers = async (query: string): Promise<FlowerItem[]> => {
    // 1. Se não houver chave ou query vazia, retorna dados estáticos (Fallback)
    if (!UNSPLASH_ACCESS_KEY || !query.trim()) {
        if (query.trim()) {
            // Filtro local simples nos dados estáticos
            return FLOWERS_DATA.filter(f => 
                f.name.toLowerCase().includes(query.toLowerCase()) || 
                f.scientificName.toLowerCase().includes(query.toLowerCase())
            );
        }
        return FLOWERS_DATA;
    }

    // 2. Busca na API Real
    try {
        const response = await fetch(`${API_URL}?query=${encodeURIComponent(query + ' flowers')}&per_page=20&orientation=squarish`, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error('Falha na Unsplash API');
        }

        const data = await response.json();
        
        // Mapeia e combina com dados estáticos para garantir variedade
        const apiFlowers = data.results.map(mapUnsplashToFlower);
        return [...apiFlowers]; 

    } catch (error) {
        console.warn("Erro ao buscar na Unsplash, usando catálogo offline:", error);
        return FLOWERS_DATA.filter(f => 
            f.name.toLowerCase().includes(query.toLowerCase())
        );
    }
};

// Função para disparar o evento de download (Regra da Unsplash)
export const trackDownload = async (downloadLocation?: string) => {
    if (!downloadLocation || !UNSPLASH_ACCESS_KEY) return;
    try {
        await fetch(downloadLocation, {
            headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` }
        });
    } catch (e) {
        console.error("Erro tracking download:", e);
    }
};

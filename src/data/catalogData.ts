import { FlowerItem } from '../types';

// Dados estáticos atualizados com créditos (Mock) para manter consistência
export const FLOWERS_DATA: FlowerItem[] = [
    // --- CLÁSSICAS (Foco em Casamentos) ---
    {
        id: '1',
        name: 'Orquídea Phalaenopsis',
        scientificName: 'Phalaenopsis',
        category: 'classic',
        season: 'Ano todo',
        colors: ['#FFFFFF', '#FF69B4', '#800080'],
        image: 'https://images.unsplash.com/photo-1599691853610-c97753e60249?auto=format&fit=crop&q=80&w=600',
        description: 'Elegância atemporal, perfeita para casamentos luxuosos e arranjos minimalistas.',
        photographer: 'Mona Eendra',
        photographerUrl: 'https://unsplash.com/@monaeendra'
    },
    {
        id: '3',
        name: 'Rosa Inglesa (David Austin)',
        scientificName: 'Rosa Austin',
        category: 'classic',
        season: 'Primavera/Verão',
        colors: ['#FFC0CB', '#FFFFFF', '#FF0000'],
        image: 'https://images.unsplash.com/photo-1554359679-05510684f85e?auto=format&fit=crop&q=80&w=600',
        description: 'Muitas pétalas e perfume suave, ideal para buquês românticos e centros de mesa.',
        photographer: 'Nita',
        photographerUrl: 'https://unsplash.com/@nita'
    },
    {
        id: '8',
        name: 'Peônia',
        scientificName: 'Paeonia',
        category: 'classic',
        season: 'Final da Primavera',
        colors: ['#FFC0CB', '#FFFFFF', '#8B0000'],
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=600',
        description: 'A rainha das flores de casamento. Flores grandes, macias e exuberantes.',
        photographer: 'Kari Shea',
        photographerUrl: 'https://unsplash.com/@karishea'
    },
    {
        id: '9',
        name: 'Hortênsia',
        scientificName: 'Hydrangea macrophylla',
        category: 'classic',
        season: 'Verão',
        colors: ['#87CEEB', '#FFFFFF', '#800080', '#90EE90'],
        image: 'https://images.unsplash.com/photo-1505322986884-2453629471f0?auto=format&fit=crop&q=80&w=600',
        description: 'Volume instantâneo e textura suave. Perfeita para preencher grandes espaços.',
        photographer: 'Annie Spratt',
        photographerUrl: 'https://unsplash.com/@anniespratt'
    },
    {
        id: '10',
        name: 'Ranúnculo',
        scientificName: 'Ranunculus asiaticus',
        category: 'classic',
        season: 'Inverno/Primavera',
        colors: ['#FFA500', '#FFC0CB', '#FFFFFF', '#FF0000'],
        image: 'https://images.unsplash.com/photo-1622369466398-3e3c662b6615?auto=format&fit=crop&q=80&w=600',
        description: 'Pétalas finas como papel de seda em camadas densas e espirais perfeitas.',
        photographer: 'Yoksel Zok',
        photographerUrl: 'https://unsplash.com/@yoksel'
    },
    {
        id: 'tulipas',
        name: 'Tulipas Premium',
        scientificName: 'Tulipa',
        category: 'classic',
        season: 'Primavera',
        colors: ['#FF0000', '#FFFF00', '#FFFFFF'],
        image: 'https://images.unsplash.com/photo-1520013577616-a3c8e7df883e?auto=format&fit=crop&q=80&w=600',
        description: 'Hastes longas e flores elegantes, trazem sofisticação moderna.',
        photographer: 'Katsia Jazwinska',
        photographerUrl: 'https://unsplash.com/@katsia'
    },
    {
        id: 'lirios',
        name: 'Lírios Casa Blanca',
        scientificName: 'Lilium',
        category: 'classic',
        season: 'Verão',
        colors: ['#FFFFFF', '#FF69B4'],
        image: 'https://images.unsplash.com/photo-1588600962383-e189874a706f?auto=format&fit=crop&q=80&w=600',
        description: 'Flores grandes, brancas e perfumadas, ótimas para destaque focal.',
        photographer: 'Matt Seymour',
        photographerUrl: 'https://unsplash.com/@mattseymour'
    },
    {
        id: 'copo_leite',
        name: 'Copo de Leite',
        scientificName: 'Zantedeschia aethiopica',
        category: 'classic',
        season: 'Ano todo',
        colors: ['#FFFFFF'],
        image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&q=80&w=600',
        description: 'Linhas arquitetônicas e puras. Ideal para casamentos modernos.',
        photographer: 'Hassan Pasha',
        photographerUrl: 'https://unsplash.com/@hassanpasha'
    },

    // --- TROPICAIS ---
    {
        id: '4',
        name: 'Ave do Paraíso',
        scientificName: 'Strelitzia',
        category: 'tropical',
        season: 'Verão',
        colors: ['#FFA500', '#0000FF'],
        image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&q=80&w=600',
        description: 'Forma exótica e vibrante que lembra um pássaro em voo.',
        photographer: 'Hulki Okan Tabak',
        photographerUrl: 'https://unsplash.com/@hulkiokantabak'
    },
    {
        id: '6',
        name: 'Protea King',
        scientificName: 'Protea cynaroides',
        category: 'tropical',
        season: 'Inverno/Primavera',
        colors: ['#FF69B4', '#FFFFFF'],
        image: 'https://images.unsplash.com/photo-1546815336-3242049c322b?auto=format&fit=crop&q=80&w=600',
        description: 'Uma flor majestosa, pré-histórica e de grande impacto visual.',
        photographer: 'Sven Scheuermeier',
        photographerUrl: 'https://unsplash.com/@sven_scheuermeier'
    },
    {
        id: '11',
        name: 'Antúrio',
        scientificName: 'Anthurium andraeanum',
        category: 'tropical',
        season: 'Ano todo',
        colors: ['#FF0000', '#FFC0CB', '#FFFFFF', '#000000'],
        image: 'https://images.unsplash.com/photo-1612354658428-360699266d6c?auto=format&fit=crop&q=80&w=600',
        description: 'Folhas modificadas brilhantes e cerosas. Design moderno e durável.',
        photographer: 'Hassan Pasha',
        photographerUrl: 'https://unsplash.com/@hassanpasha'
    },
    {
        id: '12',
        name: 'Helicônia',
        scientificName: 'Heliconia',
        category: 'tropical',
        season: 'Verão',
        colors: ['#FF4500', '#FFFF00'],
        image: 'https://images.unsplash.com/photo-1569351472865-98305c588524?auto=format&fit=crop&q=80&w=600',
        description: 'Estruturas pendentes ou eretas vibrantes, trazem geometria ao arranjo.',
        photographer: 'David Clode',
        photographerUrl: 'https://unsplash.com/@davidclode'
    },
    {
        id: 'alpina',
        name: 'Alpínia',
        scientificName: 'Alpinia purpurata',
        category: 'tropical',
        season: 'Ano todo',
        colors: ['#FF0000', '#FFC0CB'],
        image: 'https://images.unsplash.com/photo-1596726683856-170733857e4e?auto=format&fit=crop&q=80&w=600',
        description: 'Haste longa e vermelha, essencial para arranjos tropicais altos.',
        photographer: 'Kier In Sight',
        photographerUrl: 'https://unsplash.com/@kierinsight'
    },

    // --- FOLHAGENS ---
    {
        id: '2',
        name: 'Costela de Adão',
        scientificName: 'Monstera Deliciosa',
        category: 'foliage',
        season: 'Ano todo',
        colors: ['#13ec5b'],
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600',
        description: 'A folhagem tropical mais icônica, traz volume e padrão.',
        photographer: 'Huy Phan',
        photographerUrl: 'https://unsplash.com/@huyphan2602'
    },
    {
        id: '7',
        name: 'Eucalipto',
        scientificName: 'Eucalyptus cinerea',
        category: 'foliage',
        season: 'Ano todo',
        colors: ['#8FBC8F'],
        image: 'https://images.unsplash.com/photo-1515446134878-a28b702133d3?auto=format&fit=crop&q=80&w=600',
        description: 'Aroma fresco e tom verde-azulado (Sage). Essencial para boho e clássico.',
        photographer: 'Annie Spratt',
        photographerUrl: 'https://unsplash.com/@anniespratt'
    },
    {
        id: '13',
        name: 'Samambaia',
        scientificName: 'Nephrolepis exaltata',
        category: 'foliage',
        season: 'Ano todo',
        colors: ['#228B22'],
        image: 'https://images.unsplash.com/photo-1596520935360-141263c95a28?auto=format&fit=crop&q=80&w=600',
        description: 'Textura plumosa e volume para preenchimento.',
        photographer: 'Teemu Paananen',
        photographerUrl: 'https://unsplash.com/@teemupaananen'
    },
    {
        id: '14',
        name: 'Folha de Palmeira',
        scientificName: 'Arecaceae',
        category: 'foliage',
        season: 'Ano todo',
        colors: ['#006400'],
        image: 'https://images.unsplash.com/photo-1594494165996-562696f86368?auto=format&fit=crop&q=80&w=600',
        description: 'Folhas em leque ou pena, criam estrutura e fundo.',
        photographer: 'Chris Abney',
        photographerUrl: 'https://unsplash.com/@chrisabney'
    },
    {
        id: 'ruscus',
        name: 'Ruscus',
        scientificName: 'Ruscus aculeatus',
        category: 'foliage',
        season: 'Ano todo',
        colors: ['#006400'],
        image: 'https://images.unsplash.com/photo-1615461874283-7c9889574d6b?auto=format&fit=crop&q=80&w=600',
        description: 'Folhas pequenas e duráveis, ótimo para guirlandas e detalhes.',
        photographer: 'Scott Webb',
        photographerUrl: 'https://unsplash.com/@scottwebb'
    },
    {
        id: 'hera',
        name: 'Hera (Ivy)',
        scientificName: 'Hedera helix',
        category: 'foliage',
        season: 'Ano todo',
        colors: ['#006400'],
        image: 'https://images.unsplash.com/photo-1628519588938-233c46a6774e?auto=format&fit=crop&q=80&w=600',
        description: 'Trepadeira clássica para cascatas e muros verdes.',
        photographer: 'Paul Green',
        photographerUrl: 'https://unsplash.com/@paulgreen'
    },

    // --- BOHO / SECAS ---
    {
        id: '5',
        name: 'Capim dos Pampas',
        scientificName: 'Cortaderia selloana',
        category: 'dried',
        season: 'Outono',
        colors: ['#F5F5DC', '#D2B48C'],
        image: 'https://images.unsplash.com/photo-1599598425947-640105342739?auto=format&fit=crop&q=80&w=600',
        description: 'Textura de pluma, altura e tons neutros. O favorito do estilo Boho.',
        photographer: 'Katsia Jazwinska',
        photographerUrl: 'https://unsplash.com/@katsia'
    },
    {
        id: '15',
        name: 'Rabo de Coelho',
        scientificName: 'Lagurus ovatus',
        category: 'dried',
        season: 'Verão/Outono',
        colors: ['#F5DEB3', '#FFFFFF'],
        image: 'https://images.unsplash.com/photo-1629249684617-e5aac2290467?auto=format&fit=crop&q=80&w=600',
        description: 'Pequenos pompons macios que adicionam textura delicada.',
        photographer: 'Evie S.',
        photographerUrl: 'https://unsplash.com/@evieshaffer'
    },
    {
        id: '16',
        name: 'Palmeira Seca (Leque)',
        scientificName: 'Dried Palm Spear',
        category: 'dried',
        season: 'Ano todo',
        colors: ['#DEB887'],
        image: 'https://images.unsplash.com/photo-1669837563148-522619cb2409?auto=format&fit=crop&q=80&w=600',
        description: 'Formas geométricas naturais em tons terrosos.',
        photographer: 'Content Pixie',
        photographerUrl: 'https://unsplash.com/@contentpixie'
    },
    {
        id: 'algodao',
        name: 'Ramo de Algodão',
        scientificName: 'Gossypium',
        category: 'dried',
        season: 'Inverno',
        colors: ['#FFFFFF'],
        image: 'https://images.unsplash.com/photo-1543886476-193633d7d7b5?auto=format&fit=crop&q=80&w=600',
        description: 'Tufos brancos e macios, trazem conforto visual.',
        photographer: 'Mel Poole',
        photographerUrl: 'https://unsplash.com/@melpoole'
    },

    // --- SILVESTRES ---
    {
        id: '17',
        name: 'Lavanda',
        scientificName: 'Lavandula',
        category: 'wild',
        season: 'Verão',
        colors: ['#9370DB'],
        image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&q=80&w=600',
        description: 'Charme provençal, cor vibrante e aroma inconfundível.',
        photographer: 'Heather Barnes',
        photographerUrl: 'https://unsplash.com/@heatherbarnes'
    },
    {
        id: '18',
        name: 'Girassol',
        scientificName: 'Helianthus annuus',
        category: 'wild',
        season: 'Verão',
        colors: ['#FFD700'],
        image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&q=80&w=600',
        description: 'Alegria e rusticidade. Ideal para casamentos no campo.',
        photographer: 'Brigitte Tohm',
        photographerUrl: 'https://unsplash.com/@brigittetohm'
    },
    {
        id: '19',
        name: 'Camomila',
        scientificName: 'Matricaria chamomilla',
        category: 'wild',
        season: 'Primavera',
        colors: ['#FFFFFF', '#FFFF00'],
        image: 'https://images.unsplash.com/photo-1603531773539-75b948083894?auto=format&fit=crop&q=80&w=600',
        description: 'Pequenas margaridas que trazem leveza e ar campestre.',
        photographer: 'Nika Benedictova',
        photographerUrl: 'https://unsplash.com/@nikabenedictova'
    },
    {
        id: 'mosquitinho',
        name: 'Gipsofila (Mosquitinho)',
        scientificName: 'Gypsophila paniculata',
        category: 'wild',
        season: 'Ano todo',
        colors: ['#FFFFFF'],
        image: 'https://images.unsplash.com/photo-1616694827364-754641644c0f?auto=format&fit=crop&q=80&w=600',
        description: 'Nuvens brancas delicadas. Usada sozinha ou como complemento.',
        photographer: 'Katsia Jazwinska',
        photographerUrl: 'https://unsplash.com/@katsia'
    }
];

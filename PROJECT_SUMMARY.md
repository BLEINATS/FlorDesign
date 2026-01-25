# FloraDesign AI - Documentação do Projeto

## 1. Visão Geral do Produto
O **FloraDesign AI** é uma aplicação SaaS (Software as a Service) focada no nicho de decoração floral e eventos. O objetivo é permitir que decoradores e floristas visualizem arranjos em espaços reais antes da execução, utilizando Inteligência Artificial Generativa.

**Estética:** "Dark Forest Luxury" (Fundo escuro `#102216`, acentos em Verde Neon `#13ec5b`, tipografia Serif elegante e efeitos de vidro/glassmorphism).

---

## 2. Funcionalidades Principais

### 🎨 Studio IA (Editor Principal)
- **Máscara de Edição:** Ferramentas de Pincel, Borracha, Zoom e Pan para selecionar a área exata onde as flores serão inseridas.
- **Comando de Voz:** Integração com Web Speech API para ditar prompts ("Coloque rosas vermelhas aqui").
- **Configuração Granular:** Menus sanfona para seleção de Espécies, Cores e Folhagens.
- **Simulação & Realidade:** Integração preparada para Google Gemini Flash (com fallback para modo simulação se sem chave).

### 🧊 Modo Humanização
- Focado em renderização 3D de alta fidelidade e fotorrealismo, ideal para apresentações finais de arquitetura paisagística.

### 💰 Economia de Créditos (Monetização)
- **Modelo:** Pay-per-action (não assinatura obrigatória).
- **Custo:**
  - Edição Padrão: 5 Créditos.
  - Humanização: 10 Créditos.
- **Loja:** Interface para compra de pacotes de créditos.
- **Lógica:** Validação de saldo antes da execução e estorno automático em caso de erro na API.

### 🔐 Soft Registration (Funil de Conversão)
- **Visitante:** Pode testar 1 vez (com marca d'água e sem salvar).
- **Gatilhos:** Ao tentar salvar, baixar ou gerar a 2ª vez, o modal de Login/Cadastro é acionado.
- **Persistência:** Dados salvos via `localStorage` (simulando banco de dados) para manter o estado do usuário entre sessões.

### 🌍 Internacionalização (i18n)
- Suporte completo para **Português (PT)**, **Inglês (EN)** e **Espanhol (ES)**.
- Troca dinâmica de idioma via Perfil.

---

## 3. Estrutura Técnica

### Frontend
- **Framework:** React 19 + Vite.
- **Linguagem:** TypeScript.
- **Estilização:** Tailwind CSS (Mobile-first).
- **Ícones:** Material Symbols Outlined (Google Fonts).

### Gerenciamento de Estado & Dados
- **Persistência Local:** Hook customizado `useLocalStorage` para salvar projetos, usuário, créditos e configurações sem necessidade de Backend inicial.
- **Context API:** `LanguageContext` para gerenciar traduções globais.

### Integrações
- **IA:** Google Gemini API (`@google/genai`) para visão computacional e geração de imagem.
- **Voz:** Browser Native Speech Recognition.

---

## 4. Fluxo do Usuário (User Journey)

1.  **Landing Page:** Apresentação visual com slider Antes/Depois.
2.  **Dashboard:** Hub central com acesso rápido a ferramentas, saldo e galeria.
3.  **Upload:** Envio de foto do ambiente.
4.  **Edição (Studio):** O usuário pinta a área, fala o comando e gera.
5.  **Resultado:** Comparação do design gerado.
    - *Se Visitante:* Vê com marca d'água -> Tenta salvar -> Login.
    - *Se Logado:* Salva na Galeria, Baixa ou Refina.
6.  **Galeria:** Histórico de projetos salvos.

---

## 5. Próximos Passos Sugeridos
1.  **Backend Real:** Migrar do `localStorage` para Supabase ou Firebase para persistência real de dados na nuvem.
2.  **Gateway de Pagamento:** Integrar Stripe ou Mercado Pago na tela de Loja.
3.  **Exportação PDF:** Gerar orçamentos com a imagem criada.

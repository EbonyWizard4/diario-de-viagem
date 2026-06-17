<div align="center">
  
# 🗺️ Diário de Viagem

**Plataforma Gamificada de Turismo Autêntico**

[![Acesse o App](https://img.shields.io/badge/Acesse%20o%20Web%20App-Clique%20Aqui-0e75b6?style=for-the-badge&logo=vercel)](https://diario-de-viagem.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repositório-black?style=for-the-badge&logo=github)](https://github.com/EbonyWizard4/diario-de-viagem)
[![Licença MIT](https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge)](./LICENSE)

<a href="https://diario-de-viagem.vercel.app" target="_blank">
  <img src="public/logo512.png" alt="Logo do aplicativo Diário de Viagem" width="20%" style="border-radius: 15px; max-width: 40px; margin: 20px 0;">
</a>

### *Explore a cidade pelos olhos de quem vive nela.*

**Um Projeto de Conclusão de Curso (TCC) que conecta usuários a experiências turísticas, gastronômicas e culturais autênticas.**

</div>

___
  
## 📖 Sobre o Projeto

O **Diário de Viagem** é uma aplicação web gamificada que revoluciona a forma como exploramos cidades. Ao invés de roteiros genéricos, conectamos usuários com **rotas autênticas** recomendadas por moradores locais.

### 🎯 Problema Resolvido
Turistas frequentemente se veem presos a roteiros genéricos e caros, perdendo a oportunidade de experimentar a verdadeira essência de uma cidade. O Diário de Viagem democratiza o acesso a experiências reais e autênticas.

### ✨ Solução
- 🗺️ **Rotas Autênticas** — Criadas por quem realmente conhece a cidade
- 🎮 **Gamificação** — Sistema de XP e progressão mantém usuários engajados
- 📍 **Geolocalização** — Check-ins reais com cálculo de proximidade
- 🏆 **Progressão** — Conquiste badges e desbloqueie novas experiências

</div>

---



---

## 🎮 Principais Características

### 🔒 **Segurança Enterprise-Grade**
- Firestore Security Rules blindadas
- Autenticação Firebase obrigatória
- Históricos de check-ins protegidos
- Criptografia de dados sensíveis

### 🎯 **Gamificação Ativa**
- **XP System** — Ganhe pontos completando rotas
- **Cálculo Dinâmico de Proximidade** — Validação matemática de geolocalização
- **Progress Bars em Tempo Real** — Visualize seu avanço instantaneamente
- **Sistema de Badges** — Desbloqueie conquistas exclusivas

### ⚡ **Performance Otimizada**
- Carregamento ultra-rápido
- Animações fluidas e responsivas
- Offline-first capabilities
- Next.js App Router com SSR

### 📱 **UX/UI Premium**
- Interface intuitiva e moderna
- Animações elegantes com Framer Motion
- Design responsivo (mobile-first)
- Acessibilidade em foco

---

## 🛠️ Arquitetura Técnica

### Stack Tecnológico

```
┌─────────────────────────────────────┐
│         FRONTEND LAYER              │
├─────────────────────────────────────┤
│ Next.js 14 (App Router)             │
│ TypeScript • Tailwind CSS           │
│ Framer Motion • Lucide React        │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│       API & BUSINESS LOGIC          │
├─────────────────────────────────────|
│ Next.js API Routes                  │
│ Geolocation Services                │
│ Gamification Engine                 │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│      BACKEND & INFRAESTRUTURA       │
├─────────────────────────────────────┤
│ Firebase (Firestore)                │
│ Firebase Authentication             │
│ Firebase Hosting                    │
│ Firestore Security Rules            │
└─────────────────────────────────────┘
```

### Dependências Principais

| Área | Tecnologia | Propósito |
|------|-----------|----------|
| **Frontend** | Next.js 14 | Framework React moderno com App Router |
| **Linguagem** | TypeScript | Tipagem estática e segurança |
| **Estilização** | Tailwind CSS | Utility-first CSS framework |
| **Animações** | Framer Motion | Animações de alta performance |
| **Ícones** | Lucide React | Biblioteca de ícones SVG |
| **Backend** | Firebase | BaaS com Firestore + Auth |
| **Database** | Firestore | NoSQL escalável e tempo real |
| **Autenticação** | Firebase Auth | Gerenciamento de sessões seguro |

---

## ⚙️ Diferenciais Técnicos Implementados

### 🔐 **Segurança de Dados e Arquitetura Firestore**

O banco de dados foi blindado utilizando **Firestore Security Rules**:
- ✅ Acesso a dados de usuários exige autenticação obrigatória
- ✅ Históricos de check-ins protegidos por regras granulares
- ✅ Isolamento de dados por usuário
- ✅ Validação de requisições na camada de backend

```typescript
// Exemplo de Firestore Security Rules
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
  allow read: if false; // Default deny
}
```

### 🎮 **Sistema de Gamificação Ativa**

Implementação de regras de negócio para máximo engajamento:

**Cálculo Dinâmico de Proximidade**
- Usa fórmulas de haversine para distância geográfica
- Validação em tempo real da localização do usuário
- Tolerância configurável de metros

**Acúmulo de XP**
- 50 XP por check-in validado
- 100 XP extras ao completar uma rota inteira
- Sistema de multiplicadores para streaks
- Barra de progresso atualizada em tempo real

**Progressão por Níveis**
```
Nível 1: 0 - 500 XP (Explorador)
Nível 2: 501 - 1500 XP (Aventureiro)
Nível 3: 1501 - 3000 XP (Viajante)
Nível 4: 3001 - 5000 XP (Guia Local)
Nível 5: 5000+ XP (Embaixador)
```

### ⚡ **Performance & Otimizações**

- **Code Splitting** — Lazy loading de componentes
- **Image Optimization** — Next.js Image com WebP
- **Caching** — Strategy de cache inteligente
- **SSR/SSG** — Server-side rendering onde apropriado
- **Bundle Optimization** — Minificação e tree-shaking

---

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Conta Firebase (gratuita)
- Navegador moderno

### Instalação Local

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/EbonyWizard4/diario-de-viagem.git
   cd diario-de-viagem
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente** — Crie `.env.local` na raiz:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_bucket.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Abra no navegador:**
   ```
   http://localhost:3000
   ```

### Deploy para Produção

O projeto está configurado para deploy automático no Vercel:

```bash
npm run build
npm run start
```

Ou conecte ao Vercel para CI/CD automático: [Vercel Docs](https://vercel.com/docs)

---

## 📊 Composição do Projeto

```
Next.js .............. 75.0% (Dependências de backend/ciência de dados)
TypeScript ........... 15.0% (Frontend e tipos)
Outros ................ 0.1%
```

---

## 🔄 Fluxo de Uso

```
┌──────────────┐
│  Usuário     │
│  Autenticado │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Seleciona uma Rota   │
│ Turística            │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Ativa Geolocalização │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Visita Pontos de     │
│ Interesse (POIs)     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Check-in Real com    │
│ Validação            │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ +XP + Progresso      │
│ em Tempo Real        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Completa Rota →      │
│ Desbloqueio Badge    │
└──────────────────────┘
```

---

## 📚 Documentação Completa

- 📖 [Guia de Instalação](./docs/INSTALLATION.md)
- 🔐 [Documentação de Segurança](./docs/SECURITY.md)
- 🎮 [Sistema de Gamificação](./docs/GAMIFICATION.md)
- 🗺️ [API de Rotas](./docs/API.md)
- 🧪 [Guia de Testes](./docs/TESTING.md)

---

## 🤝 Contribuindo

Adoramos receber contribuições! Siga os passos:

1. **Faça um Fork** do repositório
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit suas mudanças** (`git commit -m 'Add some AmazingFeature'`)
4. **Push para a branch** (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

Leia [CONTRIBUTING.md](./CONTRIBUTING.md) para detalhes.

---

## 🐛 Reportar Problemas

Encontrou um bug? [Abra uma issue](https://github.com/EbonyWizard4/diario-de-viagem/issues/new) com:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs. real
- Screenshots/logs quando possível

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja [LICENSE](./LICENSE) para detalhes completos.

---

## 🙏 Agradecimentos

<div align="center">

Este projeto foi desenvolvido como **Trabalho de Conclusão de Curso** na **UNIVESP**.

Obrigado a todos que contribuíram, testaram e ofereceram feedback!

### 💝 Apoie este Projeto

Gostou? Considere apoiar:

<div align="center">
    <img src="public/images/MPagoRe.png" alt="Pix" width="30%" style="border-radius: 15px; max-width: 700px;">
     <sub>ㅤ</sub>
    <img src="public/images/QRCode_Linkedin.png" alt="Pix" width="30%" style="border-radius: 15px; max-width: 700px;">
</div>

</div>

---
### 📊 Insights do Projeto

- 🎓 **Tipo:** Trabalho de Conclusão de Curso (TCC)
- 👨‍💻 **Desenvolvedor:** [Jhone Antonio](https://github.com/EbonyWizard4)
- 🔗 **LinkedIn:** [antoniojhone](https://www.linkedin.com/in/antoniojhone)
- 🌐 **Portfólio:** [ebw.vercel.app](https://ebw.vercel.app)

---

<div align="center">

**Explore. Descubra. Compartilhe. 🗺️✨**

[![Stars](https://img.shields.io/github/stars/EbonyWizard4/diario-de-viagem?style=social)](https://github.com/EbonyWizard4/diario-de-viagem)
[![Watchers](https://img.shields.io/github/watchers/EbonyWizard4/diario-de-viagem?style=social)](https://github.com/EbonyWizard4/diario-de-viagem)

</div>
```

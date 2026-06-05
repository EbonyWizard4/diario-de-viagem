<div align="center">

# 🗺️ Meu Guia - Desafios e Turismo

[![Acesse o App](https://img.shields.io/badge/Acesse%20o%20Web%20App-Clique%20Aqui-orange?style=for-the-badge&logo=vercel)](Sua_URL_De_Deploy_Aqui)

<a href="Sua_URL_De_Deploy_Aqui" target="_blank">
  <img src="public/logo512.png" alt="Logo do aplicativo" width="60%" style="border-radius: 15px; max-width: 700px;">
</a>

<br />

### *Explore a cidade pelos olhos de quem vive nela.*

---

</div>

## 🚀 Sobre o Projeto

O **Roteiro** é uma aplicação web gamificada desenvolvida como Projeto de Conclusão de Curso (TCC). O objetivo é conectar usuários a rotas turísticas, gastronômicas e culturais autênticas, criadas por moradores locais. O projeto utiliza geolocalização dinâmica, cálculo de distância em tempo real e um sistema de engajamento baseado em recompensas e conquistas.

---

## 🛠️ Tecnologias e Arquitetura

O ecossistema do projeto foi planejado para garantir alta performance, segurança de dados e uma experiência fluida:

- **Frontend:** [Next.js](https://nextjs.org/) (App Router) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) (Animações de Interface)
- **Backend & Banco de Dados:** [Firebase](https://firebase.google.com/) (Firestore Database)
- **Autenticação:** Firebase Auth (Sessões seguras de usuários)
- **Ícones:** [Lucide React](https://lucide.dev/)

---

## ⚙️ Diferenciais Técnicos Implementados

### 🔒 Segurança de Dados e Arquitetura Firestore
O banco de dados foi blindado utilizando **Firestore Security Rules**. O acesso a dados sensíveis de usuários e históricos de check-ins exige autenticação obrigatória via SDK. Rotas estruturais e informações gerais de geolocalização foram mapeadas em coleções públicas otimizadas, permitindo que usuários anônimos visualizem o mapa de exploração sem expor dados privados ou gerar loops de requisições.

### 🎮 Sistema de Gamificação Ativa
Implementação de regras de negócio para engajamento do usuário através de progressão:
- **Cálculo Dinâmico de Proximidade:** Uso de fórmulas matemáticas para determinar a distância entre a localização passiva do usuário e o início do roteiro.
- **Acúmulo de XP:** Conclusão de paradas reais com atualização em tempo real de barras de progresso (`ProgressBar`).

---

## 🗺️ Como Executar o Projeto Localmente

Se quiser rodar o ambiente de desenvolvimento em sua máquina:

1. Clone o [repositório](https://github.com/EbonyWizard4/diario-de-viagem.git):
   ```bash
   git clone https://github.com/EbonyWizard4/diario-de-viagem.git
   ```
2. Instale as dependências:
    ```bash
    npm install
    ```
3. Configure as variáveis de ambiente do Firebase criando um arquivo `.env.local` na raiz do projeto:
    ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
    ```
4. Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    Abra [localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

---
## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---
## Contribua | Divulge este projeto.

<div align="center">
    <img src="public/images/MPagoRe.png" alt="Pix" width="30%" style="border-radius: 15px; max-width: 700px;">
     <sub>ㅤ</sub>
    <img src="public/images/QRCode_Linkedin.png" alt="Pix" width="30%" style="border-radius: 15px; max-width: 700px;">
</div>

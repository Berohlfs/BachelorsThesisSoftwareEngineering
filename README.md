[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=16512225&assignment_repo_type=AssignmentRepo)

# Bem-vindo ao repositório do Projeto Tuscan!

Um sistema com o objetivo de simplificar e agilizar o processo de venda de comidas e bebidas em eventos, como shows, exposições e festivais, eliminando a necessidade de pontos de venda físicos por meio de cardápios digitais com fluxo de checkout. Quando um pedido é finalizado, o sistema retorna ao consumidor códigos QR (fichas digitais) referentes aos itens adquiridos, permitindo que ele os troque posteriormente pelos produtos durante o evento. As fichas são validadas pelo funcionário do evento, por meio de um aplicativo mobile que inclui uma ferramenta de escaneamento.

O processo de venda proposto moderniza a experiência tanto dos consumidores quanto dos organizadores. O uso de novas tecnologias e a gestão de estoque em tempo real contribuem para uma solução inovadora e de fácil adoção.

## Participantes

| Alunos integrantes | Professores responsáveis |
| --- | --- |
| Bernardo Cruz Rohlfs | João Paulo Aramuni (orientador) |
| Eric Guimarães Caldas Jardim | Aline Norberta de Brito |
| ... | Cleiton Silva Tavares |
| ... | Leonardo Vilela Cardoso |

## 📅 Gerenciamento do Projeto

O planejamento e o acompanhamento das tarefas do projeto foram realizados utilizando a metodologia Kanban, implementada na aba Projects deste repositório. Essa abordagem permitiu uma visualização clara do progresso, priorização de tarefas e organização das entregas ao longo do desenvolvimento.

[Acessar Projects do Repositório](https://github.com/orgs/ICEI-PUC-Minas-PPLES-TI/projects/620)

## 🌐 Deploy da Aplicação Web

A aplicação web foi implantada na plataforma Vercel, que oferece uma infraestrutura serverless otimizada para aplicações desenvolvidas com Next.js. Essa escolha permitiu um processo de deploy contínuo, com integração automática ao repositório GitHub. O acesso à versão em produção pode ser feito por meio do link abaixo:

[Acessar Tuscan Web!](https://tuscan.bernardorohlfs.com)

## Instalação do Aplicativo Mobile

📦 Temos APKs prontos para você testar! 

[Ver builds Android](./Divulgacao/Builds/Android)

[Ou baixe o APK pelo navegador](https://expo.dev/accounts/berohlfs/projects/my-mobile/builds/836cf722-a18e-457b-909c-cb12152683a5)

# 📌 Guia de Instalação e Execução - Ambiente Dev

Este guia fornecerá todas as instruções necessárias para configurar e executar os dois projetos do **Tuscan**:  
- 🌐 **Web (Next.js)** – Gerenciamento do evento e vendas.  
- 📱 **Mobile (React Native com Expo)** – Validação de QR Codes pelos funcionários do bar.  

[Acessar pastas do código fonte](./Codigo/README.md)

---

## 🗉 Pré-requisitos  

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas:  

- [Node.js](https://nodejs.org/) (Versão recomendada: **LTS**)  
- [Visual Studio Code](https://code.visualstudio.com/)  
- [Git](https://git-scm.com/downloads)  
- **Para o Mobile:** [Expo Go](https://expo.dev/client) (disponível na Play Store e App Store)  

---

## 🔧 Configuração do Ambiente  

### 1️⃣ Instalar Node.js e npm  

Caso ainda não tenha o **Node.js** instalado, baixe e instale a versão **LTS** a partir do site oficial:  
- [Download Node.js](https://nodejs.org/)  

Após a instalação, verifique se o **Node.js** e o **npm** estão disponíveis:  

```sh
node -v  # Exibe a versão do Node.js
npm -v   # Exibe a versão do npm
```

---

### 2️⃣ Clonar o Repositório  

Execute o comando abaixo para clonar este repositório:  

```sh
git clone https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2024-2-tcci-0393100-dev-bernardo-rohlfs-e-eric-jardim.git
cd plf-es-2024-2-tcci-0393100-dev-bernardo-rohlfs-e-eric-jardim
```

---

## 🎥 Configuração do Projeto Web (Next.js)  

📂 **Caminho do projeto:** `./Codigo/my-app`  

### 3️⃣ Instalar Dependências  

Dentro da pasta do projeto web, instale as dependências necessárias:  

```sh
cd Codigo/my-app
npm install
```

### 🚀 Rodar o Projeto Web  

Para iniciar o ambiente de desenvolvimento do **Next.js**, utilize:  

```sh
npm run dev
```

Após a execução, o projeto estará disponível em **http://localhost:3000**.  

### 🐳 Alternativa: Rodar com Docker e Dev Containers

Se preferir evitar instalar o Node.js e dependências diretamente na sua máquina, você pode utilizar o ambiente Dockerizado com suporte a **Dev Containers** no VS Code.

#### ✅ Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop)
- [Visual Studio Code](https://code.visualstudio.com/)
- Extensão [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) instalada no VS Code

#### ▶️ Passos para rodar com Docker

1. No terminal, dentro da raiz do projeto, execute os seguintes comandos:

```sh
docker-compose build
docker-compose up
```
2. Abra o Visual Studio Code na pasta do projeto (raiz que contém .devcontainer).

3. O VS Code deve sugerir automaticamente a opção:
> "Reabrir no Dev Container"

---

## 📱 Configuração do Aplicativo Mobile (Expo)  

📂 **Caminho do projeto:** `./Codigo/my-mobile-app`  

### 3️⃣ Instalar Dependências do Mobile  

Dentro da pasta do projeto mobile, instale as dependências necessárias:  

```sh
cd Codigo/my-mobile-app
npm install
```

### 📲 Baixar Expo Go  

Para rodar o app no seu celular, baixe o **Expo Go**:  
- **Android:** [Baixar na Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)  
- **iOS:** [Baixar na App Store](https://apps.apple.com/app/expo-go/id982107779)  

### 🚀 Rodar o Aplicativo Mobile  

Após instalar o **Expo Go**, inicie o projeto mobile com:  

```sh
npm run start
```

Isso abrirá o **Metro Bundler**. Agora:  
1. No **Android**, escaneie o QR Code usando o **Expo Go**.  
2. No **iOS**, abra o Expo Go e insira a URL gerada pelo Metro Bundler.  

---

## 🛠 Extensões Recomendadas para VS Code  

Para melhor experiência durante o desenvolvimento, recomendamos instalar as seguintes extensões no VS Code:  

- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)  
- [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight)  
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)  
- [Tailwind Docs](https://marketplace.visualstudio.com/items?itemName=austenc.tailwind-docs)  
- [Tailwind Fold](https://marketplace.visualstudio.com/items?itemName=LukasPascal.vscode-tailwind-fold)  

---

## 🔨 Build e Verificação de Código  

### Gerar Build para Produção (Web)  

Para compilar o projeto web e gerar uma versão otimizada para produção, execute:  

```sh
npm run build
```

Isso realizará a verificação de **TypeScript** e **ESLint** antes da construção 💎.

### Gerar Build do Mobile  

Se precisar gerar um APK/IPA para distribuição, utilize o Expo EAS:  

```sh
npx expo install -g eas-cli
eas build --platform android
```

(O comando pode variar dependendo da plataforma e configurações do Expo.)

---

## 🎯 Resumo  

📌 **Projeto Web (Next.js):**  
- `cd Codigo/my-app && npm install`  
- `npm run dev` → **http://localhost:3000**  

📌 **Aplicativo Mobile (React Native com Expo):**  
- `cd Codigo/my-mobile-app && npm install`  
- **Baixe o Expo Go** e **rode `npm run start`**  
- Escaneie o QR Code no Expo Go.  

Agora tudo está pronto! 🚀  

# 🎥 Demos

## 📱 Aplicativo Mobile (React Native com Expo)

Veja abaixo o GIF que demonstra o funcionamento do protótipo do aplicativo mobile, especificamente a funcionalidade de leitura de um código QR usando a câmera do dispositivo, por meio do SDK do Expo.

<img src="./Divulgacao/Video/gif-mobile-final.gif" height="350">

## 🌐 Projeto Web (Next.js)

A seguir, alguns prints das telas da interface web do projeto, desenvolvida com Next.js. Eles ilustram as principais funcionalidades e o design da aplicação.

## Telas comuns

#### Home

<img src="./Divulgacao/Video/prints/home.png" width="800">

### Telas do Organizador

#### Login / Cadastro

<img src="./Divulgacao/Video/prints/login-register-organizador.png" width="800">

#### Dashboard

<img src="./Divulgacao/Video/prints/dashboard.png" width="800">
<img src="./Divulgacao/Video/prints/dashboard-2.png" width="800">

#### Eventos

<img src="./Divulgacao/Video/prints/meus-eventos.png" width="800">
<img src="./Divulgacao/Video/prints/meus-eventos-single.png" width="800">
<img src="./Divulgacao/Video/prints/download-qr-code.png" width="800">

#### Produtos

<img src="./Divulgacao/Video/prints/meus-produtos.png" width="800">
<img src="./Divulgacao/Video/prints/meus-produtos-single.png" width="800">

#### Perfil

<img src="./Divulgacao/Video/prints/meu-perfil-admin.png" width="800">

### Telas do Consumidor

#### Cadastro rápido / redirecionamento para cardápio

<img src="./Divulgacao/Video/prints/quick-login.png" width="800">

#### Cardápio do Evento

<img src="./Divulgacao/Video/prints/cardapio.png" width="800">

#### Checkout

<img src="./Divulgacao/Video/prints/checkout.png" width="800">

#### Pagamento

<img src="./Divulgacao/Video/prints/stripe-redirect.png" width="800">

#### Confirmação de compra

<img src="./Divulgacao/Video/prints/confirmacao-compra.png" width="800">

#### Histórico de compras do consumidor

<img src="./Divulgacao/Video/prints/historico-de-compras.png" width="800">


# 🧪 Testes Automatizados da Aplicação WebApp (Next.js)

Este projeto utiliza dois frameworks de testes para garantir qualidade e estabilidade da aplicação:

* Jest para testes unitários de lógica de negócio.
* Playwright para testes E2E (End-to-End), cobrindo os principais fluxos de usuário.

## ✅ Testes Unitários com Jest

Jest é utilizado para validar funções puras e lógicas da aplicação — especialmente as funções do carrinho de compras, como:

* addItem – Adiciona um item ao carrinho.
* updateQuantity – Atualiza a quantidade de um item.
* removeItem – Remove um item do carrinho.
* clearCart – Limpa todos os itens.
* Outros...

### Scripts

```
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

### Estrutura

* Os testes ficam na pasta: ./tests
* Os arquivos seguem o padrão: *.test.ts

### Exemplo de Execução

<img src="./Divulgacao/Video/jest-gif.gif" height="600">

## 🧭 Testes E2E com Playwright

Playwright é utilizado para simular o comportamento real do usuário e validar o funcionamento da aplicação ponta-a-ponta.

### Fluxos cobertos:

* Login de usuários.
* Cadastro de eventos.
* Cadastro de produtos.
* Listagem e visualização de eventos e produtos.
* Outros...

### Scripts

```
"test:e2e": "playwright test",
"test:e2e:headed": "playwright test --project=chromium --headed",
"test:e2e:debug": "playwright test --debug",
"test:e2e:ui": "playwright show-report"
```

### Estrutura

* Os testes estão localizados em: ./e2e
* Arquivos seguem o padrão: *.spec.ts

### Exemplo de Execução

<img src="./Divulgacao/Video/playwright-gif.gif" height="600">

---

Caso tenha dúvidas ou problemas, sinta-se à vontade para abrir uma issue no repositório! 🚀
# FIAP Tech Challenge - Fase 4

Projeto desenvolvido para as fases do tech challenge web da FIAP.

## Resumo

Trata-se de uma plataforma fictícia para a empresa financeira "Bytebank".
O protótipo das telas desenvolvidas pode ser encontrado no [Figma](https://www.figma.com/design/ns5TC3X5Xr8V7I3LYKg9KA/Projeto-Financeiro?node-id=503-4264&t=nhWQMyJ7ZmXNWbb6-1).

O link para acesso a aplicação em prod é [https://production.d2d9243zykuhuo.amplifyapp.com/](https://production.d2d9243zykuhuo.amplifyapp.com/).
A aplicação em prod está seguindo a tag/versão 2.0, então as implementações da versão 4.0 não estão presentes.

## Seções

- [Resumo](#resumo)
- [Seções](#seções)
- [Arquitetura do projeto](#arquitetura-do-projeto)
  - [Arquitetura Limpa do Dashboard App](#arquitetura-limpa-do-dashboard-app-packagesdashboard-app)
    - [Exemplo de Fluxo de Dados e Injeção de Dependência](#exemplo-de-fluxo-de-dados-e-injeção-de-dependência)
    - [Demonstração visual das camadas e dependências](#demonstração-visual-das-camadas-e-dependências)
  - [Gerenciamento de autenticação no Root App](#gerenciamento-de-autenticação-no-root-app-packagesroot-app)
    - [Middleware de Autenticação](#middleware-de-autenticação)
    - [Armazenamento Seguro de Token](#armazenamento-seguro-de-token)
    - [Integração com Microfrontends](#integração-com-microfrontends)
    - [Responsabilidades do Root App](#responsabilidades-do-root-app)
  - [Implementação de Segurança do Mock Server](#implementação-de-segurança-do-mock-server)
    - [Criptografia e Gerenciamento de Tokens](#criptografia-e-gerenciamento-de-tokens)
    - [Sistema de Rate Limiting](#sistema-de-rate-limiting)
    - [Fluxo de Autenticação](#fluxo-de-autenticação)
    - [Medidas de Segurança Adicionais](#medidas-de-segurança-adicionais)
  - [Styleguide](#styleguide)
- [Rodando o projeto](#rodando-o-projeto)
  - [Ambiente de desenvolvimento local](#ambiente-de-desenvolvimento-local)
  - [Realizando login](#realizando-login)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Conceitos aplicados](#conceitos-aplicados)
- [Outras ferramentas úteis](#outras-ferramentas-úteis)

## Arquitetura do projeto

A arquitetura da quarta fase do projeto levou em consideração as decisões arquiteturais do resultado da primeira e segunda fase, tendo em vista que decidi usar o mesmo projeto e expandir a partir dele.

A arquitetura na primeira fase era focada em uma aplicação Next com diferentes renderizações e separação clara entre UI e dados.

![Primeiro preview de arquitetura](.github/architecture-1.png)

Na segunda fase nós desacoplamos essa arquitetura em 4 aplicações diferentes, além da API de mocks com JSON Server.

![Preview dos módulos](.github/graph.png)

![Preview da segunda arquitetura](.github/architecture-2.png)

Já na quarta fase, mantive os mesmos módulos, mas expandi as responsabilidades de dois dos microfrontends e do mock-server:

- **Dashboard App**: Foi implementada a Clean Architecture para organizar o projeto, garantindo a separação de responsabilidades e a independência das regras de negócio em relação a frameworks e ferramentas externas.

- **Aplicação Root**: Adicionei um sistema de autenticação compartilhada entre os microfrontends, centralizando o controle de acesso. Isso inclui:

  - Middleware para interceptação de rotas e proteção de páginas privadas.
  - Mecanismo de login e logout com gerenciamento centralizado de sessão.
  - Armazenamento seguro de tokens de autenticação em cookies HTTP para prevenir ataques XSS e CSRF.
  - Propagação automática do estado de autenticação para todos os microfrontends, garantindo uma experiência unificada para o usuário.

- **Mock Server**: A API de testes foi expandida para incluir:
  - Geração de tokens JWT com criptografia avançada utilizando AES-256-GCM, garantindo segurança e integridade dos dados.
  - Mecanismos de proteção contra ataques, como rate limiting para prevenir força bruta e validação de tokens para evitar replay attacks.
  - Implementação de um sistema robusto de autenticação e autorização, mesmo em ambiente de desenvolvimento, seguindo práticas modernas de segurança.

Essas melhorias foram realizadas para garantir maior segurança, organização e escalabilidade ao projeto, alinhando-se às melhores práticas de desenvolvimento e arquitetura de software.

### Arquitetura Limpa do Dashboard App (`/packages/dashboard-app/...`)

A aplicação dashboard implementa os princípios da Arquitetura Limpa para manter a separação de responsabilidades e garantir que as regras de negócio sejam independentes de frameworks e ferramentas externas. A implementação é adaptada para a realidade do FE e do Next.js.

Aqui está uma descrição detalhada de cada camada:

#### 1. Camada de Domínio (`/src/domain`)

O núcleo da aplicação contendo regras de negócio e entidades.

- **Entidades**: Objetos centrais de negócio
  - `Account`: Gerencia dados da conta e validação de saldo
    - Implementa validações de negócio como `validateBalance`
    - Encapsula atributos através de getters para proteger o estado
    - Define exceções de domínio como `InsufficientFundsError`
  - `Transaction`: Manipula dados e regras de transações financeiras
    - Define tipos de transação através de `TransactionType` (DEPOSIT, WITHDRAWAL, etc.)
    - Implementa validações de valor e tipo de transação
    - Factory method `create` para construção segura de transações
    - Validação cruzada com Account para verificar saldo em operações de débito
    - Gerencia anexos de comprovantes (fileBase64, fileName)
- **Interfaces de Repository**: Definem contratos para operações de dados
  - `AccountRepository`: Contrato de acesso aos dados da conta
  - `TransactionRepository`: Contrato de acesso aos dados de transações

A camada de domínio é independente de todas as outras camadas e contém lógica de negócio pura, sem dependências externas.

#### 2. Camada de Aplicação (`/src/application`)

Orquestra o fluxo de dados e implementa casos de uso.

- **Use Cases**: Implementam fluxos específicos de negócio
  - `CreateTransactionUseCase`: Manipula a lógica de criação de transações
    - Coordena validações entre Account e Transaction
    - Utiliza injeção de dependência dos repositories
    - Valida tipos de transação e saldo disponível
  - `EditTransactionUseCase`: Gerencia atualizações de transações
    - Valida ID da transação
    - Reaplica regras de negócio na edição
- **Services**: Orquestram use cases e implementam operações específicas, servindo como facade da camada de aplicação para camadas externas.

  - `TransactionService`: Coordena operações de transação
    - Encapsula instanciação e uso dos use cases
    - Expõe interface simplificada para CRUD de transações
    - Gerencia ciclo de vida das transações
  - `AccountService`: Gerencia operações da conta
    - Centraliza acesso a informações da conta

- **Commands**: Definem estruturas de dados de entrada
  - `TransactionCommand`: Estrutura de dados para criar transações
  - `TransactionEditCommand`: Estrutura de dados para editar transações

A camada de aplicação depende apenas da camada de domínio.

#### 3. Camada de Infraestrutura (`/src/infrastructure`)

Implementa interfaces definidas na camada de domínio e manipula comportamentos externos, servindo como a camada para tratar preocupações técnicas.

- **Repositories**: Implementações concretas dos repositories do domínio
  - `HttpAccountRepository`: Implementa operações de conta usando HTTP
  - `HttpTransactionRepository`: Implementa operações de transações usando HTTP
- **Configuration**: Configuração de serviços para utilização
  - `HttpServiceConfiguration`:
    - Implementa padrão Singleton para services
    - Centraliza criação de repositories
    - Gerencia injeção de dependência dos services da camada de aplicação

Para a criação dos repositories a camada de infraestrutura implementa as interfaces definidas pela camada de domínio.

Para a criação da configuração do service HTTP a camada de infraestrutura utiliza os repositórios concretos, junto dos services que são definidos pela camada de aplicação. É importante ressaltar que a camada de infraestrutura não depende de regras de negócio da camada de aplicação, ela apenas utiliza os services para a injeção de dependência, possibilitando acesso externo e servindo como um container.

#### 4. Camada de Apresentação (`/src/presentation`)

Manipula UI e interação do usuário.

- **Components**: Componentes React para UI (Pages)
  - Utilizam apenas componentes da biblioteca de components e tipos/utils da própria camada de apresentação
- **View Models**: Adaptam dados para apresentação na UI utilizando de formatters e mappers
- **Formatters**: Formatam dados para exibição
  - Encapsulam lógica de formatação de moeda, data etc
- **Providers**: Manipulam preocupações específicas do React e injeção de dependência
  - Gerenciam estado global de tema e coisas do tipo
- **Types**: Definem DTOs e outros tipos específicos da apresentação

A camada de apresentação não depende de nenhuma camada interna para funcionar, utilizando seus próprios DTOs, formatadores e etc.

#### 5. Camada Router (Next.js) (`/src/pages/`)

É o entrypoint da aplicação Next e age como uma View, então é como se fosse uma camada intermediária que conecta pontos importantes, mas sem depender de regras de negócio específicas ou entrar em detalhes de implementação.

- **UI**: Importa componentes, constantes e outras entidades necessárias da camada de apresentação para renderizar a tela.
- **Infrastructure**: Utiliza a HTTP services configuration da camada de infraestrutura e utiliza esse singleton para chamar operações CRUD concretras que são solicitadas pela camada de apresentação, esta que por sua vez apenas solicita, sem saber para quem está sendo mandado.

#### Exemplo de Fluxo de Dados e Injeção de Dependência

Um fluxo típico para criar uma transação:

```
UI -> View -> TransactionService -> CreateTransactionUseCase ->
  1. Valida regras com Account
  2. Cria Transaction
  3. Persiste via Repository
  4. Retorna resultado através das camadas
```

A injeção de dependência é gerenciada através do `HttpServiceConfiguration`:

1. Cria repositories concretos (HTTP)
2. Injeta repositories nos services
3. Disponibiliza services

Esta arquitetura garante:

- Regras de negócio isoladas na camada de domínio
- Dependências apontam para dentro (camadas externas dependem das internas)
- Preocupações externas são separadas da lógica de negócio
- Cada camada pode evoluir independentemente
- Alta testabilidade devido à clara separação de responsabilidades
- Reutilização de código através de abstrações bem definidas

#### Demonstração visual das camadas e dependências

Demonstração visual que representa qual camada tem conhecimento de outra camada ou algum tipo de dependência. Não representa o fluxo de dados abordado anteriormente.

![Clean Arch Dependency Preview](.github/dashboard-clean-arch.jpg)

### Gerenciamento de autenticação no Root App (`/packages/root-app/...`)

O Root App atua como um shell que encapsula todas as outras aplicações (microfrontends), sendo responsável pelo controle de acesso e roteamento centralizado. É o root-app que renderiza a navbar que é compartilhada entre todos os microfrontends, e é ela que realiza login e logout.

Aqui está uma explicação detalhada de como funciona:

#### Middleware de Autenticação

1. **Interceptação de Rotas**:

   - Todas as requisições passam pelo middleware em `src/middleware.ts`
   - Verifica a presença do token JWT nos cookies
   - Redireciona para login quando necessário

2. **Proteção de Rotas**:

   - Rotas públicas (`/`, `/login`) são acessíveis sem autenticação
   - Rotas privadas (`/dashboard/*`) requerem autenticação
   - Redirecionamento automático baseado no estado de autenticação (usuário já autenticado é jogado para fora de `/login`)

3. **Gestão de Estado de Autenticação**:
   - Context API do React para compartilhar estado de auth
   - Hook personalizado `useAuth` para acesso ao contexto
   - Atualização em tempo real do estado de autenticação

#### Armazenamento Seguro de Token

A implementação atual utiliza um sistema seguro de armazenamento de tokens de autenticação através de cookies HTTP. Aqui está uma explicação detalhada do funcionamento:

1. **Armazenamento em Cookie**: O token é armazenado em um cookie HTTP em vez de localStorage ou sessionStorage, o que oferece maior segurança contra ataques XSS (Cross-Site Scripting).

2. **Configurações de Segurança do Cookie**:

   - `path=/`: Garante que o cookie está disponível em todo o domínio
   - `max-age`: Define a validade do token para 7 dias (em segundos)
   - `SameSite=Strict`: Previne ataques CSRF (Cross-Site Request Forgery) permitindo o envio do cookie apenas em requisições originadas do mesmo site
   - `Secure`: Em ambiente de produção, garante que o cookie só será transmitido através de conexões HTTPS

3. **Verificação de Ambiente**:
   - A flag `Secure` é automaticamente adicionada em ambiente de produção
   - Em desenvolvimento, a flag é omitida para permitir o uso de HTTP local
   - Verificação de `window` para compatibilidade com SSR (Server-Side Rendering)

Esta implementação segue as melhores práticas de segurança web modernas, protegendo contra:

- Ataques XSS
- Ataques CSRF
- Interceptação de dados em trânsito
- Vazamento acidental de tokens

#### Integração com Microfrontends

1. **Compartilhamento de Estado**:

   - Token compartilhado via cookie entre todas as aplicações
   - Estado de autenticação sincronizado através do AuthProvider
   - Propagação automática de logout para todos os microfrontends

2. **Roteamento Federado**:

   - Configuração de Module Federation para roteamento
   - Carregamento dinâmico de microfrontends baseado na rota
   - Fallback para página 404 em rotas inválidas

3. **Fluxo de Autenticação**:

   ```typescript
   // Exemplo simplificado do fluxo
   middleware(request) {
     if (isPublicRoute(request.nextUrl.pathname)) {
       return NextResponse.next()
     }

     const token = request.cookies.get('auth_token')
     if (!token && isProtectedRoute(request.nextUrl.pathname)) {
       return NextResponse.redirect(new URL('/login', request.url))
     }

     return NextResponse.next()
   }
   ```

#### Responsabilidades do Root App

1. **Gestão de Layout**:

   - Header/Navbar global
   - Tema consistente entre aplicações

2. **Controle de Sessão**:

   - Gerenciamento centralizado do token
   - Login e logout globais

3. **Segurança**:
   - Proteção contra acesso não autorizado
   - Armazenamento seguro de token em cookies quando é realizado o login

Este design permite uma experiência unificada e segura, onde o Root App atua como guardião do acesso às diferentes partes do sistema, mantendo o controle de autenticação centralizado enquanto permite que cada microfrontend mantenha sua independência de implementação.

### Implementação de Segurança do Mock Server

#### Visão Geral da Implementação

O servidor mock implementa um sistema robusto de autenticação e autorização, utilizando práticas de segurança modernas mesmo em ambiente de desenvolvimento. Esta implementação serve como um modelo para ambientes de produção.

#### Criptografia e Gerenciamento de Tokens

1. **Algoritmo de Criptografia**:

   - Utiliza AES-256-GCM (Galois/Counter Mode)
   - Oferece autenticação e criptografia simultaneamente
   - Implementado através do módulo nativo `crypto` do Node.js

2. **Processo de Geração de Token**:

   ```typescript
   // Estrutura do payload do token
   {
     id: string; // ID do usuário
     email: string; // Email do usuário
     exp: number; // Timestamp de expiração
     jti: string; // ID único do token para invalidação
     iat: number; // Timestamp de criação
   }
   ```

3. **Componentes do Token**:
   - Salt único por token (16 bytes)
   - IV (Vetor de Inicialização - 16 bytes)
   - Tag de Autenticação
   - Payload criptografado
4. **Processo de Derivação de Chave**:
   - Utiliza PBKDF2 (Password-Based Key Derivation Function 2)
   - 100.000 iterações
   - SHA-512 como função hash
   - Chave de 32 bytes
   - Salt único por operação

#### Sistema de Rate Limiting

1. **Configuração**:

   - Máximo de 5 tentativas de login por IP
   - Período de bloqueio de 15 minutos
   - Limpeza automática de registros expirados

2. **Estrutura de Dados**:

   ```typescript
   Map<
     string,
     {
       count: number; // Número de tentativas
       firstAttempt: number; // Timestamp da primeira tentativa
     }
   >;
   ```

3. **Processo de Verificação**:
   - Rastreamento por IP
   - Reset automático após período de bloqueio
   - Bloqueio preventivo após exceder limite

#### Fluxo de Autenticação

1. **Login**:

   ```
   Cliente → Verificação Rate Limit → Validação Credenciais → Geração Token → Resposta
   ```

2. **Validação de Token**:
   ```
   Request → Extração Bearer Token → Descriptografia → Validação → Autorização
   ```

#### Medidas de Segurança Adicionais

1. **Headers de Segurança**:

   - `Authorization: Bearer <token>`
   - Validação estrita do formato
   - Sem exposição de informações sensíveis em erros

2. **Proteção contra Ataques**:

   - Timing attacks (comparações em tempo constante)
   - Força bruta (rate limiting)
   - Replay attacks (JTI único por token)

3. **Gestão de Erros**:
   - Mensagens genéricas para falhas de autenticação
   - Logging seguro sem exposição de dados sensíveis
   - Tratamento adequado de exceções

#### Configurações do Ambiente

```typescript
const config = {
  tokenExpiration: 3600000, // 1 hora em millisegundos
  maxLoginAttempts: 5, // Tentativas permitidas
  lockoutDuration: 900000, // 15 minutos em millisegundos
  keyIterations: 100000, // Iterações PBKDF2
  keyLength: 32, // Tamanho da chave em bytes
  saltLength: 16, // Tamanho do salt em bytes
};
```

#### Observações para Desenvolvimento

1. **Ambiente Local**:

   - Chave secreta gerada automaticamente no início da aplicação
   - Persistência em memória do rate limiting

2. **Limitações do Ambiente Mock**:
   - Armazenamento em memória (não persistente)
   - Sem suporte a revogação de tokens
   - Sem sincronização entre múltiplas instâncias

### Styleguide

Para o desenvolvimento do projeto nós seguimos o style guide proposto, porém com adaptações para seguir o [Material Design](https://m3.material.io/) e outras práticas que o grupo achou pertinente mudar.

![Style guide preview](.github/styleguide.png)
![Color pallete preview](.github/pallete.png)

## Rodando o projeto

**Requisitos**

1. Tenha certeza que está usando a versão LTS do [Node.js (20.x)](https://nodejs.org/en)

   a. Recomendamos o uso do [nvm](https://github.com/nvm-sh/nvm)

   b. Caso esteja usando o nvm, antes de instalar as deps rode `nvm use` e se necessário `nvm install` e depois `nvm use` novamente.

Para instalar as deps quando já estiver utilizando a versão LTS do Node, rode `npm i` ou `npm install`.

### Ambiente de desenvolvimento local

Esse projeto é um monorepo, na pasta **packages/** estão presentes cada um dos projetos.

Por isso, recomendamos a execução dos scripts através da raíz, seja com `npm run`ou `npx lerna run`, para que seja feita a orquestração de deps e para que tenha um só terminal aberto para rodar tudo.

Os comandos de `npm run` irão seguir o package.json da raíz do projeto, bem como dos package.json dos packages específicos.
Comandos de `npx lerna run`podem rodar qualquer comando do lerna independente do package.json, isto pode ser útil para rodar um comando específico de um só projeto, por exemplo `npx lerna run dev --scope dashboard-app --scope mock-api`, para rodar só o dashboard e a api.

Exemplo:

![Terminal preview](.github/terminal-preview.png)

1. Executar todas as aplicações: `npm run dev`

   a. Acompanhe a execução do Lerna nos diferentes projetos

   b. A api iniciará em [http://localhost:5000](http://localhost:5000)

   c. Os componentes serão buildados (validar se a dist está populada - packages/components/dist)

   d. O root será executado em [http://localhost:9000](http://localhost:9000)

   e. O landing app será executado em [http://localhost:3000](http://localhost:3000)

   f. O dashboard app será executado em [http://localhost:4000](http://localhost:4000)

Importante: As deps dos pacotes estão sendo orquestradas, então as aplicações só serão executadas após o build da biblioteca de componentes, já que todas a consomem.

Para buildar todas as aplicações basta executar `npm run build`.

2. Executar apenas os microfrontends, root e api: `npm run:apps`

   b. A api iniciará em [http://localhost:5000](http://localhost:5000)

   d. O root será executado em [http://localhost:9000](http://localhost:9000)

   e. O landing app será executado em [http://localhost:3000](http://localhost:3000)

   f. O dashboard app será executado em [http://localhost:4000](http://localhost:4000)

Tenha certeza de que os componentes estão buildados em seu ambiente, caso contrário, as apicações que o consomem irão quebrar.

3. Storybook e build da lib em watch mode: `npx lerna run dev:concurrently`

   a. A documentação iniciará em [http://localhost:6006](http://localhost:6006) e a lib estará buildando em watch-mode (ou seja, voce pode fazer alterações e verificar nos projetos que consomem em tempo real, caso estejam rodando)

### Realizando login

Nesta fase o projeto recebeu uma camada de autenticação, então para conseguir testar o app será necessário realizar o login. O login é simples, basta usar as credenciais de acesso presentes no `db.json` do Mock Server e fazer login através do Root-App.

Os valores padrão são:
**email**:`joana@email.com`
**senha**:`123456`

Caso queira essas credenciais podem ser atualizadas.

## Tecnologias utilizadas

- [Next.js](https://nextjs.org/): Meta-framework de [React.js](https://react.dev/) para construção de aplicações completas para produção;
- [Typescript](https://www.typescriptlang.org/): Runtime para JavaScript que possibilita a tipagem estática da linguagem;
- [Material UI](https://mui.com/): Framework de UI para construção de componentes com base nos guidelines do [Material design](https://m3.material.io/) e utilização de Style-In-JS com [Emotion](https://emotion.sh/docs/introduction).
- [Vite](https://vite.dev/): Bundler para construção de aplicações, bibliotecas e outras soluções.
- [Next JS Module Federation](https://www.npmjs.com/package/@module-federation/nextjs-mf): Plugin Next para a construção de microfrontends através de [module federation](https://module-federation.io/).
- [Lerna](https://lerna.js.org/): Tecnologia para gerenciamento de monorepositórios, hoisting das deps e execução de tarefas paralelas e orquestradas através do [Nx](https://nx.dev/).
- [Amplify](https://aws.amazon.com/amplify/): Para deploy de produção da aplicação root.
- [Github Actions](https://github.com/features/actions): Para criar workflows de build/deploy para produção dos microfrontends.
- [S3](https://aws.amazon.com/s3/): Para armazenamento em nuvem dos bundles dos microfrontends.
- [Cloudfront](https://aws.amazon.com/cloudfront/): CDN em nuvem para distribuição dos arquivos de entrada dos microfrontends.
- [Docker](https://www.docker.com/): Para criar containers das aplicações.
- [Docker Compose](https://docs.docker.com/compose/): Para orquestrar a execução dos containers das aplicações.

## Conceitos aplicados

- [Design System](https://www.figma.com/blog/design-systems-101-what-is-a-design-system/): Para construção de componentes reutilizáveis e padrões de tema, cores, espaçamentos e etc;
- [MVC](https://www.geeksforgeeks.org/mvc-design-pattern/): Para separação de responsabilidades dos services e utilização de programação orientada a objetos;
- [Atomic design](https://atomicdesign.bradfrost.com/chapter-2/): Para componentização separada em categorias, possibilitando mais reutilização e semântica;
- [Colocation](https://kentcdodds.com/blog/colocation): Para organização dos diretórios e maior facilidade de trabalho;
- [Microfrontends](https://micro-frontends.org/): Execução de diferentes aplicações independentes em uma só aplicação raíz.
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html): Um padrão arquitetural que promove a separação de responsabilidades em camadas bem definidas, garantindo que as regras de negócio sejam independentes de frameworks, interfaces de usuário e detalhes de infraestrutura. Essa abordagem facilita a manutenção, escalabilidade e testabilidade do sistema.

## Outras ferramentas úteis

- [Material Design Color Pallete](https://m2.material.io/inline-tools/color/): Para gerar a paleta de cores;
- [Adobe Color](https://color.adobe.com/create/color-contrast-analyzer): Para validar contraste;

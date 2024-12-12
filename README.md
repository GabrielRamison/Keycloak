# Serviço de Autenticação com Keycloak

Este projeto implementa um serviço de autenticação utilizando Keycloak como provedor de identidade (IdP), oferecendo funcionalidades de registro, login e gerenciamento de sessão de usuários.

## Características

- Autenticação OpenID Connect com Keycloak
- Suporte a PKCE (Proof Key for Code Exchange)
- Gerenciamento de sessão seguro
- Fluxos de registro e login de usuários
- Interface web básica para demonstração
- Containerização com Docker e Docker Compose

## Pré-requisitos

- Docker e Docker Compose
- Keycloak 26.0.4 ou superior

## Início Rápido

1. Clone o repositório
2. Configure as variáveis de ambiente no `docker-compose.yml`
3. Execute:
```bash
docker-compose up --build
O serviço estará disponível em:

Aplicação: http://localhost:3002
Keycloak: http://localhost:8080

Estrutura do Projeto
Copy├── service-provider/
│   ├── src/
│   │   ├── clients/
│   │   │   └── keycloak-oauth2-client.js    # Cliente Keycloak OAuth2
│   │   ├── config/
│   │   │   └── environment.js               # Configurações de ambiente
│   │   ├── controllers/
│   │   │   ├── homeController.js            # Controlador da página inicial
│   │   │   ├── loginController.js           # Controlador de login
│   │   │   ├── logoutController.js          # Controlador de logout
│   │   │   └── userInfoController.js        # Controlador de informações do usuário
│   │   └── routes/
│   │       └── authRoutes.js                # Rotas de autenticação
│   ├── Dockerfile
│   └── app.js
├── keycloak/
│   └── service-provider.json                # Configuração do realm
└── docker-compose.yml
Configuração do Keycloak

Acesse o console admin do Keycloak (http://localhost:8080)
Login com admin/admin
Verifique se o realm "myrealm" foi importado corretamente
Configure o client "service-provider":

Access Type: confidential
Service Accounts Enabled: ON
Valid Redirect URIs: http://localhost:3002/*
Web Origins: http://localhost:3002



Endpoints

GET /: Página inicial
GET /login: Inicia o fluxo de login
GET /register: Inicia o fluxo de registro
GET /callback: Callback do OAuth2
GET /logout: Realiza o logout
GET /userinfo: Exibe informações do usuário

Desenvolvimento
Rodando com Docker Compose
bashCopy# Iniciar os serviços
docker-compose up --build

# Parar os serviços
docker-compose down

# Limpar volumes e reconstruir
docker-compose down -v
docker-compose up --build
Logs e Debugging
Para ver os logs:
bashCopy# Todos os serviços
docker-compose logs

# Serviço específico
docker-compose logs service-provider
docker-compose logs keycloak
Segurança

PKCE implementado para segurança adicional
Tokens armazenados em cookies HTTP-only
Comunicação segura entre containers
Validação de state para prevenção CSRF
URLs internas e externas separadas para comunicação segura

Variáveis de Ambiente
As principais variáveis configuradas no docker-compose.yml:
yamlCopyKEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_REALM=myrealm
KEYCLOAK_CLIENT_ID=service-provider
KEYCLOAK_CLIENT_SECRET=seu-client-secret
SESSION_SECRET=your-session-secret-key
Contribuindo

Fork o repositório
Crie uma branch para sua feature
Commit suas mudanças
Push para a branch
Abra um Pull Request
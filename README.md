# Serviço de Autenticação com Keycloak

Este projeto implementa um serviço de autenticação utilizando Keycloak como provedor de identidade (IdP), oferecendo funcionalidades de registro, login e gerenciamento de sessão de usuários.

## Características

- Autenticação OpenID Connect com Keycloak
- Suporte a PKCE (Proof Key for Code Exchange)
- Gerenciamento de sessão seguro
- Fluxos de registro e login de usuários
- Interface web básica para demonstração
- Containerização com Docker

## Pré-requisitos

- Node.js 18 ou superior
- Docker e Docker Compose (para ambiente containerizado)
- Instância do Keycloak configurada e em execução
- Variáveis de ambiente configuradas

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_REALM=seu-realm
KEYCLOAK_CLIENT_ID=seu-client-id
KEYCLOAK_CLIENT_SECRET=seu-client-secret
PORT=3002
SESSION_SECRET=sua-session-secret
```

### Configuração do Keycloak

1. Crie um novo realm no Keycloak
2. Configure um novo client com:
   - Client Protocol: openid-connect
   - Access Type: confidential
   - Valid Redirect URIs: http://localhost:3002/callback
   - Web Origins: http://localhost:3002

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm start

# Ou usar Docker
docker build -t keycloak-service-provider .
docker run -p 3002:3002 keycloak-service-provider
```

## Estrutura do Projeto

```
├── src/
│   ├── clients/
│   │   ├── oauth2-client.js          # Interface base OAuth2
│   │   └── keycloak-oauth2-client.js # Implementação Keycloak
│   ├── config/
│   │   ├── environment.js            # Configurações de ambiente
│   │   └── passport.js               # Configuração do Passport.js
│   ├── controllers/
│   │   └── authController.js         # Controlador de autenticação
│   ├── routes/
│   │   └── authRoutes.js            # Rotas de autenticação
│   └── utils/
│       └── pkce.js                   # Utilitários PKCE
├── Dockerfile
└── server.js
```

## Endpoints

- `GET /`: Página inicial
- `GET /login`: Inicia o fluxo de login
- `GET /register`: Inicia o fluxo de registro
- `GET /callback`: Callback do OAuth2
- `GET /logout`: Realiza o logout

## Segurança

O projeto implementa várias medidas de segurança:

- PKCE para prevenir ataques de interceptação de código
- Gerenciamento seguro de sessão com express-session
- Cookies seguros com flags httpOnly e sameSite
- Validação de state para prevenir CSRF
- Configuração de CORS apropriada

## Desenvolvimento

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença [MIT](LICENSE).
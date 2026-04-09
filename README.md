# Gerenciador de Produtos

Aplicacao full stack do teste tecnico com:

- Backend em .NET 9, ASP.NET Core, EF Core, Identity, JWT e SQL Server
- Frontend em React + Vite, TailwindCSS, Zustand, React Query, React Router e Radix UI

## Estrutura

```text
src/
  GerenciadorProduto.API
  GerenciadorProduto.Application
  GerenciadorProduto.Domain
  GerenciadorProduto.Infrastructure

front-end/
```

## Requisitos

- .NET SDK 9.0 ou superior
- Node.js 22
- npm 10 ou superior
- Docker

## Subir o SQL Server com Docker

```bash
docker run \
  --name gerenciador-produto-sqlserver \
  -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=SuaSenhaForte123" \
  -p 1433:1433 \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

## Configuracao do backend

Arquivo principal:

- `src/GerenciadorProduto.API/appsettings.Development.json`

Connection string padrao:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost,1433;Database=gerenciador_produto;User ID=sa;Password=SuaSenhaForte123;Trusted_Connection=False; TrustServerCertificate=True;"
}
```

Configuracao JWT padrao:

```json
"Jwt": {
  "Key": "SuperSecretDevelopmentKey1234567890!",
  "Issuer": "GerenciadorProduto.API",
  "Audience": "GerenciadorProduto.Client",
  "ExpirationInMinutes": 120
}
```

## Rodar o backend

Restaurar pacotes:

```bash
dotnet restore
```

Aplicar o banco:

```bash
dotnet ef database update \
  --project src/GerenciadorProduto.Infrastructure \
  --startup-project src/GerenciadorProduto.API
```

Rodar a API:

```bash
dotnet run --project src/GerenciadorProduto.API
```

URLs:

- API: `http://localhost:5153`
- Swagger: `http://localhost:5153/swagger`

## Seed inicial

Na inicializacao do backend:

- as roles `Manager` e `User` sao garantidas
- as migrations sao aplicadas automaticamente
- usuarios de teste sao criados quando `SeedData:SeedTestUsers` estiver `true`

Credenciais seed:

- Manager: `manager@test.com` / `Teste@123`
- User: `user@test.com` / `User@123`

## Rodar o frontend

Entrar na pasta:

```bash
cd front-end
```

Copiar o arquivo de ambiente:

```bash
cp .env.example .env
```

Instalar dependencias:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

URL:

- Frontend: `http://localhost:5173`

Variavel de ambiente:

```env
VITE_API_URL=http://localhost:5153
```

## Fluxo principal no frontend

- Login
- Cadastro com selecao de perfil
- Dashboard protegido
- CRUD de produtos para `Manager`
- Visualizacao somente leitura para `User`
- Upload de imagem antes do create/update
- Tela de detalhe do produto
- Ordenacao por `createdAt` e `price`

## Endpoints usados pelo frontend

Autenticacao:

- `POST /auth/register`
- `POST /auth/login`
- `PUT /auth/profile`

Produtos:

- `GET /products`
- `GET /products/{id}`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`
- `POST /products/upload`

## Observacoes de uso

- `POST /products`, `PUT /products/{id}` e `DELETE /products/{id}` exigem role `Manager`
- `GET /products` e `GET /products/{id}` exigem autenticacao
- o frontend persiste sessao com Zustand
- o token JWT e enviado automaticamente no header `Authorization`
- imagens sao exibidas usando a URL retornada pela API

## Upload de imagens

Fluxo implementado:

1. selecionar arquivo no formulario do produto
2. frontend envia `POST /products/upload`
3. backend retorna `imagePath`
4. frontend envia esse `imagePath` no `POST /products` ou `PUT /products/{id}`

Formatos aceitos:

- `.jpg`
- `.jpeg`
- `.png`

## Comandos uteis

Gerar nova migration:

```bash
dotnet ef migrations add NomeDaMigration \
  --project src/GerenciadorProduto.Infrastructure \
  --startup-project src/GerenciadorProduto.API \
  --output-dir Persistence/Migrations
```

Build do backend:

```bash
dotnet build
```

Build do frontend:

```bash
cd front-end
npm run build
```

## Validacao realizada

- `dotnet build`
- `npm run build`
- migration inicial com Identity + Products gerada

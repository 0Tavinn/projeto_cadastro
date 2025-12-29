# Cadastro de Pessoas 

Projeto feito com uma API em .NET 8 + EF Core (PostgreSQL) e um front em React/TypeScript (Vite e Tailwind)/ Para salvamento de dados (Docker).

## Arquitetura e Pastas
- **Backend**: pasta `CadastroPessoas.Api` — API , endpoints em `Program.cs`, modelos/DTOs em `Models` e `Dtos`, contexto EF em `Data/AppDbContext.cs`.
- **Frontend**: pasta `cadastro-frontend` — app SPA em `src/App.tsx` com componentes e consumo de API via `src/services.ts`.
- **Infra**: PostgreSQL externo (Docker/local) conforme string de conexão em `CadastroPessoas.Api/appsettings.json`. (Ou seja a partir do momento que roda-lo ira salvar todos os dados, so seu serviço local)

## Partes importantes
- **Persistência**: `AppDbContext` configura entidades, enums, constraints e conversões para Postgres.
- **Endpoints**: `Program.cs` expõe CRUD de pessoas, categorias, transações e totais, usando mapeadores em `Dtos/DtoMapping.cs` para padronizar respostas.
- **Regra de negócio sensível**: pessoas < 18 só podem registrar despesa.
- **Frontend**: `src/App.tsx` gerencia estado e delega UI para componentes (forms, listas, totais). 

## Onde Tive mais dor de cabeça
- **Migração e ajuste de constraints** para Postgres (check constraints via `ToTable`, conversões de enums/decimais e relacionamentos).
- **Mapeamentos DTO** para remover duplicação nas projeções das consultas.
- **CORS e integração front/back** (origem localhost 5173). (A aplicação ira rodar direto no Vite, mais lembre de rodar o back primeiro nisso ira abilitar a porta 5000, mas a que ira mostrar a aplicação completa sera localhost - dedicatoria do front)
- **Refatoração do frontend** para quebrar a página única em componentes menores.(Ai aonde preferi utilizar docker pois senti maior segurança refatorando o conteudo, e tambem por ter alguma afinidade com a tecnologia para criar)

### Requisitos
- .NET 8 
- Node 
- PostgreSQL 
- Docker

### Subir o banco (exemplo Docker) - Pois foi o utilizado por mim.
```
docker run -d --name pg-cadastro -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=cadastro -p 5432:5432 postgres:16
```

### Backend
```bash
cd CadastroPessoas.Api
dotnet run
```

### Frontend
```bash
cd cadastro-frontend
npm install
npm run dev
``` 

## Observar ao rodar
- Executar `npm install` no front e `dotnet restore`/`dotnet run` no back.

## Paginas que fazem diferença
(.sln) Solução do vs, so serve para organizar o projeto.
(.csproj) Define o .Net - SDK, EF Core, etc.

## Considerações
Foi bom ter parado para dar atenção a este projeto, pois consegui ter uma boa base de ajuste para refatorar o codigo da melhor forma e tentar integrar com diversas tecnologias, até achar uma que fizesse sentido e fosse simples de utilizar como ponte para salvar os dados.

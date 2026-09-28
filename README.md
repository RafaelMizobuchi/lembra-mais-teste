# Lembra+

Controle de medicação diária para pacientes crônicos, diabéticos, idosos e
cuidadores — projeto de Engenharia da Computação.

Roteiro completo (stack, divisão da equipe, o que falta): [`docs/roteiro.md`](docs/roteiro.md).

## Estrutura

- [`backend/`](backend) — API em NestJS + Prisma + PostgreSQL
- [`frontend-web/`](frontend-web) — app web (paciente e cuidador), React + Vite + Tailwind
- [`mobile-android/`](mobile-android) — app Android em Java (fora do escopo atual)
- [`docs/`](docs) — roteiro e modelo de dados

## Rodando localmente

### Back-end

```bash
cd backend
cp .env.example .env   # configurar DATABASE_URL (Neon) e JWT_SECRET
npm install
npm run db:migrate     # cria as tabelas a partir de prisma/schema.prisma
npm run db:seed        # (opcional) popula contas de demonstração
npm run start:dev
```

### Front-end web

```bash
cd frontend-web
cp .env.example .env   # aponta pra http://localhost:3000 por padrão
npm install
npm run dev
```

## Contas de demonstração

Criadas por `npm run db:seed`, com 3 medicamentos e 14 dias de histórico:

| Perfil | E-mail | Senha |
|---|---|---|
| Paciente | `maria@lembramais.app` | `demo1234` |
| Cuidador | `joao@lembramais.app` | `demo1234` |

O cuidador já entra vinculado à paciente. Rodar o seed de novo recria só essas
duas contas — nenhuma outra conta do banco é afetada.

## Funcionalidades implementadas

- Cadastro e login (paciente ou cuidador), com JWT e senha em bcrypt
- Vínculo cuidador–paciente por código de convite
- Cadastro de medicamentos (nome, dose, tipo, estoque) e horários
- Agenda do dia com confirmação de dose
- Histórico e taxa de adesão, visível também pelo cuidador vinculado

Falta: notificações push (#6), modo acessível (#11) e testes automatizados.

## Fluxo de contribuição

- Trabalhem sempre em branch + Pull Request pra `main` (não commitem direto
  nela, mesmo sem a proteção automática — ver observação abaixo).
- Nomeie a branch pela pasta que você mexe: `backend/feat-agenda-diaria`,
  `web/fix-validacao-form`.
- Peça revisão de pelo menos 1 colega antes do merge (o `.github/CODEOWNERS`
  já sugere quem).
- Tarefas e progresso ficam nas Issues/Milestones do repositório.

> **Nota:** a proteção de branch (bloquear push direto na `main`) exige
> GitHub Pro em repositório privado de conta pessoal — por ora é um combinado
> do grupo, não uma trava automática do GitHub.

## Deploy

- **Front-end**: [lembra-mais-web.vercel.app](https://lembra-mais-web.vercel.app) — Vercel, deploy automático a cada push na `main` (Root Directory: `frontend-web`).
- **Back-end**: ainda não publicado. O blueprint em [`render.yaml`](render.yaml)
  já está pronto: no Render, **New → Blueprint** → selecionar este repositório →
  preencher `DATABASE_URL` e `JWT_SECRET`. Depois, configurar a URL gerada como
  `VITE_API_URL` no projeto do Vercel.

> Enquanto o back-end não estiver publicado, o site no Vercel abre normalmente,
> mas login e cadastro falham — ele tenta falar com `localhost:3000`.

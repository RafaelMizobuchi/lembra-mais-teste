# Roteiro do projeto — Lembra+

Controle de medicação diária para pacientes crônicos, diabéticos, idosos e
seus cuidadores.

**O web é a prioridade do grupo.** O app Android chegou a ser planejado (para
integrar com a matéria de Desenvolvimento Mobile), mas ficou de fora do escopo
atual — a pasta `mobile-android/` e as issues de mobile seguem no repositório
caso o grupo retome.

## Stack

| Camada | Tecnologia |
|---|---|
| Back-end | NestJS + TypeScript, Prisma, PostgreSQL |
| Front-end web (paciente e cuidador) | React + Vite + TypeScript + Tailwind CSS |
| Autenticação | JWT + bcrypt |
| Banco | PostgreSQL no Neon |
| Deploy | Vercel (frontend-web), Render (backend, via `render.yaml`) |
| CI | GitHub Actions (lint + build a cada Pull Request) |
| App mobile (fora do escopo atual) | Android nativo, Java, Retrofit, Room, FCM |

## Divisão da equipe

Divisão por domínio, não por tela — cada dupla entrega fatias completas.

- **Back-end 1** — autenticação, usuários, pacientes/cuidadores, vínculo
- **Back-end 2** — medicamentos, agenda, histórico de adesão, notificações
- **Front-end 1** — experiência do paciente (agenda, remédios)
- **Front-end 2** — experiência do cuidador (painel, vínculo, histórico)

## O que já está pronto

| Funcionalidade | Onde |
|---|---|
| Cadastro e login (paciente ou cuidador) | `POST /auth/register`, `POST /auth/login` |
| Vínculo cuidador–paciente por código de convite | `POST /patients/link`, `GET /patients` |
| CRUD de medicamentos e horários | `POST/GET /medications`, `POST /medications/:id/schedules` |
| Agenda do dia e confirmação de dose | `GET /adherence/today`, `PATCH /adherence/dose-logs/:id` |
| Histórico e taxa de adesão | `GET /adherence/history`, `GET /adherence/patients/:id/history` |

Todos os endpoints acima são protegidos por JWT e resolvem o paciente a partir
do usuário logado. O histórico por cuidador valida que ele está de fato
vinculado àquele paciente antes de devolver qualquer dado.

## O que falta

- Notificações push no horário da dose (issue #6)
- Modo acessível: fonte grande e alto contraste (issue #11)
- Testes automatizados
- Backend publicado no Render (o front no Vercel já está no ar)

## Modelo de dados (tabelas principais)

`users`, `patients`, `caregivers`, `caregiver_patient`, `medications`,
`schedules`, `dose_logs`.

## Contas de demonstração

Criadas pelo seed (`npm run db:seed` dentro de `backend/`), com 3 medicamentos
e 14 dias de histórico já preenchidos:

| Perfil | E-mail | Senha |
|---|---|---|
| Paciente | `maria@lembramais.app` | `demo1234` |
| Cuidador | `joao@lembramais.app` | `demo1234` |

O cuidador já entra vinculado à paciente, então o painel dele abre com o
histórico dela populado.

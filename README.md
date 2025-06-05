# 💸 Expense Tracker

A modern expense tracking web app built with Next.js and TypeScript. Manage your personal finances, track income & expenses, and stay on budget.

---

## ✨ Features

- 🔐 User Authentication via [Clerk](https://clerk.dev)
- 📊 Create and manage income & expense transactions
- ⚡ Realtime updates using Server Actions (Next.js App Router)
- 📚 PostgreSQL + Prisma ORM
- ✅ Unit testing with Jest
- 🧹 Code linting with ESLint
- 🚀 CI/CD via GitHub Actions + Azure App Service
- 🔐 Environment variable support via `.env.local`

---

## 🛠️ Tech Stack

| Tool            | Description                            |
|-----------------|----------------------------------------|
| [Next.js](https://nextjs.org/)        | React framework for production          |
| [TypeScript](https://www.typescriptlang.org/) | Typed superset of JavaScript          |
| [Clerk](https://clerk.dev)           | Authentication and user management     |
| [Prisma](https://www.prisma.io/)     | Next-generation ORM for PostgreSQL     |
| [PostgreSQL](https://www.postgresql.org/) | Relational database                     |
| [Jest](https://jestjs.io/)           | JavaScript testing framework           |
| [ESLint](https://eslint.org/)        | Linting for consistent code style      |
| [Azure App Service](https://azure.microsoft.com/en-us/products/app-service/) | Cloud hosting                          |
| [GitHub Actions](https://github.com/features/actions) | CI/CD automation                       |

---

## 🚀 Getting Started (Development)

### 1. Clone Repository
```bash
git clone https://github.com/yuzaku/expense-tracker-nextjs.git
```
```bash
cd expense-tracker-nextjs
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environtment Variables
Rename the `.env.example` file to `.env.local` and add the following values:

- `DATABASE_URL`: Your db string from https://neon.tech
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk public frontend API key from https://dashboard.clerk.dev/settings/api-keys
- `CLERK_SECRET_KEY`: Your Clerk secret key from https://dashboard.clerk.dev/settings/api-keys

### 4. Run Database Migrations
```bash
npx prisma generate
```
```bash
npx prisma migrate dev --name init
```

### 5. Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

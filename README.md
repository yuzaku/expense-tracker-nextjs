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

## 🚀 CI/CD Workflow (GitHub Actions + Azure)

This project uses GitHub Actions to automate testing and deployment to Azure App Services. The CI/CD setup is split into two workflows:

### ✅ Lint and Test (ci.yml)

This workflow ensures code quality and correctness every time code is pushed or a pull request is made to the main branch.

#### Trigger:

- ```push``` to ```main ```

- ```pull_request``` to ```main```

#### Steps:

1. Checkout repository

2. Setup Node.js version 20

3. Install dependencies using npm ci

4. Lint with ESLint (npm run lint)

5. Run unit tests using Jest (npm run test with coverage)

### ✅ Build and Deploy to Azure (main_traxpenses.yml)
This workflow is responsible for building the app and deploying it to Azure Web App (traxpenses).

#### Trigger:

- ```push``` to ```main```

- Manual trigger (```workflow_dispatch```)

#### Jobs:

##### 🔧 Build

1. Checkout code

2. Setup Node.js version 20

3. Install, build, and test:
```bash
npm install
npm run build --if-present
npm run test --if-present
```

4. Create deployment package using:
```bash
zip release.zip ./* .next -qr
```

5. Upload artifact for next job

##### 🚀 Deploy

1. Download artifact from build step

2. Unzip deployment package

3. Login to Azure using service principal credentials from GitHub Secrets

4. Deploy to Azure Web App using azure/webapps-deploy@v3

## ⚙️ Environment Variables

Deployment relies on various environment variables (e.g., API keys, Clerk credentials) that must be configured manually in Azure:

- Go to Azure Portal > your App Service > Settings > Environtment Variables

- Add any necessary env vars here

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
|[Docker](https://www.docker.com/) | Container for local database

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

### 3. Setup Docker Container for Database
```bash
docker-compose up -d 
```

### 4. Setup Environtment Variables
Rename the `.env.example` file to `.env.local` and add the following values:

- `DATABASE_URL=postgresql://traxpenses_user:traxpenses_password@localhost:5432/traxpenses`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk public frontend API key from https://dashboard.clerk.dev/settings/api-keys
- `CLERK_SECRET_KEY`: Your Clerk secret key from https://dashboard.clerk.dev/settings/api-keys

### 5. Run Database Migrations
```bash
npx prisma generate
```
```bash
npm run migrate:dev
```

### 5. Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 CI/CD Workflow (GitHub Actions + Azure)

This project uses GitHub Actions to automate testing and deployment to Azure App Services.

### ✅ Build and Deploy to Azure (main_traxpenses.yml)
This workflow is responsible for building the app and deploying it to Azure Web App (traxpenses).

#### Trigger:

- ```push``` to ```main``` and ```dev```

- ```pull_request``` to ```main``` and ```dev```

#### Jobs:

##### 🔧 CI

1. Checkout code

2. Setup Node.js version 20

3. Install dependencies
```bash
npm install
```

4. Run ESLint
```
npm run lint
```

5. Run Tests (Jest)
```
npm run test -- --ci --coverage
```

6. Build Production App (This step only run on branch main)
```
npm run build
```

6. Build Production App (This step only run when push on branch main)
```
npm run build
```

7. Zip artifact for deployment (This step only run when push on branch main)
```bash
zip release.zip ./* .next -qr
```

8. Upload artifact for deployment job (This step only run when push on branch main)

##### 🚀 Deploy

1. Download artifact from build step

2. Unzip artifact for deployment

3. Login to Azure using service principal credentials from GitHub Secrets

4. Deploy to Azure Web App using azure/webapps-deploy@v3

## ⚙️ Environment Variables Production

Deployment relies on various environment variables (e.g., API keys, Clerk credentials) that must be configured manually in Azure:

- Go to Azure Portal > your App Service > Settings > Environtment Variables

- Add any necessary env vars here

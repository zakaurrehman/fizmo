# Database Setup Guide

This guide will help you set up the PostgreSQL database for Fizmo.

## Option 1: Local PostgreSQL (Recommended for Development)

### Step 1: Install PostgreSQL

**Windows:**
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the wizard
3. Remember the password you set for the `postgres` user
4. Default port is 5432

**Mac (using Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create the Database

Open your terminal and run:

```bash
# Connect to PostgreSQL
psql -U postgres

# In the PostgreSQL prompt, create the database:
CREATE DATABASE fizmo_db;

# Exit
\q
```

### Step 3: Update .env File

Update the `DATABASE_URL` in your `.env` file:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fizmo_db"
```

Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.

### Step 4: Run Migrations

```bash
cd fizmo-app
npm run prisma:migrate
```

### Step 5: Seed the Database (Optional)

```bash
npm run prisma:seed
```

---

## Option 2: Neon (Free Serverless PostgreSQL)

### Step 1: Create Neon Account

1. Go to https://neon.tech
2. Sign up for a free account
3. Create a new project

### Step 2: Get Connection String

1. In your Neon dashboard, find the connection string
2. It will look like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/database_name?sslmode=require`

### Step 3: Update .env File

```env
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/fizmo_db?sslmode=require"
```

### Step 4: Run Migrations

```bash
cd fizmo-app
npm run prisma:migrate
```

---

## Option 3: Supabase (Free PostgreSQL with extras)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up and create a new project
3. Wait for database to be provisioned

### Step 2: Get Connection String

1. Go to Project Settings → Database
2. Copy the "Connection string" under "Connection pooling"
3. Replace `[YOUR-PASSWORD]` with your database password

### Step 3: Update .env File

```env
DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Step 4: Run Migrations

```bash
cd fizmo-app
npm run prisma:migrate
```

---

## Verify Connection

Test your database connection:

```bash
npm run prisma:studio
```

This will open Prisma Studio where you can view and edit your database.

---

## Troubleshooting

### Connection Refused

- Make sure PostgreSQL is running
- Check the port (default is 5432)
- Verify username and password

### SSL Error

For Neon/Supabase, make sure your connection string includes `?sslmode=require`

### Migration Failed

1. Check your DATABASE_URL is correct
2. Make sure you have permission to create tables
3. Try: `npm run prisma:reset` (⚠️ This will delete all data)

---

## Next Steps

After database setup:

1. Generate Prisma Client: `npm run prisma:generate`
2. Run migrations: `npm run prisma:migrate`
3. Seed database: `npm run prisma:seed`
4. Start the app: `npm run dev`

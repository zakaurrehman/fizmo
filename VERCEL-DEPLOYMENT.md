# Vercel Deployment Guide - Fizmo Trader

## Common "Internal Server Error" on Login - Troubleshooting

### 1. Check Environment Variables in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables

**Required Variables:**
```bash
# Critical for login
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters

# Database (must be accessible from Vercel)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Node environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 2. Database Connection Issues

**Symptoms:**
- Login works locally but fails on Vercel
- "Internal server error" in production

**Common Causes:**
- Database URL not set in Vercel
- Database not accessible from Vercel's IP ranges
- SSL/TLS connection issues

**Solutions:**

#### Option A: Using Neon Database (Recommended for Vercel)
```bash
# Neon provides serverless Postgres optimized for Vercel
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/database?sslmode=require"
```

#### Option B: Using Supabase
```bash
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require"
```

#### Option C: Using Railway/Render
```bash
DATABASE_URL="postgresql://user:password@containers-us-west-xxx.railway.app:5432/railway?sslmode=require"
```

**Important:** Your database must:
- Accept connections from Vercel's IP ranges
- Support SSL connections (`?sslmode=require`)
- Be publicly accessible or whitelisted for Vercel

### 3. Prisma Client Generation

Ensure Prisma Client is generated during build:

**package.json:**
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### 4. Check Vercel Build Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Check the "Build Logs" tab
4. Look for errors related to:
   - Prisma generation
   - Database connection
   - Environment variables

### 5. Check Runtime Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Go to "Functions" or "Runtime Logs" tab
4. Try to login and watch for error messages

Common errors:
```
Error: JWT_SECRET is not defined
Error: PrismaClient is unable to connect to database
Error: Invalid DATABASE_URL
```

### 6. Middleware Configuration

Make sure middleware doesn't block login endpoints:

**middleware.ts:**
```typescript
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 7. Prisma Connection Pooling for Vercel

Add to your `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 8. Test Database Connection Locally

```bash
# Test if DATABASE_URL works
npx prisma db pull

# Check migrations
npx prisma migrate status

# Deploy migrations to production
npx prisma migrate deploy
```

### 9. Verify JWT_SECRET Length

JWT_SECRET must be at least 32 characters:

```bash
# Generate a strong secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add this to Vercel environment variables.

### 10. Check for Missing Dependencies

Ensure all Prisma packages are in `dependencies` (not `devDependencies`):

```json
{
  "dependencies": {
    "@prisma/client": "^7.2.0",
    "@prisma/adapter-neon": "^7.2.0",
    "prisma": "^7.2.0"
  }
}
```

## Quick Checklist for Deployment

- [ ] DATABASE_URL set in Vercel with `?sslmode=require`
- [ ] JWT_SECRET set (minimum 32 characters)
- [ ] SESSION_SECRET set (minimum 32 characters)
- [ ] NODE_ENV=production
- [ ] Database accepts connections from Vercel
- [ ] Prisma migrations deployed: `npx prisma migrate deploy`
- [ ] Build succeeds in Vercel
- [ ] Check runtime logs after deployment

## Debugging Steps

1. **Enable detailed logging:**
   ```typescript
   // In login route.ts
   console.error("Login error:", error);
   console.error("Error stack:", error?.stack);
   console.error("Error message:", error?.message);
   ```

2. **Check if database is reachable:**
   ```typescript
   // Add to login route temporarily
   await prisma.$queryRaw`SELECT 1`;
   ```

3. **Verify environment variables:**
   ```typescript
   console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
   console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
   ```

## Contact Points

If you're still having issues:

1. Check Vercel logs: https://vercel.com/docs/observability/runtime-logs
2. Check Prisma on Vercel: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
3. Check database provider's Vercel integration docs

## Common Solutions

### "PrismaClient is unable to connect to the query engine"
- Run `npx prisma generate` locally
- Commit the `node_modules/.prisma` folder or ensure `postinstall` runs
- Check DATABASE_URL is accessible

### "JWT_SECRET is not defined"
- Add to Vercel environment variables
- Redeploy after adding (variables don't auto-reload)

### "Failed to fetch" from frontend
- Check CORS settings
- Verify API route is deployed
- Check Vercel function logs


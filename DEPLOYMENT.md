# Deployment Guide - Vercel

## Prerequisites
- GitHub repository: https://github.com/zakaurrehman/fizmo
- Vercel account: https://vercel.com
- Database URL (already have Neon PostgreSQL)

## Step-by-Step Deployment

### 1. Login to Vercel
1. Go to https://vercel.com
2. Click "Login" or "Sign Up"
3. Choose "Continue with GitHub"

### 2. Import Project
1. Click "Add New" → "Project"
2. Select "Import Git Repository"
3. Find and select `zakaurrehman/fizmo`
4. Click "Import"

### 3. Configure Project
**Framework Preset**: Next.js (auto-detected)
**Root Directory**: `./` (leave as default)
**Build Command**: `npm run build` (default)
**Output Directory**: `.next` (default)

### 4. Add Environment Variables
Click "Environment Variables" and add the following:

```env
DATABASE_URL=postgresql://neondb_owner:npg_wnERyo2NzJW9@ep-small-cake-a417h105-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

JWT_SECRET=fizmo-ultra-secure-jwt-secret-key-2024-production

NEXT_PUBLIC_URL=https://your-project-name.vercel.app
```

**Important**: Replace `your-project-name` with your actual Vercel project name after deployment.

### 5. Deploy
1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. You'll get a URL like: `https://fizmo-xxxxx.vercel.app`

### 6. Update Environment Variable
1. After deployment, go to Project Settings
2. Go to "Environment Variables"
3. Update `NEXT_PUBLIC_URL` to your actual Vercel URL
4. Click "Save"
5. Redeploy from "Deployments" tab

### 7. Run Database Migration (If needed)
If you need to push schema changes:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login:
```bash
vercel login
```

3. Link project:
```bash
cd fizmo-app
vercel link
```

4. Pull environment variables:
```bash
vercel env pull
```

5. Generate Prisma client and push schema:
```bash
npx prisma generate
npx prisma db push
```

### 8. Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_URL` environment variable

## Automatic Deployments
- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Instant rollbacks available

## Monitoring
- View logs: Project → Deployments → Click deployment → View Function Logs
- Analytics: Project → Analytics
- Speed Insights: Automatically enabled

## Troubleshooting

### Build Fails
Check build logs for errors. Common issues:
- Missing environment variables
- TypeScript errors
- Missing dependencies

### Database Connection Error
- Verify DATABASE_URL is correct
- Check Neon database is active
- Ensure IP allowlist includes Vercel IPs (usually automatic)

### 404 on Pages
- Clear cache and redeploy
- Check routes are correctly named
- Verify file structure

## Post-Deployment Checklist
- ✅ Code pushed to GitHub
- ✅ Vercel project created
- ✅ Environment variables set
- ✅ Database connection tested
- ✅ All pages loading correctly
- ✅ Authentication working
- ✅ Admin panel accessible
- ✅ Custom domain configured (optional)

## Support
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Your Fizmo platform is now live! 🚀**

URL: https://[your-project].vercel.app

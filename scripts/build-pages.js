const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../app');
const apiPath = path.join(appDir, 'api');
const tempApiPath = path.join(appDir, '_api');

process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'stagetech-secret-key-32chars-github-pages';
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'https://kaminigangawne-29.github.io/StageTech';
process.env.NEXT_PUBLIC_GITHUB_PAGES = 'true';

let moved = false;
try {
  if (fs.existsSync(apiPath)) {
    console.log('Temporarily moving app/api to app/_api for static export...');
    fs.renameSync(apiPath, tempApiPath);
    moved = true;
  }

  console.log('Generating Prisma client and setting up database schema...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit', env: process.env });
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit', env: process.env });
  } catch (e) {
    console.warn('Prisma warning:', e.message);
  }

  console.log('Running Next.js static export build...');
  execSync('npx next build', {
    stdio: 'inherit',
    env: process.env
  });

  const outDir = path.join(__dirname, '../out');
  if (fs.existsSync(outDir)) {
    fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
    console.log('Created .nojekyll in out/');
    if (fs.existsSync(path.join(outDir, 'index.html'))) {
      fs.copyFileSync(path.join(outDir, 'index.html'), path.join(outDir, '404.html'));
      console.log('Created 404.html SPA fallback in out/');
    }
  }

  console.log('Static build completed successfully!');
} catch (error) {
  console.error('Static build failed:', error);
  process.exit(1);
} finally {
  if (moved && fs.existsSync(tempApiPath)) {
    console.log('Restoring app/api from app/_api...');
    fs.renameSync(tempApiPath, apiPath);
  }
}

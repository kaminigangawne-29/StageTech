const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../app');
const apiPath = path.join(appDir, 'api');
const tempApiPath = path.join(appDir, '_api');

let moved = false;
try {
  if (fs.existsSync(apiPath)) {
    console.log('Temporarily moving app/api to app/_api for static export...');
    fs.renameSync(apiPath, tempApiPath);
    moved = true;
  }
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_GITHUB_PAGES: 'true' } });

  console.log('Running Next.js static export build...');
  execSync('npx next build', {
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_GITHUB_PAGES: 'true' }
  });

  const outDir = path.join(__dirname, '../out');
  if (fs.existsSync(outDir)) {
    fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
    console.log('Created .nojekyll in out/');
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

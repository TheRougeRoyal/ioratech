const fs = require('fs');
const path = require('path');

const API_ROOT = path.join(process.cwd(), 'app/api');
const EXCLUDED_PATHS = [
  'api/auth',
  'api/api-keys/validate/route.ts',
  'api/health/route.ts'
];

function isExcluded(filePath) {
  return EXCLUDED_PATHS.some(excluded => filePath.includes(excluded));
}

function findRouteFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findRouteFiles(filePath, fileList);
    } else if (file === 'route.ts' || file === 'route.js') {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function checkAuthCoverage() {
  const routes = findRouteFiles(API_ROOT);
  let failed = false;

  routes.forEach(route => {
    const relativePath = path.relative(process.cwd(), route);
    if (isExcluded(relativePath)) return;

    const content = fs.readFileSync(route, 'utf8');
    if (!content.includes('requireAuth')) {
      console.error(`❌ Missing requireAuth() in: ${relativePath}`);
      failed = true;
    }
  });

  if (failed) {
    process.exit(1);
  } else {
    console.log('✅ All protected API routes have requireAuth()');
    process.exit(0);
  }
}

checkAuthCoverage();

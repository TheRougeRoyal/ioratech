const fs = require('fs');
const path = require('path');

function getFiles(dir, allFiles = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, allFiles);
    } else if (name.endsWith('route.ts')) {
      allFiles.push(name);
    }
  }
  return allFiles;
}

async function audit() {
  const files = getFiles('app/api');
  const publicRoutes = [
    'app/api/auth/',
    'app/api/health/route.ts',
    'app/api/api-keys/validate/route.ts',
  ];

  let failures = 0;

  for (const file of files) {
    if (publicRoutes.some(pub => file.startsWith(pub))) continue;

    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes('requireAuth(')) {
      console.error(`❌ Missing requireAuth in ${file}`);
      failures++;
    } else {
      console.log(`✅ ${file} is protected`);
    }
  }

  if (failures > 0) {
    console.error(`\nTotal failures: ${failures}`);
    process.exit(1);
  } else {
    console.log('\nAll API routes are protected!');
    process.exit(0);
  }
}

audit().catch(err => {
  console.error(err);
  process.exit(1);
});

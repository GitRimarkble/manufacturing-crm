const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, type = 'info') {
  const color = type === 'success' ? colors.green 
              : type === 'warning' ? colors.yellow 
              : type === 'error' ? colors.red 
              : '';
  console.log(color + message + colors.reset);
}

try {
  // Step 1: Install dependencies
  log('\n📦 Installing dependencies...', 'info');
  execSync('npm install --production', { stdio: 'inherit' });
  log('✅ Dependencies installed successfully', 'success');

  // Step 2: Run type checking
  log('\n🔍 Running type checking...', 'info');
  execSync('tsc --noEmit', { stdio: 'inherit' });
  log('✅ Type checking passed', 'success');

  // Step 3: Run Prisma generate
  log('\n🔄 Generating Prisma Client...', 'info');
  execSync('npx prisma generate', { stdio: 'inherit' });
  log('✅ Prisma Client generated', 'success');

  // Step 4: Build the application
  log('\n🏗️  Building the application...', 'info');
  execSync('npm run build', { stdio: 'inherit' });
  log('✅ Build completed successfully', 'success');

  // Step 5: Create deployment package
  log('\n📦 Creating deployment package...', 'info');
  const deployFiles = [
    '.next',
    'public',
    'package.json',
    'package-lock.json',
    'next.config.js',
    'prisma',
    '.env.production',
  ];

  // Create dist directory if it doesn't exist
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  // Copy files to dist
  deployFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const destPath = path.join('dist', file);
      if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true });
      }
      fs.cpSync(file, destPath, { recursive: true });
    }
  });

  log('✅ Deployment package created in /dist directory', 'success');
  
  // Final instructions
  log('\n🚀 Build completed successfully!', 'success');
  log('\nNext steps:', 'info');
  log('1. Update .env.production with your Hostinger database credentials');
  log('2. Upload the contents of the /dist directory to your Hostinger server');
  log('3. Run the following commands on your Hostinger server:', 'info');
  log('   - npm install --production');
  log('   - npx prisma migrate deploy');
  log('   - npm start');

} catch (error) {
  log('\n❌ Build failed:', 'error');
  log(error.message, 'error');
  process.exit(1);
}

const { execSync } = require('child_process');

// Run the build command
execSync('npm run build', { stdio: 'inherit' }); 
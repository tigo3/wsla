
// Simple Node.js script to start the server
require('esbuild').build({
  entryPoints: ['src/server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outfile: 'dist/server.js',
}).then(() => {
  console.log('Server built successfully!');
  require('../dist/server.js');
}).catch(() => process.exit(1));

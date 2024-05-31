const { exec } = require('child_process');
const run = require('npm-run-all');

run([
  'start:json-server',
  'start:vite'
]).then(() => {
  console.log('All processes succeeded');
}).catch((failure) => {
  console.error('One of the processes failed:', failure);
});

// Start json-server
exec('json-server --watch db.json', { stdio: 'inherit', shell: true }, (error, stdout, stderr) => {
  if (error) {
    console.error('Error starting json-server:', error);
    return;
  }
  console.log(stdout);
});

// Start Vite
exec('vite', { stdio: 'inherit', shell: true }, (error, stdout, stderr) => {
  if (error) {
    console.error('Error starting Vite:', error);
    return;
  }
  console.log(stdout);
});

#! /usr/bin/env node

const { spawn } = require('child_process');

const directoryName = process.argv[2];
if (!directoryName || directoryName.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
  return console.log(`
  Invalid directory name.
  Usage: create-dmw-template name-of-project  
`);
}

const remoteURL = 'https://dev.azure.com/dmw-digital/experience-health/_git/emails';

runCliCommand('git', ['clone', remoteURL, directoryName])
  .then(() => {
    return runCliCommand('rm', ['-rf', `${directoryName}/.git`]);
  }).then(() => {
    console.log('Installing dependencies...');
    return runCliCommand('npm', ['install'], {
      cwd: process.cwd() + '/' + directoryName
    });
  }).then(() => {
    console.log('Installed!');
    console.log('');
    console.log('To get started:');
    console.log('cd', directoryName);
    console.log('npm run start');
  });

function runCliCommand(command, args, options = undefined) {
  const spawned = spawn(command, args, options);

  return new Promise((resolve) => {
    spawned.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    spawned.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    spawned.on('close', () => {
      resolve();
    });
  });
}
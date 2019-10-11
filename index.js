#! /usr/bin/env node

const program = require('commander');
const fs = require('fs');
const server = require('./dist/server');

program
  .version('0.1.0')
  .option('-c, --config <file>', 'config file')
  .option('-p, --port <number>', 'port')
  .parse(process.argv);

if (!process.argv.slice(2).length || !program.config) {
  program.outputHelp();
}

if (program.config) {
  const config = JSON.parse(fs.readFileSync(program.config));
  server.runStatic(program.port || 3000, config)
}
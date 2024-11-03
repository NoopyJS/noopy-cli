#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const child_process_1 = require("child_process");
index_1.program
    .command('start')
    .description('Start the project')
    .option('-d, --dev', 'Start the project in development mode')
    .action((options) => {
    if (options.dev) {
        console.log('Starting the project in development mode');
        (0, child_process_1.execSync)('npm run dev', { stdio: 'inherit' });
    }
    else {
        console.log('Starting the project');
        (0, child_process_1.execSync)('npm start', { stdio: 'inherit' });
    }
});

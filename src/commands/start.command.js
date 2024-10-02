#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
index_1.program
    .command('run')
    .description('Start the project')
    .option('-d, --dev', 'Start the project in development mode')
    .action((options) => {
    if (options.dev) {
        console.log('Starting the project in development mode');
    }
    else {
        console.log('Starting the project');
    }
});

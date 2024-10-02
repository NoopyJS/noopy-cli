#!/usr/bin/env node
import {program} from "../index";

program
    .command('start')
    .description('Start the project')
    .option('-d, --dev', 'Start the project in development mode')
    .action((options) => {
        if (options.dev) {
            console.log('Starting the project in development mode');
        } else {
            console.log('Starting the project');
        }
    });

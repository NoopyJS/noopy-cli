#!/usr/bin/env node
import {program} from "../index";
import {execSync} from "child_process";

program
    .command('start')
    .description('Start the project')
    .option('-d, --dev', 'Start the project in development mode')
    .action((options) => {
        if (options.dev) {
            console.log('Starting the project in development mode');
            execSync('npm run dev', {stdio: 'inherit'})
        } else {
            console.log('Starting the project');
            execSync('npm start', {stdio: 'inherit'})
        }
    });

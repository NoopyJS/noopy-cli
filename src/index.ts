#!/usr/bin/env node
import {Command} from "commander";
export const program = new Command();

import './commands/start.command';
import './commands/new.command';
import './commands/generate.command';

program
    .name('noopy')
    .description('CLI pour noopy')
    .version('1.0.0');

// @ts-ignore
program.parse(process.argv);

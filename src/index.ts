#!/usr/bin/env node
import {Command} from "commander";
import * as fs from "fs";
import path from "path";
export const program = new Command();

import './commands/start.command';
import './commands/new.command';
import './commands/generate.command';

import { PrettyConsole } from '../utils/PrettyConsole';
export const prettyConsole = new PrettyConsole();

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version;

prettyConsole.clear();
prettyConsole.closeByNewLine = true;
prettyConsole.useIcons = true;

program
    .name('noopy')
    .description('CLI pour noopy')
    .version(version);

// @ts-ignore
program.parse(process.argv);

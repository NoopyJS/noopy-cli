#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const commander_1 = require("commander");
exports.program = new commander_1.Command();
require("./commands/start.command");
require("./commands/new.command");
require("./commands/generate.command");
exports.program
    .name('noopy')
    .description('CLI pour noopy')
    .version('1.0.0');
// @ts-ignore
exports.program.parse(process.argv);

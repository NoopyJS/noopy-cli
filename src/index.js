#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyConsole = exports.program = void 0;
const commander_1 = require("commander");
exports.program = new commander_1.Command();
require("./commands/start.command");
require("./commands/new.command");
require("./commands/generate.command");
const PrettyConsole_1 = require("../utils/PrettyConsole");
exports.prettyConsole = new PrettyConsole_1.PrettyConsole();
exports.prettyConsole.clear();
exports.prettyConsole.closeByNewLine = true;
exports.prettyConsole.useIcons = true;
exports.program
    .name('noopy')
    .description('CLI pour noopy')
    .version('1.0.0');
// @ts-ignore
exports.program.parse(process.argv);

#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .name('noopy')
    .description('CLI pour noopy')
    .version('1.0.0');
program
    .command('new <name>')
    .description('Créer un nouveau projet')
    .action((name) => {
    console.log('Création du projet', name);
});
// @ts-ignore
program.parse(process.argv);

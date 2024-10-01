#!/usr/bin/env node
import {Command} from "commander";

const program = new Command();


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

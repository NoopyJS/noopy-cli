#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
index_1.program
    .command('generate <component-name>')
    .alias('g')
    .description('Generate a new component')
    .option('-c, --crud', 'Create a CRUD component')
    .action((componentName, options) => {
    if (options.crud) {
        console.log(`Creating a CRUD component named ${componentName}`);
    }
    else {
        console.log(`Creating a component named ${componentName}`);
    }
});

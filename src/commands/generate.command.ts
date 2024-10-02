#!/usr/bin/env node
import {program} from "../index";

program
    .command('generate <component-name>')
    .alias('g')
    .description('Generate a new component')
    .option('-c, --crud', 'Create a CRUD component')
    .action((componentName, options) => {
        if(options.crud) {
            console.log(`Creating a CRUD component named ${componentName}`);
        } else {
            console.log(`Creating a component named ${componentName}`);
        }
    });

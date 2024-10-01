#!/usr/bin/env node
import {Command} from "commander";
import * as fs from "fs";
import {execSync} from "child_process";
import git from "simple-git";
import inquirer from 'inquirer';
import path from "path";
const program = new Command();


program
    .name('noopy')
    .description('CLI pour noopy')
    .version('1.0.0');

program
    .command('new <project-name>')
    .description('Créer un nouveau projet')
    .action(async(projectName, options) => {
        const projectPath = path.join(process.cwd(), projectName);
        let finalName = projectName;
        let finalPath = projectPath;

        if(fs.existsSync(projectPath)) {
            console.log(`ERROR: Folder ${projectName} already exists.`);
            process.exit(1);
        }

        console.log(`Creating a new project in ${projectPath}...`);


        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Project name ?',
                default: projectName
            },
            {
                type: 'input',
                name: 'version',
                message: 'Project Version ?',
                default: '1.0.0'
            },
            {
                type:'list',
                name: 'language',
                message: 'Typescript ?',
                choices: ['Yes', 'No'],
                default: 'Yes',
            }
        ]);

        if(answers.name !== projectName) {
            finalName = answers.name;
            finalPath = path.join(process.cwd(), finalName);
        }
            console.log("Installing dependencies...");

            // clone noopy templates repo
            try {
                await git().clone('https://github.com/NoopyJS/noopy-template.git', finalPath);
                execSync(`npm init -y`, {
                    cwd: finalPath,
                    stdio: 'ignore'
                });
                console.log(`Project ${finalName} created.`);
                console.log(`You can now run 'cd ${finalName}' and 'noopy start' to run the project.`);
            } catch (e) {
                console.error(`An error occurred: ${e}`);
                process.exit(1);
            }


    });

// @ts-ignore
program.parse(process.argv);

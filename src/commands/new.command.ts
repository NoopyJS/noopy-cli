#!/usr/bin/env node
import * as fs from "fs";
import git from "simple-git";
import inquirer from 'inquirer';
import path from "path";
import {prettyConsole, program} from "../index";
import {execSync} from "child_process";
import {Command} from "commander";
import {CHOOSE_ANOTHER_NAME, ERROR_OCCURRED, PROJECT_ALREADY_EXISTS} from "../constants/constants";

const checkDirectoryExists = (projectPath: string, projectName: string) => {
    if(fs.existsSync(projectPath)) {
        prettyConsole.error(PROJECT_ALREADY_EXISTS, CHOOSE_ANOTHER_NAME);
        process.exit(1);
    }
}

const cloneGitRepo = async (language: string, finalPath: string) => {
    try {
        if(language === 'Yes') {
            await git().clone('https://github.com/NoopyJS/noopy-typescript-template.git', finalPath);
        } else {
            await git().clone('https://github.com/NoopyJS/noopy-javascript-template.git', finalPath);
        }
    } catch (e) {
        prettyConsole.error(ERROR_OCCURRED, e);
        process.exit(1)
    }
}

const promptQuestions = (projectName: string) => {
    return inquirer.prompt([
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
        },
        {
            type: 'checkbox',
            name: 'features',
            message: 'What features do you want to include ?',
            choices: ['auth', 'orm', 'jest'],
        }
    ]);
}
program
    .command('new <project-name>')
    .description('Create a new project')
    .alias('n')
    .action(async(projectName: string, options) => {


        const projectPath = path.join(process.cwd(), projectName);
        let finalName = projectName;
        let finalPath = projectPath;
        let typescript: boolean = false;

        checkDirectoryExists(projectPath, projectName);

        prettyConsole.info(`Creating a new project in ${projectPath}...`);

        const answers = await promptQuestions(projectName);
        typescript = answers.language === 'Yes';

        console.log(answers.features)

        if(answers.name !== projectName) {
            finalName = answers.name;
            finalPath = path.join(process.cwd(), finalName);
        }

        prettyConsole.info("Installing dependencies...");

        await cloneGitRepo(answers.language, finalPath);

        if(typescript) {
            execSync('npm install', {stdio: 'ignore'})
        }

        prettyConsole.info(`Project ${finalName} initialized.`, `You can now run 'cd ${finalName}' and 'noopy start (--dev)' to start the project.`);
    });

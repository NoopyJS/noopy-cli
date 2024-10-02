#!/usr/bin/env node
import * as fs from "fs";
import git from "simple-git";
import inquirer from 'inquirer';
import path from "path";
import {program} from "../index";

const checkDirectoryExists = (projectPath: string, projectName: string) => {
    if(fs.existsSync(projectPath)) {
        console.log(`ERROR: Folder ${projectName} already exists.`);
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
        console.error(`An error occurred: ${e}`);
        process.exit(1);
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
        }
    ]);
}
program
    .command('new <project-name>')
    .description('Create a new project')
    .action(async(projectName, options) => {
        const projectPath = path.join(process.cwd(), projectName);
        let finalName = projectName;
        let finalPath = projectPath;

        checkDirectoryExists(projectPath, projectName);

        console.log(`Creating a new project in ${projectPath}...`);

        const answers = await promptQuestions(projectName);

        if(answers.name !== projectName) {
            finalName = answers.name;
            finalPath = path.join(process.cwd(), finalName);
        }

        console.log("Installing dependencies...");

        await cloneGitRepo(answers.language, finalPath);

        console.log(`Project ${finalName} created.`);
        console.log(`You can now run 'cd ${finalName}' and 'noopy start' to run the project.`);
    });

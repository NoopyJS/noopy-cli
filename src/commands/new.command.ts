#!/usr/bin/env node
import * as fs from "fs";
import git from "simple-git";
import inquirer from 'inquirer';
import path from "path";
import {prettyConsole, program} from "../index";
import {execSync} from "child_process";
import {CHOOSE_ANOTHER_NAME, ERROR_OCCURRED, PROJECT_ALREADY_EXISTS} from "../constants/constants";

const checkDirectoryExists = (projectPath: string, projectName: string) => {
    if(fs.existsSync(projectPath)) {
        prettyConsole.error(PROJECT_ALREADY_EXISTS, CHOOSE_ANOTHER_NAME);
        process.exit(1);
    }
}

const cloneGitRepo = async (finalPath: string) => {
    try {
        await git().clone('https://github.com/NoopyJS/noopy-typescript-template.git', finalPath);
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
            type: 'checkbox',
            name: 'features',
            message: 'What features do you want to include ?',
            choices: ['auth','cache','swagger'],
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

        checkDirectoryExists(projectPath, projectName);

        prettyConsole.info(`Creating a new project in ${projectPath}...`);

        const answers = await promptQuestions(projectName);

        if(answers.name !== projectName) {
            finalName = answers.name;
            finalPath = path.join(process.cwd(), finalName);
        }

        prettyConsole.info("Installing dependencies...");

        await cloneGitRepo(finalPath);

        const packageJsonPath = path.join(finalPath, 'package.json');
        const packageJson = require(packageJsonPath);

        packageJson.name = finalName;
        packageJson.version = answers.version;

        if (!packageJson.dependencies) {
            packageJson.dependencies = {};
        }

        if(answers.features.includes('swagger')) {
            execSync('npm install @noopyjs/swagger', {cwd: finalPath, stdio: 'ignore'});
            packageJson.scripts['gen-swagger'] = "node node_modules/@noopyjs/swagger/dist/swagger-ui/swagger-generator.js";
        }


        await fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));

       /* if(answers.features.includes('auth')) {
            packageJson.dependencies['noopy-auth'] = '^1.0.0';
        }*/

        if(answers.features.includes('cache')) {
            execSync('npm install @noopyjs/noopy-cache', {cwd: finalPath, stdio: 'ignore'});
        }

        try {
            execSync('npm install', {cwd: finalPath, stdio: 'ignore'});
        } catch (e: any) {
            prettyConsole.error(ERROR_OCCURRED, e.message, 'Your project has been created but an error occurred while installing dependencies.');
            process.exit(1);
        }

        prettyConsole.info(`Project ${finalName} initialized.`, `You can now run 'cd ${finalName}' and 'noopy start (--dev)' to start the project.`);
    });

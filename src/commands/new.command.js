#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const simple_git_1 = __importDefault(require("simple-git"));
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const index_1 = require("../index");
const child_process_1 = require("child_process");
const constants_1 = require("../constants/constants");
const checkDirectoryExists = (projectPath, projectName) => {
    if (fs.existsSync(projectPath)) {
        index_1.prettyConsole.error(constants_1.PROJECT_ALREADY_EXISTS, constants_1.CHOOSE_ANOTHER_NAME);
        process.exit(1);
    }
};
const cloneGitRepo = (language, finalPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (language === 'Yes') {
            yield (0, simple_git_1.default)().clone('https://github.com/NoopyJS/noopy-typescript-template.git', finalPath);
        }
        else {
            yield (0, simple_git_1.default)().clone('https://github.com/NoopyJS/noopy-javascript-template.git', finalPath);
        }
    }
    catch (e) {
        index_1.prettyConsole.error(constants_1.ERROR_OCCURRED, e);
        process.exit(1);
    }
});
const promptQuestions = (projectName) => {
    return inquirer_1.default.prompt([
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
            type: 'list',
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
};
index_1.program
    .command('new <project-name>')
    .description('Create a new project')
    .alias('n')
    .action((projectName, options) => __awaiter(void 0, void 0, void 0, function* () {
    const projectPath = path_1.default.join(process.cwd(), projectName);
    let finalName = projectName;
    let finalPath = projectPath;
    let typescript = false;
    checkDirectoryExists(projectPath, projectName);
    index_1.prettyConsole.info(`Creating a new project in ${projectPath}...`);
    const answers = yield promptQuestions(projectName);
    typescript = answers.language === 'Yes';
    console.log(answers.features);
    if (answers.name !== projectName) {
        finalName = answers.name;
        finalPath = path_1.default.join(process.cwd(), finalName);
    }
    index_1.prettyConsole.info("Installing dependencies...");
    yield cloneGitRepo(answers.language, finalPath);
    if (typescript) {
        (0, child_process_1.execSync)('npm install', { stdio: 'ignore' });
    }
    index_1.prettyConsole.info(`Project ${finalName} initialized.`, `You can now run 'cd ${finalName}' and 'noopy start (--dev)' to start the project.`);
}));

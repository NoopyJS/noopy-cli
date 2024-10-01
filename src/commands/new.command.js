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
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const program = new commander_1.Command();
program
    .name('noopy')
    .description('CLI pour noopy')
    .version('1.0.0');
program
    .command('new <project-name>')
    .description('Créer un nouveau projet')
    .action((projectName, options) => __awaiter(void 0, void 0, void 0, function* () {
    const projectPath = path_1.default.join(process.cwd(), projectName);
    let finalName = projectName;
    let finalPath = projectPath;
    if (fs.existsSync(projectPath)) {
        console.log(`ERROR: Folder ${projectName} already exists.`);
        process.exit(1);
    }
    console.log(`Creating a new project in ${projectPath}...`);
    const answers = yield inquirer_1.default.prompt([
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
        }
    ]);
    if (answers.name !== projectName) {
        finalName = answers.name;
        finalPath = path_1.default.join(process.cwd(), finalName);
    }
    try {
        fs.mkdirSync(finalPath);
        console.log("Installing dependencies...");
        (0, child_process_1.execSync)(`npm init -y`, {
            cwd: finalPath,
            stdio: 'inherit'
        });
        console.log(`Project ${finalName} created.`);
        console.log(`You can now run 'cd ${finalName}' and 'noopy start' to run the project.`);
    }
    catch (e) {
        console.error(`An error occurred: ${e}`);
    }
}));
// @ts-ignore
program.parse(process.argv);

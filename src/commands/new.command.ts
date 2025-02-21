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
            packageJson.dependencies['@noopyjs/swagger'] = 'latest';
            packageJson.dependencies['swagger-ui-dist'] = 'latest';
            packageJson.devDependencies['@types/swagger-ui-dist'] = 'latest';
            packageJson.scripts['gen-swagger'] = "node node_modules/@noopyjs/swagger/dist/swagger-ui/swagger-generator.js";

            const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset='UTF-8'>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Swagger UI</title>
    <link rel="stylesheet" href='/api-docs/swagger-ui.css'>
</head>
<body>
<div id="swagger-ui"></div>
<script src='/api-docs/swagger-ui-bundle.js'></script>
<script src='/api-docs/swagger-ui-standalone-preset.js'></script>
<script>
    window.onload = () => {
        window.ui = SwaggerUIBundle({
            url: '/api-docs/swagger.json',
            dom_id: '#swagger-ui',
            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
            ],
            layout: "StandaloneLayout"
        });
    };
</script>
</body>
</html></title>
</head>
<body>

</body>
</html>
`;
            fs.writeFileSync(path.join(finalPath, 'swagger.html'), swaggerHtml);

            const indexTsPath = path.join(finalPath, 'src', 'index.ts');
            const indexTs = fs.readFileSync(indexTsPath, 'utf-8');
            const appInitIndex = indexTs.indexOf('app.init()');
            
            await fs.writeFileSync(indexTsPath, `import * as fs from "fs";\nimport path from "path";\nimport swaggerUiDist from 'swagger-ui-dist';\n` + indexTs);

            const setupSwagger = `const swaggerJsonPath = path.join(__dirname, '../swagger.json');

function setupSwagger(app: Noopy, swaggerPath: string) {
    fs.readdir(swaggerUiDist.getAbsoluteFSPath(), (err, files) => {
        files.forEach(file => {
            app.get(\'/api-docs/\' + file, (req: Request, res: Response) => {
                const filePath = path.join(swaggerUiDist.getAbsoluteFSPath(), file);
                res.sendFile(filePath);
            });
        });
    });

    app.get('/api-docs/swagger.json', (req: Request, res: Response) => {
        const test = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
        res.json(test);
    });

    app.get('/api-docs', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(path.join(__dirname, '../swagger.html'));
    });
}

setupSwagger(app, swaggerJsonPath);`;

            await fs.writeFileSync(indexTsPath, indexTs.slice(0, appInitIndex) + setupSwagger + indexTs.slice(appInitIndex));


        }



       /* if(answers.features.includes('auth')) {
            packageJson.dependencies['noopy-auth'] = '^1.0.0';
        }*/

        if(answers.features.includes('cache')) {
            packageJson.dependencies['@noopyjs/noopy-cache'] = 'latest';
        }

        await fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));

        try {
            execSync('npm install', {cwd: finalPath, stdio: 'ignore'});
        } catch (e: any) {
            prettyConsole.error(ERROR_OCCURRED, e.message, 'Your project has been created but an error occurred while installing dependencies.');
            process.exit(1);
        }

        prettyConsole.info(`Project ${finalName} initialized.`, `You can now run 'cd ${finalName}' and 'noopy start (--dev)' to start the project.`);
    });

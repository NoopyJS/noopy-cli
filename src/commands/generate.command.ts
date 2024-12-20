#!/usr/bin/env node
import {prettyConsole, program} from "../index";
import {execSync} from "child_process";
import path from "path";
import * as fs from "fs";

program
    .command('generate <component-name>')
    .alias('g')
    .description('Generate a new component')
    .option('-c, --crud', 'Create a CRUD component')
    .option('-d, --decorator', 'Create a custom decorator, use --with-params to add parameters')
    .option('--with-params', 'Add parameters to the decorator')
    .action((componentName, options) => {
        if(options.crud) {
            console.log(`Creating a CRUD component named ${componentName}`);
        } else if(options.decorator) {
            console.log(`Creating a decorator named ${componentName}`);
            createDecorator(componentName, options.withParams).then(r => r);
        } else if (options.withParams && !options.decorator) {
            console.log(`You can only use --with-params with --decorator`);
        }
        else {
            console.log(`Creating a component named ${componentName}`);
        }
    });

async function createDecorator(name: string, withParams: boolean) {
    try {
        const isInSrcFolder = !fs.existsSync('src');
        const decoratorsDir = isInSrcFolder ? path.join('decorators') : path.join('src', 'decorators');
        await fs.promises.mkdir(decoratorsDir, {recursive: true});

        const decoratorFile = path.join(decoratorsDir, `${name}.ts`);

        if (fs.existsSync(decoratorFile)) {
            prettyConsole.error(`The decorator ${name} already exists`);
            return;
        }
        const content = withParams ? generateParameterizedDecoratorTemplate(name) : generateDecoratorTemplate(name);
        await fs.promises.writeFile(decoratorFile, content);

    } catch (error) {
        prettyConsole.error(error);
    }

    prettyConsole.success(`Decorator ${name} created successfully`, 'You can find it in src/decorators');
}

function generateDecoratorTemplate(name: string): string {
    return `/**
 * Decorator ${name} that can be used on a class or a method.
 * 
 * @example
 * // On a class
 * @${name}
 * class MyClass {
 *   // ...
 * }
 * 
 * // On a method
 * class MyClass {
 *   @${name}
 *   myMethod() {
 *     // ...
 *   }
 * }
 */
export function ${name}(target: any, context: ClassMethodDecoratorContext) {
   // If it's a method
    if (context.kind === "method") {
        return replacementMethod(target);
    }

    // If it's a class
    if (context.kind === "class") {
        // Code to be executed for the class
        return target;
    }
}

function replacementMethod(originalMethod: Function) {
    return function(this: any, ...args: any[]) {
        // Code to be executed before the method

        const result = originalMethod.apply(this, args);

        // Code to be executed after the method

        return result;
    };
}
`;
}

function generateParameterizedDecoratorTemplate(name: string): string {
    return `/**
 * Decorator ${name} with parameters that can be used on a class or a method.
 * 
 * @example
 * // On a class
 * @${name}({ param1: 'value1', param2: 'value2' })
 * class MyClass {
 *   // ...
 * }
 * 
 * // On a method
 * class MyClass {
 *   @${name}({ param1: 'value1', param2: 'value2' })
 *   myMethod() {
 *     // ...
 *   }
 * }
 */

// Interface to define the options of the decorator
interface ${name}Options {
    param1?: string;
    param2?: string;
    // Add more parameters here
}

function replacementMethod(this: any, originalMethod: Function, options: ${name}Options, ...args: any[]) {
    // Code to be executed before the method
    // You have access to the options here

    const result = originalMethod.apply(this, args);

    // Code to be executed after the method
    // You have access to the options here

    return result;
}

export function ${name}(options: ${name}Options = {}) {
    return function(target: any, context: ClassMethodDecoratorContext) {
        // If it's a method
        if (context.kind === "method") {
            const originalMethod = target;

            return function(this: any, ...args: any[]) {
                return replacementMethod.call(this, originalMethod, options, ...args);
            };
        }

        // If it's a class
        if (context.kind === "class") {
            // Code to be executed for the class
            // You have access to the options here
            return target;
        }
    };
}
`;
}


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
const index_1 = require("../index");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
index_1.program
    .command('generate <component-name>')
    .alias('g')
    .description('Generate a new component')
    .option('-c, --crud', 'Create a CRUD component')
    .option('-d, --decorator', 'Create a custom decorator, use --with-params to add parameters')
    .option('--with-params', 'Add parameters to the decorator')
    .action((componentName, options) => {
    if (options.crud) {
        console.log(`Creating a CRUD component named ${componentName}`);
    }
    else if (options.decorator) {
        console.log(`Creating a decorator named ${componentName}`);
        createDecorator(componentName, options.withParams).then(r => r);
    }
    else if (options.withParams && !options.decorator) {
        console.log(`You can only use --with-params with --decorator`);
    }
    else {
        console.log(`Creating a component named ${componentName}`);
    }
});
function createDecorator(name, withParams) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isInSrcFolder = !fs.existsSync('src');
            const decoratorsDir = isInSrcFolder ? path_1.default.join('decorators') : path_1.default.join('src', 'decorators');
            yield fs.promises.mkdir(decoratorsDir, { recursive: true });
            const decoratorFile = path_1.default.join(decoratorsDir, `${name}.ts`);
            if (fs.existsSync(decoratorFile)) {
                index_1.prettyConsole.error(`The decorator ${name} already exists`);
                return;
            }
            const content = withParams ? generateParameterizedDecoratorTemplate(name) : generateDecoratorTemplate(name);
            yield fs.promises.writeFile(decoratorFile, content);
        }
        catch (error) {
            index_1.prettyConsole.error(error);
        }
        index_1.prettyConsole.success(`Decorator ${name} created successfully`, 'You can find it in src/decorators');
    });
}
function generateDecoratorTemplate(name) {
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
function generateParameterizedDecoratorTemplate(name) {
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

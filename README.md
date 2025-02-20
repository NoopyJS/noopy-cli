# Noopy CLI

Noopy CLI is a command-line interface for managing Noopy projects. It provides commands to create new projects, generate components, and start the project.

## Installation

To install Noopy CLI, use npm:

```sh
npm install -g @noopyjs/noopy-cli
```

## Commands

### New

```sh
noopy new <project-name>  # Create a new Noopy project
```

Options:

- -h, --help: Display help for the command

Example:

```sh
noopy new my-noopy-app
```

### Generate

```sh
noopy generate <component-name>  # Generate a new component
```

Options:

- -c, --crud: Generate a CRUD component
- -d, --decorator: Generate a decorator, use --with-params to add parameters

Examples:

```sh
noopy generate my-component
```

```sh
noopy generate my-component -d --with-params
```

### Start

```sh
noopy start  # Start the development server
```

Options:

- -d, --dev: Start the server in development mode

Example:

```sh
noopy start
noopy start --dev
```


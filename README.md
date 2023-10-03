# Walkin Server

## Description

This repository contains all the server side components for Walkin. Components are divided based on the modules, mainly for platform and products.
Creating a GraphQL schema in a modular way, to improve logic organization, scalability, testability and reusability. Server side components are created using the [GraphQL Modules][graphql-modules-toolset] toolset, that integrates with Apollo Server.

## Usage

**_DEPENDENCIES_** :

To install dependencies just do this in repo root

```
yarn
```

**_MIGRATIONS_**:

To run migrations first build the files using

```
yarn build

```

Create a .env file in packages/walkin-platform-server root
then run the following command from /walkin-platform-server or repo root

```
yarn migration:run
```

If any issue, you can revert your migrations using

```
migration:revert
```

To start

**_DEVELOPMENT SERVER_**:

```
yarn start
```

**_PRODUCTION SERVER_**:

```
docker-compose up
```

# Developer Guidelines

- Please only use **YARN** !!!
- Please follow the naming convention based on the existing files and directory structure.
- Make sure to check for any linting errors before commiting. (will add a commit hook enforcing style soon)
- Please don't change the ormconfig when pushing.
- Add only developer dependency in root package.json.
- Add useful commit messages (Checkout [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/))
- Branchout features. Avoid working on master.
- Write unit tests (spec) for everything. Will be very helpful in implementing CI/CD pipelines, as well as during upgrades.
- Desirable workflow (_Opinionated_)
  > Create Issue -> Create Branch for the issue -> Checkout the branch -> **WORK** -> Raise PR -> Merge PR -> Delete branch -> Close Issue

Why is this desirable ? Because not enforcing standards and not having development data will make development unmanagable as the app grows.

# Testing Guidelines

- Use https://chancejs.com/index.html to generate random data

# Production Guidelines

- Make sure you create a private folder in packages/walkin-platform-server with the private.key and public.key
- Also add the .env files in packages/walkin-platform-server and packages/walkin-queue-processor
- Please use docker-compose up to start

# Plugins

( Please mentions the plugins/extensions you use for development, this might help other team members as well )

Useful VScode Extensions:

- Apollo Graphql
- Chrome Debugger
- ES7 React/Redux/React-Native/JS snippets
- ESLint
- GraphQL for VSCode
- Jest
- Jest Snippets
- Prettier
- vscode-digdag

# Versions

Go to tags for [releases](https://gitlab.com/WalkIn/walkin-server-monorepo/-/tags)

# Packages
List of packages to be added.

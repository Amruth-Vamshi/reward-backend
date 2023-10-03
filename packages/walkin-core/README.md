# Walkin Platform modules

## Description

This repository contains all the modules for Walkin Platform

## Usage

First, clone this repository and install the dependencies:

```shell
$ yarn
```

Add your databse config in ormconfig.json (username, password, database etc...)


Then you can start the server:

```shell
$ npm run start:graphql:modules  

or

$ yarn start  

```


#### Migrations

Migration command internally depends on config used. i.e NODE_ENV value. Based on respective node environment it will generate migration script.

Migration Generate 

```shell
    $  yarn migration:generate -n Initialize -f src/config/ormconfig.js
```

Run migration command

```shell
    $ yarn migration:run -f src/config/ormconfig.js
```

The GraphQL Playground will be available at `http://localhost:4000`.

[apollo-server-v2.2.1]: https://github.com/apollographql/apollo-server/blob/master/CHANGELOG.md#v221
[graphql-modules-toolset]: https://graphql-modules.com

##### TODO
- Add /src/private folder to .gitignore
- Share the security keys to everyone privately
Need to do this so that we don't expose our private and public SHA keys.
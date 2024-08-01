# Sandbox

Sandbox Environment for Template Creation. Currently, we only support a markdown playground.

---

## Prerequisite

### Setup Development Environment

1. Install NodeJS LTS(Latest Stable Version) from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).
2. Install [pnpm](https://pnpm.io/).

> Note: Only PNPM v8 is supported at the moment.

    ```shell
    corepack prepare pnpm@latest --activate
    ```

    Or, follow the other [recommended installation options](https://pnpm.io/installation).

## Build & Run

### Build

Clone or download the `identity-integration-ui-templates` repository and run the following command from the command line in the project `sandbox` directory (where the `package.json` is located) to build all the packages with dependencies.

```shell
# From sandbox directory.
pnpm bootstrap && pnpm build
```

### Run

To start the Markdown Playground in development mode, execute the following command.

```shell
pnpm dev
```

Once the development server is up and running, you can access the application via [http://localhost:5173/](http://localhost:5173/).

### Preview

To check the production build, run the following command. Ensure you run `pnpm build` if you have made any changes.

```shell
pnpm preview
```

Once the production server is up and running, you can access the application via [http://localhost:4173/](http://localhost:4173/).

---------------------------------------------------------------------------
(c) Copyright 2024 WSO2 LLC.

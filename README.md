## Description

diablo4.trading backend application

## Windows Installation
Follow this setup guide - [Windows Setup Instructions](https://github.com/SanctuaryTeam/.github/wiki/WindowsSetUp)

## Running the Application with Docker

To get your application up and running:
- Ensure you have both Docker and Docker Compose installed.
- Navigate to the directory containing your docker-compose.yml file.
- Run the following command: `docker-compose up`
- Access your application in your browser at http://localhost:3000.

## Development
start: Starts the application in development mode.
```bash
$ yarn run start
```

start:dev: Starts the application in development mode with watch enabled.
```bash
$ yarn run start:dev
```

start:prod: Starts the application in production mode.
```bash
$ yarn run start:prod
```

dev: Starts the Vite development server.
```bash
$ yarn run dev
```

preview: Previews the production build using Vite.
```bash
$ yarn run preview
```

tsc: Runs TypeScript compiler (tsc) without emitting any files.
```bash
$ yarn run tsc
```

## Translation

lingui:extract:  Extracts translations with LinguiJS, and removes obsolete translations.
```bash
$ yarn run lingui:extract
```

lingui:compile: Compiles translations with LinguiJS and outputs TypeScript files.
```bash
$ yarn run lingui:compile
```

## Build & Deployment
prebuild: Compiles translations before building.
```bash
$ yarn run prebuild
```
build: Compiles TypeScript and then builds the project using Vite.
```bash
$ yarn run build
```
## Code Quality (Linting & Formatting)
lint: Lints TypeScript files with ESLint.
```bash
$ yarn run lint
```
format: Formats the code using dprint.
```bash
$ yarn run format
```
## Testing
test: Runs both unit and UI tests.
```bash
$ yarn run test
```

test:unit: Runs unit tests with Jest using a specific configuration.
```bash
$ yarn run test:unit
```
test:ui: Runs UI tests with Jest using a specific configuration.
```bash
$ yarn run test:ui
```
test:coverage: Runs unit tests with Jest, generating coverage information.
```bash
$ yarn run test:coverage
```

## License

Nest is [MIT licensed](LICENSE).

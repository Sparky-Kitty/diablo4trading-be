# Diablo Trading Backend (sanctuaryteam/diablotrading-be)

This repository contains the backend application for the Diablo Trading project. It provides the necessary services to support the trading functionality.

## Set Up .env
Docker will user this file for project specific environment variables
- Create a [new GitHub personal access token](https://github.com/settings/tokens/new) with the following scopes:
```
    read:packages
```

- Update .env File:  run `cp .env.example .env` to create a new .env file. Update the new .env file with SANCTUARYTEAM_AUTH_TOKEN=YOUR_NEW_TOKEN

## Docker
Install the project dependencies and start up:

To get your application up and running:
- Ensure you have both Docker and Docker Compose installed.
- Navigate to `~/sanctuaryteam/diablo4trading-be` containing your docker-compose.yml file.
```bash
$ cd ~/sanctuaryteam/diablo4trading-be
```
- Run the following command: `docker compose up`
- packages will be installed and application will start
- Access the Application: Once the containers are up and running, you can access the application in your browser using the URL: http://localhost:3000.

## SQLite Build and Run Migrations:
SQLite Database (Development)

For development, the application uses SQLite as the database. If you need to perform migrations on SQLite, you can use the following command:

```bash

$ yarn migrate
```

#### Run Migrations:

```bash
$ yarn migrate:run
```

## Generate JWT Token
To generate a new JWT secret token for your application:

```bash
$ yarn generate-jwt-token
```

## Script Usage

To run the application, you can use the following scripts:

#### Development Mode:
```bash
$ yarn start:dev
```

#### Debug Mode:

```bash

$ yarn start:debug
```

#### Production Mode:

```bash

$ yarn start:prod
```

## Testing

For testing, we have the following scripts:

#### Run All Tests:

```bash
$ yarn test
```

#### Run Tests with Watch Mode:

```bash

$ yarn test:watch
```

#### Generate Test Coverage Reports:

```bash
$ yarn test:cov
```

#### Run End-to-End Tests:

```bash
$ yarn test:e2e
```

# License

Nest is [MIT licensed](LICENSE).

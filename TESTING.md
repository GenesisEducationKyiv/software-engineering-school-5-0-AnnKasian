# Testing Guide

Instructions for running different types of tests in the project.

## Setup

Make sure you have installed the dependencies: `npm install`

### Unit tests

**What it tests:** Individual functions, methods, components without external dependencies.

#### Run all unit tests `npm run test:unit`

#### Run with watch mode `npm run test:unit:watch`

#### Run a specific file `npx jest tests/subscription/subscription.service.unit.spec.ts` (change the path to the file)

### Integration tests

**What it tests:** Interaction between components (repositories with DB, services with API).

#### Run all integration tests (automatically brings/shuts down DB) `npm run test:integration`

#### Run with watch mode `npm run test:integration:watch`

#### Run a specific file `npx jest tests/subscription/subscription.controller.integration.spec.ts` (change the path to the file)

**Note:** Integration tests automatically bring up the test PostgreSQL database through Docker.

## Additional commands

### Database management

##### Up test database `npm run test:db:up`

#### Check database status `npm run test:db:health`

#### Shut down test database `npm run test:db:down`

## CI/CD

In GitHub Actions, the following are automatically run:

- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`

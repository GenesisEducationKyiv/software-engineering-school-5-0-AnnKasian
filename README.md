# Weather Notify Service

## About

This is a repository for weather notification service that allows users to subscribe to weather updates
for their cities and receive notifications via email.

## Steps to run

1. Create and fill `.env` file using `.env.example` as a reference.

2. Build and run docker container: `docker-compose up`

## Deployment

The application is deployed and available at: **[https://weather-notify-idch.onrender.com/](https://weather-notify-idch.onrender.com/)** <br>
<i>(First loading may take a while due to inactivity)</i>

### API Documentation

Interactive API documentation (Swagger): [API Docs](https://weather-notify-idch.onrender.com/api)

## Application

RESTful API

### Routes:

- Subscribe to weather notifications: POST /api/subscribe
- Confirm subscription: GET /api/confirm/{token}
- Unsubscribe: POST /api/unsubscribe/{token}
- Get weather data: GET /api/weather?city={city}
- OpenAPI Specification: GET /api

### Email Notifications

The service sends:

- Confirmation emails when users subscribe
- Regular weather notifications based on subscription frequency (hourly/daily)

## Technologies

**Framework:** NestJS <br>
**Database:** PostgreSQL with TypeORM <br>
**Email:** Nodemailer <br>
**API:** [WeatherAPI.com](https://www.weatherapi.com/) <br>
**Containerization:** Docker <br>
**Language:** TypeScript <br>

# Main Branch Protection Ruleset

This repository uses **reinforced protection rules** on the `main` branch to ensure code quality, collaboration discipline, and production stability.

## Protected Branch: `main`

The following rules are **actively enforced**:

---

## Required Pull Requests

All changes to `main` must be submitted via Pull Requests (PRs) and meet the following requirements:

- **Minimum 2 approving code reviews**
- **Code owners must review the PR**
- **All review threads must be resolved before merging**
- **Stale reviews are dismissed if new commits are pushed**

### Allowed merge methods:
- Merge commit
- Squash merge
- Rebase merge

---

## Required Status Checks

A pull request cannot be merged unless all of the following CI checks **pass**:

- `linting`
- `unit-tests`
- `integration-tests`

> These checks are integrated via CI system (integration_id: `15368`).

---

## Commit & History Rules

- **Force-pushes are disabled**
- **Branch deletion is disabled**

> This ensures every commit is traceable and no rewriting occurs on `main`.

---

## Branch Creation Rules

- New branches from `main` can be created.
- Updates via PRs only — no direct push access.

---

## Who Can Bypass These Rules?

- **No one.**  
  There are currently **no bypass actors** defined — rules apply to all collaborators equally.

---

## 📝 Notes for Contributors

Please make sure to:
1. Fork or create a feature branch.
2. Commit with meaningful messages.
3. Push and create a Pull Request targeting `main`.
4. Wait for CI checks and 2 approvals (including code owner, if applicable).
5. Merge using the allowed methods (squash is required for clarity).

---

For questions or to request a temporary exception, contact the repository maintainers or admins.


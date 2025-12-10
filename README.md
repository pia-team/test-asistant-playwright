# Test Assistant AI - Automated Testing (Playwright)

Automated end-to-end testing suite for the Test Assistant AI system, utilizing Playwright and Cucumber (BDD).

## 🛠 Tech Stack

- **Framework**: Playwright
- **BDD Framework**: Cucumber (Cucumber-js)
- **Language**: TypeScript
- **Reporting**: Allure Reports

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+**
- **npm**

### Installation

Install the necessary dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## 🏃 Running Tests

The project uses `npm` scripts to execute tests in different environments.

### Basic Commands

| Command | Description |
|---------|-------------|
| `npm run test:run` | Run tests in **DEV** environment (default) |
| `npm run test:default` | Run tests using the default profile |
| `npm run wip:test:dev` | Run tests tagged with `@wip` in **DEV** |
| `npm run wip:test:test` | Run tests tagged with `@wip` in **TEST** |

### Environment Variables

You can set the target environment using `TEST_ENV`:

- `dev`
- `test`
- `uat`
- `staging`

Example:
```bash
cross-env TEST_ENV=staging npm run test:run
```

## 📊 Reporting

We use Allure for generating detailed test reports.

1. **Generate Report** (after test execution):
   ```bash
   npm run generate:allure-report
   ```

2. **Open Report**:
   ```bash
   npm run open:allure-report
   ```

## 📂 Project Structure

- `features/`: Cucumber `.feature` files (Gherkin syntax)
- `pages/`: Page Object Models (POM)
- `step-definitions/`: TypeScript implementation of steps
- `support/`: Helper functions and hooks
- `playwright.config.ts`: Main configuration file
- `cucumber.js`: Cucumber configuration

## 📝 Writing Tests

1. Create a `.feature` file in `features/`.
2. Implement step definitions in `step-definitions/`.
3. Use Page Objects in `pages/` to interact with the UI.

# Automation Exercise Test Suite

Automated test suite for [automationexercise.com](https://automationexercise.com) using Playwright.

## Overview

This project contains end-to-end tests covering authentication, product discovery, cart/checkout flows, and security features.

## Key Features

- **Page Manager Pattern**: Centralized page object management for cleaner test code
- **No Hardcoded Test Data**: Dynamic test data generation to avoid data dependencies
- **Custom Fixture**: Automatically handles consent screen on page load

## Project Structure

```
├── pages/              # Page objects using Page Object Model
├── tests/              # Test specifications
├── fixtures.ts         # Custom Playwright fixtures (PageManager & consent handling)
└── package.json
```

## Setup

Install dependencies:
```bash
npm install
```

## Running Tests

Note: to run the tests, you need to register at automationexercise.com, and create testData/credentialsData.ts with your credentials, using the types from types/Credentials.ts. I am aware that payment data also must not be in public repository, but no real credit card credentials are used.

Run all tests:
```bash
npx playwright test
```

Run specific test file:
```bash
npx playwright test tests/auth.spec.ts
```

Run with UI mode:
```bash
npx playwright test --ui
```

## Test Coverage

- Authentication
- Product discovery and search
- Cart and checkout flows
- Security tests
- General site features

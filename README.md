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

- Authentication (login, signup)
- Product discovery and search
- Cart and checkout flows
- Security tests
- General site features

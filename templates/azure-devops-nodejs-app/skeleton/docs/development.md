# Development Guide

This guide covers local development setup and best practices for working with ${{ values.name }}.

## Local Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js 18+**: [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git**: For version control

### Installation

```bash
# Clone the repository
git clone https://dev.azure.com/${{ values.organization }}/${{ values.project }}/_git/${{ values.name }}

# Navigate to the project directory
cd ${{ values.name }}

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server with hot reload
npm run dev

# The application will be available at http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the compiled application |
| `npm test` | Run unit tests with Jest |
| `npm run lint` | Run ESLint for code quality |

## Code Structure

### Source Files (`src/`)

- **index.ts**: Main application entry point with Express server setup
- **index.test.ts**: Unit tests using Jest

### Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript compiler options |
| `.eslintrc.js` | ESLint rules for code quality |
| `jest.config.js` | Jest testing configuration |
| `package.json` | Project dependencies and scripts |

## Testing

This project uses Jest for unit testing.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## Code Quality

ESLint is configured to enforce code quality standards.

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## Dev Spaces

{%- if values.devSpacesUrl %}
This project is configured for OpenShift Dev Spaces. Click the link in the catalog to open a cloud-based development environment.

**Dev Spaces URL**: [${{ values.devSpacesUrl }}](${{ values.devSpacesUrl }}/f?url=https://dev.azure.com/${{ values.organization }}/${{ values.project }}/_git/${{ values.name }})
{%- else %}
Dev Spaces is not configured for this project. Contact your platform team to enable it.
{%- endif %}

## Debugging

### VS Code

Add the following to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Application",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Find and kill the process using port 3000
lsof -i :3000
kill -9 <PID>
```

**TypeScript compilation errors**
```bash
# Clear the dist folder and rebuild
rm -rf dist/
npm run build
```

**Dependencies out of sync**
```bash
# Remove node_modules and reinstall
rm -rf node_modules/
npm install
```

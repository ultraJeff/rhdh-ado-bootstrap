# ${{ values.name }}

${{ values.description }}

## Overview

This is a Node.js application built with TypeScript, hosted on Azure DevOps with a CI/CD pipeline that deploys to OpenShift.

## Quick Links

| Resource | Link |
|----------|------|
| **Repository** | [Azure DevOps Repo](https://dev.azure.com/${{ values.organization }}/${{ values.project }}/_git/${{ values.name }}) |
| **CI Pipeline** | [Build Pipeline](https://dev.azure.com/${{ values.organization }}/${{ values.project }}/_build?definitionId=1) |
| **OpenShift Namespace** | `${{ values.namespace }}` |

## Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Testing**: Jest
- **Linting**: ESLint
- **Container**: OpenShift / Kubernetes
- **CI/CD**: Azure Pipelines

## Project Structure

```
${{ values.name }}/
├── src/
│   ├── index.ts          # Application entry point
│   └── index.test.ts     # Unit tests
├── k8s/
│   ├── deployment.yaml   # Kubernetes Deployment
│   ├── service.yaml      # Kubernetes Service
│   └── route.yaml        # OpenShift Route
├── azure-pipelines.yaml  # CI/CD pipeline definition
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── catalog-info.yaml     # Backstage catalog definition
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Access to the Azure DevOps project
- OpenShift CLI (`oc`) for deployment

### Local Development

1. Clone the repository:
   ```bash
   git clone https://dev.azure.com/${{ values.organization }}/${{ values.project }}/_git/${{ values.name }}
   cd ${{ values.name }}
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Contact

- **Owner**: ${{ values.owner | default("user:default/admin", true) }}
- **Tags**: nodejs, typescript, azure-devops

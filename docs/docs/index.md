# Platform Documentation

Welcome to the Developer Hub platform documentation. This guide covers everything you need to know about using Azure DevOps with Red Hat Developer Hub.

## What is Developer Hub?

Red Hat Developer Hub (RHDH) is an enterprise-grade developer portal based on Backstage. It provides:

- **Software Catalog**: Track all your services, libraries, and infrastructure
- **Software Templates**: Self-service scaffolding for new projects
- **TechDocs**: Documentation as code
- **Plugins**: Extensible architecture for custom functionality

## Quick Links

| Resource | Description |
|----------|-------------|
| [Getting Started](getting-started/overview.md) | Platform overview and first steps |
| [Azure DevOps Integration](azure-devops/integration.md) | How Azure DevOps is integrated |
| [Software Templates](templates/nodejs-app.md) | Available templates for new projects |
| [Orchestrator Workflows](orchestrator/workflows.md) | Serverless workflow automation |

## Platform Components

This platform integrates several key technologies:

```
┌─────────────────────────────────────────────────────────────┐
│                   Red Hat Developer Hub                      │
├─────────────────────────────────────────────────────────────┤
│  Catalog  │  Templates  │  TechDocs  │  Orchestrator        │
├─────────────────────────────────────────────────────────────┤
│                    Azure DevOps                              │
│           (Repos, Pipelines, Artifacts)                      │
├─────────────────────────────────────────────────────────────┤
│                      OpenShift                               │
│        (Kubernetes, Routes, Dev Spaces)                      │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

### Self-Service Development

Developers can create new applications without waiting for platform teams:

1. Choose a software template
2. Fill in the required parameters
3. Get a fully configured repository with CI/CD

### Integrated CI/CD

All projects come with:

- Azure Pipelines for building and testing
- Container image builds
- Automated deployment to OpenShift

### Cloud Development Environments

OpenShift Dev Spaces provides cloud-based development environments:

- Pre-configured with all dependencies
- Accessible from any browser
- Consistent across the team

## Getting Help

- **Platform Team**: Contact the platform team for infrastructure issues
- **Documentation**: Check the relevant section in this guide
- **Community**: Backstage community resources at [backstage.io](https://backstage.io)

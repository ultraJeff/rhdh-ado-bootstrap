# Platform Overview

This document provides an overview of the Developer Hub platform and its capabilities.

## Architecture

The platform is built on several integrated components:

### Red Hat Developer Hub

The central developer portal providing:

- **Software Catalog**: A registry of all software components
- **Software Templates**: Self-service project creation
- **TechDocs**: Documentation hosting
- **Plugins**: Integrations with external tools

### Azure DevOps

Source control and CI/CD platform:

- **Azure Repos**: Git repositories
- **Azure Pipelines**: CI/CD automation
- **Azure Artifacts**: Package management

### OpenShift

Container platform for deployment:

- **Kubernetes**: Container orchestration
- **Routes**: External access to services
- **Dev Spaces**: Cloud development environments

## User Roles

### Developers

- Create new applications using templates
- View documentation
- Monitor CI/CD pipelines
- Access Dev Spaces for cloud development

### Platform Engineers

- Maintain the Developer Hub instance
- Create and update software templates
- Manage integrations and plugins
- Configure Orchestrator workflows

### Administrators

- Manage user access and permissions
- Configure Keycloak authentication
- Monitor platform health

## Getting Started

1. **Log in** to Developer Hub using your credentials
2. **Explore** the Software Catalog to see existing components
3. **Create** a new application using a Software Template
4. **View** your application in the catalog
5. **Monitor** the CI/CD pipeline in Azure DevOps

## Next Steps

- [Prerequisites](prerequisites.md) - What you need to get started
- [Azure DevOps Integration](../azure-devops/integration.md) - Understanding the integration
- [Software Templates](../templates/nodejs-app.md) - Available templates

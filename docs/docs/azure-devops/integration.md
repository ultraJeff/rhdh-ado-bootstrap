# Azure DevOps Integration

This document explains how Azure DevOps is integrated with Red Hat Developer Hub.

## Overview

The platform uses Azure DevOps for:

- **Source Control**: Git repositories for all application code
- **CI/CD**: Azure Pipelines for building, testing, and deploying
- **Artifact Storage**: Container images and packages

## How It Works

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Developer Hub  │───▶│  Azure DevOps   │───▶│   OpenShift     │
│                 │    │                 │    │                 │
│ - Create Repo   │    │ - Store Code    │    │ - Deploy App    │
│ - Create Pipeline    │ - Run Pipeline  │    │ - Expose Route  │
│ - Register Entity    │ - Build Image   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Repository Creation

When you use a software template:

1. Developer Hub creates a new repository in Azure DevOps
2. Template files are populated with your parameters
3. The repository is initialized with the generated code

### Pipeline Creation

Automatically after repository creation:

1. An Azure Pipeline is created from `azure-pipelines.yaml`
2. The pipeline is configured to trigger on pushes to `main`
3. First build may start automatically

### Catalog Registration

The component is registered in the Developer Hub catalog:

1. `catalog-info.yaml` defines the component metadata
2. Annotations link to Azure DevOps resources
3. The component appears in the catalog

## Integration Points

### Annotations

Each component has Azure DevOps annotations:

```yaml
metadata:
  annotations:
    dev.azure.com/project-repo: <project>/<repo>
    dev.azure.com/build-definition: <pipeline-name>
```

### Plugins

The following plugins enable Azure DevOps integration:

| Plugin | Purpose |
|--------|---------|
| Azure DevOps | View repos and pipelines |
| Azure Pipelines | Build status in catalog |

## Authentication

### Service Account

Developer Hub uses a Personal Access Token (PAT) to interact with Azure DevOps:

- Create repositories
- Create pipelines
- Read build status

### User Authentication

Users authenticate via Keycloak SSO, which can be federated with Azure AD if needed.

## Viewing Azure DevOps Resources

From a component in the catalog:

1. **CI Tab**: View recent pipeline runs
2. **Links**: Direct links to the Azure DevOps repository
3. **Overview**: Build status badge

## Troubleshooting

### Repository Not Created

- Verify the Azure DevOps PAT has write permissions
- Check the organization and project names
- Review Developer Hub logs for errors

### Pipeline Not Running

- Ensure `azure-pipelines.yaml` exists in the repository
- Verify pipeline was created (check Azure DevOps UI)
- Check for YAML syntax errors

### Build Failing

- Review the pipeline logs in Azure DevOps
- Check for missing secrets or service connections
- Verify container registry credentials

## Next Steps

- [Azure Pipelines Details](pipelines.md)
- [Authentication Configuration](authentication.md)

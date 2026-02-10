# Azure Pipelines

This document describes how Azure Pipelines are configured and used in this platform.

## Pipeline Structure

Each application created from a template includes an `azure-pipelines.yaml` file that defines the CI/CD process.

### Standard Pipeline Stages

```yaml
trigger:
  - main

pool:
  name: 'openshift-agents'

stages:
  - stage: Build
    jobs:
      - job: BuildAndTest
        steps:
          - Install dependencies
          - Run tests
          - Build application

  - stage: Containerize
    jobs:
      - job: BuildImage
        steps:
          - Build Docker image
          - Push to registry

  - stage: Deploy
    jobs:
      - job: DeployToOpenShift
        steps:
          - Apply Kubernetes manifests
          - Verify deployment
```

## Agent Pool

Pipelines run on self-hosted agents in OpenShift:

- **Pool Name**: `openshift-agents`
- **Location**: `azure-pipelines` namespace
- **Capabilities**: Docker, `oc` CLI, Node.js

## Triggers

### Automatic Triggers

Pipelines trigger automatically on:

- Push to `main` branch
- Pull request to `main` branch

### Manual Triggers

To run a pipeline manually:

1. Go to Azure DevOps > Pipelines
2. Select your pipeline
3. Click "Run pipeline"
4. Choose branch and run

## Variables and Secrets

### Pipeline Variables

Set in the Azure DevOps UI or in the YAML:

```yaml
variables:
  - name: NAMESPACE
    value: 'my-namespace'
```

### Secrets

Use Azure DevOps Variable Groups or secrets:

1. Create a variable group in Azure DevOps
2. Link it to the pipeline
3. Reference variables with `$(VAR_NAME)`

## Common Tasks

### Node.js Build

```yaml
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
  displayName: 'Install Node.js'

- script: npm ci
  displayName: 'Install dependencies'

- script: npm test
  displayName: 'Run tests'

- script: npm run build
  displayName: 'Build application'
```

### Docker Build and Push

```yaml
- task: Docker@2
  inputs:
    command: 'buildAndPush'
    dockerfile: 'Dockerfile'
    containerRegistry: 'OpenShift Registry'
    repository: '$(NAMESPACE)/$(APP_NAME)'
    tags: '$(Build.BuildId)'
```

### OpenShift Deployment

```yaml
- task: oc-cmd@3
  inputs:
    connectionType: 'OpenShift Connection'
    openshiftService: 'openshift-connection'
    cmd: 'apply -k k8s/ -n $(NAMESPACE)'
```

## Viewing Pipeline Results

### In Azure DevOps

1. Navigate to Pipelines in Azure DevOps
2. Select the pipeline run
3. View logs for each stage/job

### In Developer Hub

1. Open the component in the catalog
2. Click the CI tab
3. View recent builds and their status

## Troubleshooting

### Agent Not Available

```
No agent found in pool 'openshift-agents'
```

**Solution**: Verify the Azure Pipeline agent pod is running:
```bash
oc get pods -n azure-pipelines
```

### Image Push Failed

```
unauthorized: authentication required
```

**Solution**: Check the registry credentials in the service connection.

### Deployment Failed

```
error: You must be logged in to the server
```

**Solution**: Verify the OpenShift service connection in Azure DevOps.

## Best Practices

1. **Keep pipelines fast**: Cache dependencies when possible
2. **Use stages**: Separate build, test, and deploy stages
3. **Fail fast**: Run quick tests first
4. **Use templates**: Reuse common pipeline patterns
5. **Secure secrets**: Never hardcode credentials

## Next Steps

- [Authentication Configuration](authentication.md)
- [Node.js App Template](../templates/nodejs-app.md)

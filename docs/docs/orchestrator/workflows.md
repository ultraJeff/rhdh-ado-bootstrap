# Orchestrator Workflows

The Orchestrator plugin enables serverless workflow automation within Developer Hub. This document explains how to use and understand the available workflows.

## What is Orchestrator?

Orchestrator is a Red Hat Developer Hub plugin that provides:

- **Workflow Execution**: Run serverless workflows from the UI
- **Workflow Monitoring**: Track execution status and history
- **Input Forms**: Collect parameters before running workflows
- **Integration**: Connect with external services and APIs

## Accessing Orchestrator

1. Log in to Developer Hub
2. Click "Orchestrator" in the sidebar
3. View available workflows

## Available Workflows

### Utility Rate Report Generator

**ID**: `utility-rate-report`

**Description**: Generates a utility rate report for a specified city based on current weather conditions.

**Input Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| city | string | City name for the report |

**What It Does**:
1. Fetches current weather data for the specified city
2. Retrieves utility rate quotes based on weather conditions
3. Generates a consolidated report

### Provision Utility Monitor

**ID**: `provision-utility-monitor`

**Description**: Provisions a new utility monitoring service for a specific city.

**Input Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| serviceName | string | Name for the monitoring service |
| city | string | City to monitor |
| namespace | string | Target OpenShift namespace |

**What It Does**:
1. Validates input parameters
2. Fetches initial weather data
3. Retrieves initial rate quotes
4. Provisions the monitoring service

## Running a Workflow

### From the UI

1. Navigate to Orchestrator
2. Find the workflow you want to run
3. Click "Run"
4. Fill in the required parameters
5. Click "Execute"
6. Monitor the execution status

### Workflow Status

| Status | Description |
|--------|-------------|
| Running | Workflow is currently executing |
| Completed | Workflow finished successfully |
| Failed | Workflow encountered an error |
| Aborted | Workflow was manually stopped |

## Viewing Workflow History

1. Go to Orchestrator
2. Click on a workflow
3. View the execution history
4. Click on a specific execution for details

## Workflow Architecture

Workflows are built using the Serverless Workflow Specification:

```
┌─────────────────────────────────────────┐
│           Developer Hub                  │
│         (Orchestrator UI)                │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         SonataFlow Runtime               │
│        (Workflow Execution)              │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│           Data Index                     │
│    (Workflow State & History)            │
└─────────────────────────────────────────┘
```

## Creating Custom Workflows

Custom workflows are defined using YAML following the Serverless Workflow Specification:

```yaml
id: my-workflow
version: "1.0"
specVersion: "0.8"
name: My Custom Workflow
description: Description of what this workflow does
start: FirstState
states:
  - name: FirstState
    type: operation
    actions:
      - name: doSomething
        functionRef:
          refName: myFunction
    end: true
functions:
  - name: myFunction
    type: rest
    operation: "http://my-service/api/endpoint#get"
```

### Workflow Components

| Component | Purpose |
|-----------|---------|
| States | Steps in the workflow |
| Functions | External service calls |
| Actions | Operations within states |
| Transitions | Flow between states |

## Troubleshooting

### Workflow Not Visible

- Check if the workflow status is "available"
- Verify RBAC permissions for orchestrator.workflow.read
- Restart the Data Index if recently deployed

### Workflow Execution Failed

1. Check the workflow execution details in Orchestrator
2. Review SonataFlow pod logs
3. Verify external services are accessible

### Permission Denied

Ensure your user has the required RBAC permissions:

```csv
p, role:default/plugins, orchestrator.workflow, read, allow
p, role:default/plugins, orchestrator.workflow.use, update, allow
```

## Best Practices

1. **Validate Inputs**: Use data input schemas to validate parameters
2. **Handle Errors**: Include error handling states in workflows
3. **Log Progress**: Use logging functions to track execution
4. **Test Locally**: Test workflows locally before deploying
5. **Version Workflows**: Use semantic versioning for workflow changes

## Resources

- [Serverless Workflow Specification](https://serverlessworkflow.io/)
- [Red Hat Orchestrator Documentation](https://docs.redhat.com/en/documentation/red_hat_developer_hub/1.8/html/orchestrator_in_red_hat_developer_hub/)
- [SonataFlow Documentation](https://sonataflow.org/)

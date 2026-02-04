# Azure Pipelines Agent on OpenShift

This deploys a self-hosted Azure Pipelines agent on OpenShift, allowing Azure DevOps pipelines to run builds within your cluster.

**Full runbook:** For agent setup plus fixing the 401 when publishing from the Developer Hub software template, see [Azure Pipelines Agent + Software Template](../docs/AZURE-PIPELINES-AND-SOFTWARE-TEMPLATE.md).

## Prerequisites

1. Azure DevOps organization
2. Personal Access Token (PAT) with **Agent Pools (Read & manage)** scope
3. Self-hosted Agent Pool created in Azure DevOps

## Setup

### 1. Create Agent Pool in Azure DevOps

1. Go to **Project Settings** > **Agent pools**
2. Click **Add pool**
3. Select **Self-hosted**
4. Name it (e.g., "OpenShift Pool")
5. Grant access to pipelines

### 2. Create PAT

1. Go to **User Settings** > **Personal access tokens**
2. Create new token with **Agent Pools (Read & manage)** scope
3. Copy the token

### 3. Configure Secrets

```bash
# Copy the example and fill in your values
cp secrets/agent-secrets.yaml.example secrets/agent-secrets.yaml
# Edit secrets/agent-secrets.yaml with your values
```

### 4. Deploy to OpenShift

```bash
# Apply secrets first
oc apply -f secrets/agent-secrets.yaml

# Deploy the agent
oc apply -k .
```

### 5. Verify Agent is Running

```bash
# Check pod status
oc get pods -n azure-pipelines

# Check logs
oc logs -n azure-pipelines -l app=azure-pipelines-agent
```

The agent should appear as "Online" in your Azure DevOps Agent Pool.

## Using in Pipelines

Update your `azure-pipelines.yaml` to use the self-hosted pool:

```yaml
pool:
  name: 'OpenShift Pool'  # Your pool name

steps:
  - script: echo "Running on OpenShift!"
```

## Scaling

To run multiple agents in parallel, increase the replicas:

```bash
oc scale deployment/azure-pipelines-agent -n azure-pipelines --replicas=3
```

## Cleanup

```bash
oc delete -k .
oc delete -f secrets/agent-secrets.yaml
```

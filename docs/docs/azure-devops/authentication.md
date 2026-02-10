# Azure DevOps Authentication

This document explains how authentication is configured between Developer Hub and Azure DevOps.

## Authentication Methods

### Personal Access Token (PAT)

Developer Hub uses a PAT to interact with Azure DevOps APIs:

- Create repositories
- Create and manage pipelines
- Read build status

### How It's Configured

The PAT is stored as a Kubernetes secret and referenced in the Developer Hub configuration:

```yaml
integrations:
  azure:
    - host: dev.azure.com
      credentials:
        - organizations:
            - <your-organization>
          personalAccessToken: ${AZURE_TOKEN}
```

## Required Permissions

The PAT needs the following scopes:

| Scope | Permission | Purpose |
|-------|------------|---------|
| Code | Read & Write | Create and manage repositories |
| Build | Read & Execute | Create and run pipelines |
| Project and Team | Read | Access project information |

## Creating a Personal Access Token

1. Go to Azure DevOps > User Settings > Personal Access Tokens
2. Click "New Token"
3. Configure:
   - **Name**: `developer-hub-integration`
   - **Organization**: Your organization (or All)
   - **Expiration**: Set appropriate expiration
   - **Scopes**: Select required permissions
4. Click "Create"
5. Copy the token immediately (it won't be shown again)

## Updating the Token

When the token expires or needs rotation:

1. Create a new PAT in Azure DevOps
2. Update the Kubernetes secret:
   ```bash
   oc create secret generic ado-credentials \
     --from-literal=AZURE_TOKEN=<new-token> \
     -n rhdh \
     --dry-run=client -o yaml | oc apply -f -
   ```
3. Restart Developer Hub:
   ```bash
   oc rollout restart deployment/backstage-developer-hub -n rhdh
   ```

## User Authentication

### Current Setup

Users authenticate to Developer Hub via Keycloak SSO:

1. User accesses Developer Hub
2. Redirected to Keycloak login
3. Authenticated and returned to Developer Hub

### Azure AD Federation (Optional)

Keycloak can be federated with Azure AD for unified authentication:

1. Configure Azure AD as an Identity Provider in Keycloak
2. Map Azure AD groups to Keycloak roles
3. Users log in with their Azure AD credentials

## Service Connections in Azure DevOps

For pipelines to deploy to OpenShift, service connections are needed:

### OpenShift Service Connection

1. Go to Project Settings > Service connections
2. Create new > Kubernetes
3. Configure with OpenShift cluster details

### Container Registry Connection

1. Go to Project Settings > Service connections
2. Create new > Docker Registry
3. Configure based on your registry type

## Security Best Practices

1. **Least Privilege**: Only grant required permissions
2. **Token Rotation**: Regularly rotate PATs
3. **Audit Access**: Review who has access to tokens
4. **Use Managed Identities**: Where possible, use Azure Managed Identities instead of PATs
5. **Secret Management**: Use proper secret management for tokens

## Troubleshooting

### "Unauthorized" Errors

- Verify the PAT hasn't expired
- Check the PAT has correct scopes
- Ensure the organization name is correct

### "Forbidden" Errors

- The PAT may lack required permissions
- The user/service may not have access to the project

### Connection Timeout

- Verify network connectivity to Azure DevOps
- Check if a proxy is required

## Next Steps

- [Azure DevOps Integration](integration.md)
- [Azure Pipelines](pipelines.md)

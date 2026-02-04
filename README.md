# RHDH Bootstrap

Bootstrap configuration for Red Hat Developer Hub (RHDH) with Keycloak SSO and Azure DevOps integration.

## Overview

This repository contains Kubernetes/OpenShift manifests to deploy:

- **Red Hat Developer Hub (RHDH)** - Developer portal based on Backstage
- **Keycloak (RHBK)** - SSO/Identity provider for RHDH authentication
- **Azure DevOps Integration** - Plugins for ADO repos, pipelines, and Entra ID user sync

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     OpenShift Cluster                        │
│                                                              │
│  ┌──────────────┐    OIDC Auth    ┌──────────────────────┐  │
│  │   Keycloak   │◄───────────────►│  Red Hat Developer   │  │
│  │  (RHBK 26)   │                 │       Hub 1.8        │  │
│  └──────────────┘                 └──────────────────────┘  │
│         │                                    │               │
│         │                                    │               │
│    PostgreSQL                          PostgreSQL            │
│    (embedded)                          (embedded)            │
│                                              │               │
│                                              ▼               │
│                                    ┌──────────────────┐     │
│                                    │  Azure DevOps    │     │
│                                    │  (external)      │     │
│                                    └──────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
rhdh-bootstrap/
├── developer-hub/           # RHDH configuration
│   ├── kustomization.yaml   # Main kustomization
│   ├── namespace.yaml       # rhdh namespace
│   ├── rhdh-operator.yaml   # Operator subscription
│   ├── rhdh-instance.yaml   # Backstage CR
│   ├── dynamic-plugins.yaml # Plugin configuration
│   ├── app-config-*.yaml    # Backstage app-config
│   ├── rbac-policies.yaml   # RBAC configuration
│   └── secrets/             # Secret templates (gitignored)
│       ├── *.yaml.example   # Example secret files
│       └── kustomization.yaml
├── keycloak/                # Keycloak configuration
│   ├── kustomization.yaml
│   ├── keycloak-operator.yaml
│   ├── keycloak-instance.yaml
│   ├── rhdh-realm-import.yaml  # RHDH realm with users
│   └── secrets/
└── README.md
```

## Prerequisites

- OpenShift 4.14+ cluster
- `oc` CLI logged in as cluster-admin
- For Azure DevOps: Azure Entra ID app registration

## Quick Start

### 1. Create Secrets

```bash
# Copy example files
cd developer-hub/secrets
cp keycloak-secrets.yaml.example keycloak-secrets.yaml
cp rhdh-secrets.yaml.example rhdh-secrets.yaml
cp argocd-secrets.yaml.example argocd-secrets.yaml
cp ado-secrets.yaml.example ado-secrets.yaml

# Edit each file with your values
# Then apply:
oc apply -k developer-hub/secrets/

cd ../../keycloak/secrets
cp keycloak-db-secret.yaml.example keycloak-db-secret.yaml
oc apply -f keycloak-db-secret.yaml
```

### 2. Deploy Keycloak

```bash
# Install operator and instance
oc apply -f keycloak/keycloak-operator.yaml
# Wait for operator...
oc apply -f keycloak/keycloak-instance.yaml
# Wait for Keycloak to be ready...
oc apply -f keycloak/rhdh-realm-import.yaml
```

### 3. Deploy RHDH

```bash
# Install operator
oc apply -f developer-hub/rhdh-operator.yaml
# Wait for operator...

# Apply all configs
oc apply -k developer-hub/
```

### 4. Access

```bash
# Get RHDH URL
oc get route backstage-developer-hub -n rhdh -o jsonpath='{.spec.host}'

# Get Keycloak URL  
oc get route -n keycloak -o jsonpath='{.items[0].spec.host}'
```

## Default Test Users (Keycloak)

| Username | Password | Groups |
|----------|----------|--------|
| admin | admin | rhdh-users |
| user1 | user1 | rhdh-users |

## Enabled Plugins

### Core Plugins
- **Keycloak** - User/group sync from Keycloak
- **GitHub** - Catalog provider and org sync
- **Kubernetes** - K8s resource viewing
- **ArgoCD** - GitOps integration
- **RBAC** - Role-based access control

### Azure DevOps Plugins (Technology Preview)
- **Azure DevOps Frontend** - View builds, PRs, repos
- **Azure DevOps Backend** - API proxy
- **Azure Scaffolder** - Project scaffolding
- **MS Graph** - Entra ID user/group sync (disabled by default)

## Configuration Details

### Azure DevOps Setup

**See [Azure Pipelines Agent + Software Template](docs/AZURE-PIPELINES-AND-SOFTWARE-TEMPLATE.md)** for:
- Deploying the self-hosted Azure Pipelines agent on OpenShift
- Fixing **401 Unauthorized** when publishing to Azure DevOps from the software template (PAT must have **Code (Read & write)**)

1. Create an Azure DevOps organization at https://dev.azure.com
2. Create an Azure Entra ID app registration with permissions:
   - Azure DevOps: `user_impersonation`
   - Microsoft Graph: `User.Read`, `Group.Read.All` (for MS Graph plugin)
3. Update `developer-hub/secrets/ado-secrets.yaml` with:
   - `AZURE_DEVOPS_ORG` - Your org name
   - `AZURE_CLIENT_ID` - App registration client ID
   - `AZURE_CLIENT_SECRET` - App registration secret
   - `AZURE_TENANT_ID` - Your tenant ID

### Keycloak SSO

The realm import creates:
- `rhdh` realm
- `rhdh` OIDC client (for RHDH)
- Test users (admin, user1)
- `rhdh-users` group

Client secret must match between:
- `keycloak/rhdh-realm-import.yaml` (plain text)
- `developer-hub/secrets/keycloak-secrets.yaml` (base64 encoded)

## Customization

### Update Cluster Domain

Replace hostnames in these files:
- `keycloak/keycloak-instance.yaml` - `spec.hostname.hostname`
- `keycloak/rhdh-realm-import.yaml` - `redirectUris` and `webOrigins`
- `developer-hub/secrets/keycloak-secrets.yaml` - `KEYCLOAK_BASE_URL`

### Disable/Enable Plugins

Edit `developer-hub/dynamic-plugins.yaml`:
```yaml
plugins:
  - package: ./dynamic-plugins/dist/plugin-name
    disabled: true  # or false
```

## Troubleshooting

### RHDH Pod CrashLoopBackOff

Check logs:
```bash
oc logs -l app.kubernetes.io/name=backstage -n rhdh -c backstage-backend
```

Common issues:
- **MigrationLocked**: Clear DB lock: `oc exec backstage-psql-developer-hub-0 -n rhdh -- psql -d backstage_plugin_catalog -c "UPDATE knex_migrations_lock SET is_locked = 0;"`
- **ENOTFOUND**: Check Keycloak URL is reachable
- **Missing config**: Ensure all secrets are applied

### Keycloak Not Ready

```bash
oc get keycloak -n keycloak
oc logs keycloak-0 -n keycloak
```

## References

- [RHDH 1.8 Documentation](https://docs.redhat.com/en/documentation/red_hat_developer_hub/1.8)
- [Azure DevOps Integration Guide](https://developers.redhat.com/articles/2025/08/22/integrate-azure-devops-red-hat-developer-hub-workflows)
- [RHDH Plugins Catalog](https://developers.redhat.com/rhdh/plugins)

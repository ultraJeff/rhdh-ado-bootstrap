# Prerequisites

Before using the platform, ensure you have the following:

## Required Access

### Developer Hub

- Valid login credentials (via Keycloak SSO)
- Membership in the appropriate groups

### Azure DevOps

- Azure DevOps organization access
- Permission to create repositories
- Permission to create pipelines

### OpenShift

- Access to target namespaces for deployment
- Ability to view pods and logs

## Local Development Tools

For local development, you'll need:

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| npm | 9+ | Package manager |
| Git | 2.x | Version control |
| OpenShift CLI | 4.x | `oc` command for cluster access |

### Installing Node.js

```bash
# macOS with Homebrew
brew install node@18

# Windows with Chocolatey
choco install nodejs-lts

# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Installing OpenShift CLI

```bash
# macOS with Homebrew
brew install openshift-cli

# Windows
# Download from https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/

# Linux
curl -LO https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-client-linux.tar.gz
tar xzf openshift-client-linux.tar.gz
sudo mv oc kubectl /usr/local/bin/
```

## Authentication Setup

### Azure DevOps Personal Access Token

For local Git operations with Azure DevOps:

1. Go to Azure DevOps > User Settings > Personal Access Tokens
2. Create a new token with:
   - **Code**: Read & Write
   - **Build**: Read & Execute
3. Save the token securely

### OpenShift Login

```bash
# Login to OpenShift cluster
oc login --token=<your-token> --server=https://api.<cluster-domain>:6443

# Verify connection
oc whoami
oc project
```

## IDE Setup

### VS Code (Recommended)

Install the following extensions:

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **GitLens**: Enhanced Git integration
- **OpenShift Toolkit**: OpenShift development tools

### Dev Spaces

For cloud-based development, use OpenShift Dev Spaces:

1. Click "Open in Dev Spaces" from the catalog entity
2. Wait for the workspace to initialize
3. Start coding in your browser

## Network Requirements

Ensure you can access:

| Service | URL |
|---------|-----|
| Developer Hub | `https://backstage-developer-hub-rhdh.apps.<cluster-domain>` |
| Azure DevOps | `https://dev.azure.com/<organization>` |
| OpenShift Console | `https://console-openshift-console.apps.<cluster-domain>` |
| Dev Spaces | `https://devspaces.apps.<cluster-domain>` |

## Next Steps

Once you have all prerequisites:

1. [Create your first application](../templates/nodejs-app.md)
2. [Understand the Azure DevOps integration](../azure-devops/integration.md)

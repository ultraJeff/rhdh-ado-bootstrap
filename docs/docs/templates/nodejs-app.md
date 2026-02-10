# Node.js Application Template

This template creates a new Node.js application with TypeScript, hosted on Azure DevOps with a CI/CD pipeline that deploys to OpenShift.

## What You Get

When you create a project from this template, you receive:

- **Git Repository**: Hosted on Azure DevOps
- **TypeScript Project**: Pre-configured with ESLint and Jest
- **CI/CD Pipeline**: Azure Pipeline for build, test, and deploy
- **Kubernetes Manifests**: Deployment, Service, and Route for OpenShift
- **Catalog Entity**: Registered in Developer Hub
- **Documentation**: TechDocs for your application

## Template Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| Application Name | Yes | Unique name (lowercase, no spaces) |
| Description | Yes | Brief description of the application |
| Owner | No | Owner from the catalog |
| Azure DevOps Organization | Yes | Your Azure DevOps organization |
| Azure DevOps Project | Yes | Project to create the repo in |
| Dev Spaces URL | No | Base URL for Dev Spaces (optional) |
| Image Registry | Yes | OpenShift or ACR |
| Namespace | Yes | OpenShift namespace for deployment |

## Using the Template

### Step 1: Navigate to Create

1. Open Developer Hub
2. Click "Create" in the sidebar
3. Select "Node.js App on Azure DevOps"

### Step 2: Fill in Details

1. **Application Details**
   - Enter a unique name (e.g., `my-api`)
   - Add a description
   - Select an owner

2. **Azure DevOps Repository**
   - Enter your organization name
   - Enter the project name

3. **Development Environment**
   - Optionally enter the Dev Spaces URL

4. **Container Registry**
   - Select OpenShift Internal Registry or ACR
   - Enter the target namespace

### Step 3: Create

1. Review your inputs
2. Click "Create"
3. Wait for the scaffolding to complete

### Step 4: Verify

After creation:

1. Click the link to open the Azure DevOps repository
2. Click to view the CI pipeline
3. Open the component in the catalog

## Project Structure

```
my-app/
├── src/
│   ├── index.ts          # Express server
│   └── index.test.ts     # Unit tests
├── k8s/
│   ├── deployment.yaml   # Kubernetes Deployment
│   ├── service.yaml      # Kubernetes Service
│   ├── route.yaml        # OpenShift Route
│   └── kustomization.yaml
├── docs/
│   ├── index.md          # Documentation home
│   ├── development.md    # Development guide
│   ├── deployment.md     # Deployment guide
│   └── api.md            # API reference
├── azure-pipelines.yaml  # CI/CD pipeline
├── catalog-info.yaml     # Backstage catalog entity
├── devfile.yaml          # Dev Spaces configuration
├── mkdocs.yml            # TechDocs configuration
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript config
└── .eslintrc.js          # ESLint config
```

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Node.js 18 | Runtime |
| TypeScript | Language |
| Express | Web framework |
| Jest | Testing |
| ESLint | Linting |

## Development Workflow

### Local Development

```bash
# Clone the repository
git clone https://dev.azure.com/<org>/<project>/_git/<app-name>

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test
```

### Cloud Development (Dev Spaces)

1. Click "Open in Dev Spaces" from the catalog
2. Wait for the workspace to start
3. The devfile pre-configures your environment

### Making Changes

1. Create a feature branch
2. Make your changes
3. Push to Azure DevOps
4. Create a Pull Request
5. Pipeline runs on PR
6. Merge to main
7. Pipeline deploys to OpenShift

## Customization

### Adding Dependencies

```bash
npm install <package-name>
```

### Adding API Endpoints

Edit `src/index.ts`:

```typescript
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello!' });
});
```

### Environment Variables

Add to `k8s/deployment.yaml`:

```yaml
env:
  - name: MY_VAR
    value: "my-value"
```

## Troubleshooting

### Pipeline Failing

1. Check the Azure Pipeline logs
2. Verify tests pass locally
3. Check for TypeScript errors

### Deployment Failing

1. Check OpenShift pod logs
2. Verify namespace exists
3. Check resource limits

### Application Not Accessible

1. Verify the Route exists
2. Check the Service selector
3. Verify pod is running

## Next Steps

After creating your application:

1. Review the generated code
2. Customize the API endpoints
3. Add your business logic
4. Update the documentation
5. Set up additional environments (staging, production)

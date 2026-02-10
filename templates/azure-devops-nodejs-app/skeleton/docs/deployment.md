# Deployment Guide

This guide covers how ${{ values.name }} is built and deployed to OpenShift.

## CI/CD Pipeline

The application uses Azure Pipelines for continuous integration and deployment.

### Pipeline Overview

The pipeline is defined in `azure-pipelines.yaml` and performs the following stages:

1. **Build**: Compiles TypeScript and runs tests
2. **Containerize**: Builds a Docker image
3. **Deploy**: Deploys to OpenShift

### Pipeline Trigger

The pipeline triggers automatically on:
- Push to `main` branch
- Pull request to `main` branch

### View Pipeline

[Open Azure Pipeline](https://dev.azure.com/${{ values.organization }}/${{ values.project }}/_build?definitionId=1)

## OpenShift Deployment

### Namespace

The application is deployed to the `${{ values.namespace }}` namespace.

### Kubernetes Resources

The following resources are created in OpenShift:

| Resource | File | Description |
|----------|------|-------------|
| Deployment | `k8s/deployment.yaml` | Manages the application pods |
| Service | `k8s/service.yaml` | Internal load balancer |
| Route | `k8s/route.yaml` | External HTTPS endpoint |

### Container Image

{%- if values.imageRegistry == 'openshift' %}
Images are stored in the **OpenShift Internal Registry**:
```
image-registry.openshift-image-registry.svc:5000/${{ values.namespace }}/${{ values.name }}:latest
```
{%- else %}
Images are stored in **Azure Container Registry (ACR)**:
```
${{ values.acrName }}.azurecr.io/${{ values.name }}:latest
```
{%- endif %}

## Manual Deployment

If you need to deploy manually, follow these steps:

### Prerequisites

- OpenShift CLI (`oc`) installed
- Logged into the OpenShift cluster
- Access to the `${{ values.namespace }}` namespace

### Steps

1. **Build the image locally**:
   ```bash
   docker build -t ${{ values.name }}:latest .
   ```

2. **Tag for registry**:
   ```bash
   docker tag ${{ values.name }}:latest \
     image-registry.openshift-image-registry.svc:5000/${{ values.namespace }}/${{ values.name }}:latest
   ```

3. **Push to registry**:
   ```bash
   docker push image-registry.openshift-image-registry.svc:5000/${{ values.namespace }}/${{ values.name }}:latest
   ```

4. **Apply Kubernetes resources**:
   ```bash
   oc apply -k k8s/ -n ${{ values.namespace }}
   ```

5. **Verify deployment**:
   ```bash
   oc get pods -n ${{ values.namespace }} -l app=${{ values.name }}
   ```

## Environment Variables

The application supports the following environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server port |
| `NODE_ENV` | `production` | Node.js environment |

To configure in OpenShift:

```bash
oc set env deployment/${{ values.name }} \
  PORT=8080 \
  NODE_ENV=production \
  -n ${{ values.namespace }}
```

## Scaling

### Manual Scaling

```bash
# Scale to 3 replicas
oc scale deployment/${{ values.name }} --replicas=3 -n ${{ values.namespace }}
```

### Auto-scaling

To enable Horizontal Pod Autoscaler:

```bash
oc autoscale deployment/${{ values.name }} \
  --min=2 --max=10 --cpu-percent=80 \
  -n ${{ values.namespace }}
```

## Monitoring

### View Logs

```bash
# Stream logs from all pods
oc logs -f -l app=${{ values.name }} -n ${{ values.namespace }}

# View logs from a specific pod
oc logs <pod-name> -n ${{ values.namespace }}
```

### Check Pod Status

```bash
oc get pods -l app=${{ values.name }} -n ${{ values.namespace }}
```

### Describe Deployment

```bash
oc describe deployment/${{ values.name }} -n ${{ values.namespace }}
```

## Rollback

To rollback to a previous version:

```bash
# View rollout history
oc rollout history deployment/${{ values.name }} -n ${{ values.namespace }}

# Rollback to previous version
oc rollout undo deployment/${{ values.name }} -n ${{ values.namespace }}

# Rollback to specific revision
oc rollout undo deployment/${{ values.name }} --to-revision=2 -n ${{ values.namespace }}
```

## Troubleshooting

### Pod not starting

```bash
# Check pod events
oc describe pod <pod-name> -n ${{ values.namespace }}

# Check resource limits
oc get deployment/${{ values.name }} -o yaml -n ${{ values.namespace }} | grep -A 10 resources
```

### Image pull errors

Verify the image exists and credentials are configured:

```bash
# Check image stream (for internal registry)
oc get is ${{ values.name }} -n ${{ values.namespace }}

# Check pull secrets
oc get secrets -n ${{ values.namespace }} | grep pull
```

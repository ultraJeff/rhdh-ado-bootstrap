# Azure Pipelines Agent + Software Template (Publish to Azure DevOps)

This guide gets the Azure Pipelines agent running on OpenShift and fixes the **401 Unauthorized** when publishing to Azure DevOps from the Developer Hub software template.

---

## Part 1: Azure Pipelines Agent on OpenShift

### Prerequisites

- Azure DevOps organization
- **Personal Access Token (PAT)** with **Agent Pools (Read & manage)** scope
- A **self-hosted Agent Pool** created in Azure DevOps

### Steps

1. **Create the Agent Pool in Azure DevOps**

   - **Project Settings** → **Agent pools** → **Add pool**
   - Type: **Self-hosted**
   - Name it (e.g. `OpenShift Pool`)

2. **Create the PAT**

   - **User Settings** (top-right) → **Personal access tokens** → **New Token**
   - Scopes: **Agent Pools (Read & manage)**
   - Copy the token (you won’t see it again)

3. **Create the agent secret**

   ```bash
   cd azure-pipelines-agent
   cp secrets/agent-secrets.yaml.example secrets/agent-secrets.yaml
   # Edit and set: AZP_URL, AZP_TOKEN, AZP_POOL
   ```

   - `AZP_URL`: `https://dev.azure.com/<your-org>`
   - `AZP_TOKEN`: the PAT from step 2
   - `AZP_POOL`: exact name of the pool (e.g. `OpenShift Pool`)

4. **Deploy**

   ```bash
   oc apply -f secrets/agent-secrets.yaml
   oc apply -k .
   ```

5. **Verify**

   ```bash
   oc get pods -n azure-pipelines
   oc logs -n azure-pipelines -l app=azure-pipelines-agent -f
   ```

   In Azure DevOps, the pool should show the agent as **Online**.

### Troubleshooting (agent)

- **Image pull errors**: Ensure the cluster can pull `mcr.microsoft.com/azure-pipelines/vsts-agent:ubuntu-22.04` (or add an image pull secret if required).
- **Agent never goes Online**: Check `AZP_URL`, `AZP_TOKEN`, and `AZP_POOL`; PAT must have **Agent Pools (Read & manage)**.
- **Pod CrashLoopBackOff**: Inspect logs; common causes are wrong URL format or expired/invalid PAT.

---

## Part 2: Fix 401 When Publishing from the Software Template

The **Node.js App on Azure DevOps** template uses the `publish:azure` action. A **401 Unauthorized** usually means the Developer Hub backend is not authenticating correctly to Azure DevOps (wrong or missing PAT, or wrong scopes).

### Cause

- The `publish:azure` action uses the **Azure DevOps integration** in `app-config`, which reads `integrations.azure[].credentials[].personalAccessToken` → `${AZURE_TOKEN}`.
- That value comes from the **ado-secrets** Secret in the `rhdh` namespace. If the secret is missing, not applied, or the PAT has insufficient scopes, you get 401.

### Required PAT for publishing

For **creating repos and pushing code** from the software template, the PAT in **ado-secrets** must include **Code** with **write** access:

| Scope        | Access        | Purpose                    |
|-------------|----------------|----------------------------|
| **Code**    | **Read & write** (or Full) | Create repo, push from template |
| Build       | Read           | Optional, for pipeline discovery |
| Project and team | Read   | Optional                   |

**Do not** use a PAT with **Code (Read)** only; that will cause 401 on publish.

### Steps to fix the 401

1. **Create a PAT with Code (Read & write)**

   - **User Settings** → **Personal access tokens** → **New Token**
   - Name it (e.g. `RHDH Publish`)
   - Scopes: **Code (Read & write)** — and optionally Build (Read), Project and team (Read)
   - Copy the token

2. **Create or update ado-secrets**

   ```bash
   cd developer-hub/secrets
   cp ado-secrets.yaml.example ado-secrets.yaml
   # Edit ado-secrets.yaml:
   # - AZURE_ORG: your org name (e.g. myorg)
   # - AZURE_TOKEN: the new PAT (Code Read & write)
   # - AZURE_DEVOPS_CATALOG_URL: your catalog URL if you use it
   ```

3. **Apply the secret**

   ```bash
   oc apply -f ado-secrets.yaml
   ```

   The secret must be in the **rhdh** namespace (as in the example). The Developer Hub Backstage instance is configured to load it via `extraEnvs.secrets` in `rhdh-instance.yaml`.

4. **Restart the Developer Hub so it picks up the secret**

   ```bash
   oc rollout restart deployment/developer-hub -n rhdh
   # Or if the deployment name differs:
   oc get deployment -n rhdh
   oc rollout restart deployment/<developer-hub-deployment-name> -n rhdh
   ```

5. **Run the template again**

   Use the **Node.js App on Azure DevOps** template; the “Publish to Azure DevOps” step should succeed if the PAT has Code (Read & write) and the secret is applied and loaded.

### Verify integration config

In `developer-hub/app-config-production.yaml` the Azure integration should look like this (and already does in this repo):

```yaml
integrations:
  azure:
    - host: dev.azure.com
      credentials:
        - personalAccessToken: ${AZURE_TOKEN}
```

No code change is needed here; fixing the secret and PAT scopes is enough.

### If you still get 401

- Confirm the secret exists and has the right key:  
  `oc get secret ado-secrets -n rhdh -o jsonpath='{.data.AZURE_TOKEN}' | base64 -d`  
  (should show the PAT; redact in real use.)
- Confirm the Backstage pod has the env:  
  `oc exec -n rhdh deployment/developer-hub -- env | grep AZURE_TOKEN`
- Ensure the PAT is not expired and has **Code (Read & write)**.
- Check Backstage backend logs:  
  `oc logs -n rhdh deployment/developer-hub -c backstage --tail=200`

---

## Summary

| Goal                         | What to do |
|-----------------------------|------------|
| Agent on OpenShift          | Use `agent-secrets.yaml` (AZP_URL, AZP_TOKEN, AZP_POOL) and `oc apply -k azure-pipelines-agent` |
| No 401 on template publish  | Use `ado-secrets.yaml` with a PAT that has **Code (Read & write)**, apply in `rhdh`, restart Developer Hub |

The **agent** PAT (agent pool management) and the **publish** PAT (repo create/push) can be the same token if it has both **Agent Pools (Read & manage)** and **Code (Read & write)**; otherwise use two PATs with the correct scopes.

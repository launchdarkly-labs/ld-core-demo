# Migration Guide: AWS ALB to Nginx Ingress Controller

This guide explains how to migrate all existing deployments from direct AWS ALB integration to using the Kubernetes Nginx Ingress Controller. This migration is needed to support more than 100 target environments.

## Background

The current deployment architecture uses:
- One AWS Application Load Balancer (ALB)
- Direct targeting of Kubernetes pods/services via ALB target groups
- AWS Route 53 DNS records pointing to the ALB

The limitation is that an ALB supports a maximum of 100 targets, which restricts the number of concurrent demo environments.

## New Architecture

The new architecture uses:
- Kubernetes Nginx Ingress Controller
- cert-manager for TLS certificate management
- One shared ALB fronting the Nginx Ingress Controller
- Host-based routing for different environments

Benefits:
- Supports hundreds of environments (namespaces)
- Maintains HTTPS support
- Preserves existing environment URLs
- Each environment remains isolated in its own namespace

## Migration Process

### Prerequisites
- Access to AWS EKS cluster
- kubectl configured to access the cluster
- AWS CLI credentials with Route 53 permissions

### Automated Migration

We've created a GitHub workflow to automate the migration:

1. **Migrate One Environment (Test First)**

Navigate to GitHub Actions in the repository, select the "Migrate to Nginx Ingress Controller" workflow, and run it with the following parameters:
   - Set "dryrun" to "true" to first see what changes would be made

Once you've verified the planned changes look correct, run again with:
   - Set "dryrun" to "false" to apply the changes

2. **Verify Migration**

For each migrated environment:
   - Check the environment is accessible via its URL (https://[namespace].launchdarklydemos.com)
   - Verify HTTPS is working correctly
   - Confirm the application functions normally

### Manual Migration

If you need to migrate environments manually, follow these steps:

1. **Install Nginx Ingress Controller (once per cluster)**

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-type"="nlb" \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-ssl-cert"="arn:aws:acm:us-east-1:955116512041:certificate/fa29cb5d-f635-40df-89cc-70db82c93845" \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-ssl-ports"="https" \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-backend-protocol"="ssl" \
  --set controller.service.ports.https=443 \
  --set controller.ingressClassResource.default=true
```

2. **Install cert-manager (once per cluster)**

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true

# Create a ClusterIssuer for Let's Encrypt
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@launchdarklydemos.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

3. **Get the Nginx Ingress Controller Load Balancer Hostname**

```bash
NGINX_LB_HOSTNAME=$(kubectl get service -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "Nginx Ingress Controller hostname: $NGINX_LB_HOSTNAME"
```

4. **For each namespace, update the Ingress and Service**

```bash
NAMESPACE=your-namespace-name

# Update service type if needed
kubectl patch service -n $NAMESPACE $NAMESPACE -p '{"spec":{"type":"ClusterIP"}}'

# Create new ingress
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ld-core-demo-ingress
  namespace: $NAMESPACE
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
    nginx.ingress.kubernetes.io/proxy-ssl-verify: "off"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - $NAMESPACE.launchdarklydemos.com
    secretName: $NAMESPACE-tls
  rules:
    - host: $NAMESPACE.launchdarklydemos.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: $NAMESPACE
                port:
                  number: 443
EOF
```

5. **Update DNS record to point to Nginx Ingress Controller**

```bash
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name "launchdarklydemos.com." --query "HostedZones[0].Id" --output text)
RECORD_SET_JSON='{
  "Comment": "Updating Alias record to point to Nginx Ingress Controller",
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "'$NAMESPACE'.launchdarklydemos.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z35SXDOTRQ7X7K",
          "DNSName": "'$NGINX_LB_HOSTNAME'",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}'
aws route53 change-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID --change-batch "$RECORD_SET_JSON"
```

## Troubleshooting

If you encounter issues during or after migration:

1. **Check the Nginx Ingress Controller logs**
```bash
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
```

2. **Verify TLS certificate issuance**
```bash
kubectl get certificates -n your-namespace-name
kubectl get certificaterequests -n your-namespace-name
kubectl get challenges -n your-namespace-name
```

3. **Confirm DNS is resolving correctly**
```bash
dig your-namespace.launchdarklydemos.com
```

4. **Check the service endpoints**
```bash
kubectl get endpoints -n your-namespace-name
```

5. **Inspect the route table in the Nginx Ingress Controller**
```bash
kubectl exec -it -n ingress-nginx deployment/ingress-nginx-controller -- /bin/bash -c "nginx -T"
```

## Reverting Changes

If needed, you can revert to the original ALB configuration by:

1. Update the Ingress resource to use ALB instead of Nginx
2. Change the Service type back to NodePort
3. Update the DNS record to point to the original ALB

## Contact

For assistance, contact the platform team or open an issue in this repository.
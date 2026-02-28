#!/usr/bin/env bash
# deploy.sh — Build and deploy freecalc to AWS (S3 + CloudFront via CDK)
#
# Usage:
#   ./scripts/deploy.sh [--profile <aws-profile>]
#
# Default AWS profile: fullcloud
# To use a different profile: ./scripts/deploy.sh --profile myprofile

set -euo pipefail

AWS_PROFILE="${AWS_PROFILE:-fullcloud}"

# Parse --profile flag
while [[ $# -gt 0 ]]; do
  case $1 in
    --profile) AWS_PROFILE="$2"; shift 2 ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

echo "==> Building Next.js app (profile: $AWS_PROFILE)..."
npm run build

echo "==> Deploying via CDK..."
cd infra
npx cdk deploy --require-approval never --profile "$AWS_PROFILE"
cd ..

echo ""
echo "✓ Deployed to https://solvefree.com"

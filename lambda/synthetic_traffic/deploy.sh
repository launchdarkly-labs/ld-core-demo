#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="${SCRIPT_DIR}/build"
PACKAGE_DIR="${BUILD_DIR}/package"
ZIP_FILE="${BUILD_DIR}/deployment.zip"

PROJECT_NAME="${PROJECT_NAME:-togglebank-synthetic}"
ENVIRONMENT="${ENVIRONMENT:-prod}"
AWS_REGION="${AWS_REGION:-us-east-1}"

usage() {
    echo "Usage: $0 {build|infra|update|invoke|logs}"
    echo ""
    echo "  build   - Build the deployment zip"
    echo "  infra   - Run terraform apply"
    echo "  update  - Upload zip to Lambda functions"
    echo "  invoke  - Invoke the Agent Graph Lambda"
    echo "  logs    - Tail CloudWatch logs"
    exit 1
}

cmd_build() {
    echo "==> Building deployment package..."
    rm -rf "${BUILD_DIR}"
    mkdir -p "${PACKAGE_DIR}"

    pip3 install \
        --platform manylinux2014_x86_64 \
        --target "${PACKAGE_DIR}" \
        --implementation cp \
        --python-version 3.11 \
        --only-binary=:all: \
        -r "${SCRIPT_DIR}/requirements.txt" \
        2>&1 | tail -5

    cp "${SCRIPT_DIR}/common.py" "${PACKAGE_DIR}/"
    cp "${SCRIPT_DIR}/agent_runner.py" "${PACKAGE_DIR}/"
    cp "${SCRIPT_DIR}/handler_agent_graph.py" "${PACKAGE_DIR}/"
    cp "${SCRIPT_DIR}/DynamoDBUtils.py" "${PACKAGE_DIR}/"
    cp "${SCRIPT_DIR}/LDAPIUtils.py" "${PACKAGE_DIR}/"

    cd "${PACKAGE_DIR}"
    rm -rf __pycache__ tests
    zip -r "${ZIP_FILE}" . -x '*.pyc' '__pycache__/*' > /dev/null
    cd "${SCRIPT_DIR}"

    SIZE=$(du -sh "${ZIP_FILE}" | cut -f1)
    echo "==> Built ${ZIP_FILE} (${SIZE})"
}

cmd_infra() {
    echo "==> Running terraform apply..."
    if [ -z "${TF_VAR_ld_api_key:-}" ]; then
        echo "Error: TF_VAR_ld_api_key must be set"
        exit 1
    fi

    cd "${SCRIPT_DIR}/terraform"
    terraform init -input=false
    terraform apply \
        -var="aws_region=${AWS_REGION}" \
        -var="project_name=${PROJECT_NAME}" \
        -var="environment=${ENVIRONMENT}" \
        -auto-approve
}

cmd_update() {
    FUNC_NAME="${PROJECT_NAME}-${ENVIRONMENT}-agent-graph"
    echo "==> Updating Lambda function: ${FUNC_NAME}"

    if [ ! -f "${ZIP_FILE}" ]; then
        echo "Error: ${ZIP_FILE} not found. Run '$0 build' first."
        exit 1
    fi

    aws lambda update-function-code \
        --function-name "${FUNC_NAME}" \
        --zip-file "fileb://${ZIP_FILE}" \
        --region "${AWS_REGION}" \
        --no-cli-pager
    echo "==> Updated ${FUNC_NAME}"
}

cmd_invoke() {
    FUNC_NAME="${PROJECT_NAME}-${ENVIRONMENT}-agent-graph"
    echo "==> Invoking ${FUNC_NAME}..."

    aws lambda invoke \
        --function-name "${FUNC_NAME}" \
        --region "${AWS_REGION}" \
        --payload '{}' \
        --cli-binary-format raw-in-base64-out \
        --no-cli-pager \
        /tmp/togglebank-synthetic-response.json

    echo "==> Response:"
    python3 -m json.tool /tmp/togglebank-synthetic-response.json 2>/dev/null || \
        cat /tmp/togglebank-synthetic-response.json
}

cmd_logs() {
    LOG_GROUP="/aws/lambda/${PROJECT_NAME}-${ENVIRONMENT}-agent-graph"
    echo "==> Tailing ${LOG_GROUP}..."
    aws logs tail "${LOG_GROUP}" --follow --region "${AWS_REGION}"
}

case "${1:-}" in
    build)  cmd_build ;;
    infra)  cmd_infra ;;
    update) cmd_update ;;
    invoke) cmd_invoke ;;
    logs)   cmd_logs ;;
    *)      usage ;;
esac

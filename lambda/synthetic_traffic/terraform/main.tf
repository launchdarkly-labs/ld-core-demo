terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# ---------------------------------------------------------------------------
# Variables
# ---------------------------------------------------------------------------

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "togglebank-synthetic"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "ld_api_key" {
  description = "LaunchDarkly Management API key (used to resolve per-project SDK keys)"
  type        = string
  sensitive   = true
}

variable "dynamodb_table_name" {
  description = "DynamoDB table that tracks active demo environments"
  type        = string
  default     = "ld-core-demo-provisioning-workflow-records-prod"
}

variable "schedule_expression" {
  description = "EventBridge schedule expression"
  type        = string
  default     = "rate(1 hour)"
}

# ---------------------------------------------------------------------------
# Locals
# ---------------------------------------------------------------------------

locals {
  name_prefix = "${var.project_name}-${var.environment}"

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  lambda_env = {
    LD_API_KEY           = var.ld_api_key
    DYNAMODB_TABLE_NAME  = var.dynamodb_table_name
    LAUNCHDARKLY_ENABLED = "true"
    LLM_PROVIDER         = "bedrock"
    LLM_MODEL            = "amazon.nova-pro-v1:0"
  }
}

# ---------------------------------------------------------------------------
# IAM
# ---------------------------------------------------------------------------

resource "aws_iam_role" "lambda_execution_role" {
  name = "${local.name_prefix}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "${local.name_prefix}-lambda-policy"
  role = aws_iam_role.lambda_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"
      },
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream"
        ]
        Resource = "*"
      },
      {
        Sid    = "RAGVectorTables"
        Effect = "Allow"
        Action = [
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:GetItem"
        ]
        Resource = "arn:aws:dynamodb:${data.aws_region.current.name}:*:table/*RAG*"
      },
      {
        Sid    = "DemoEnvironmentsTable"
        Effect = "Allow"
        Action = [
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem"
        ]
        Resource = "arn:aws:dynamodb:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:table/${var.dynamodb_table_name}"
      }
    ]
  })
}

# ---------------------------------------------------------------------------
# CloudWatch Log Group
# ---------------------------------------------------------------------------

resource "aws_cloudwatch_log_group" "agent_graph_logs" {
  name              = "/aws/lambda/${local.name_prefix}-agent-graph"
  retention_in_days = 14

  tags = local.common_tags
}

# ---------------------------------------------------------------------------
# Lambda Function
# ---------------------------------------------------------------------------

resource "aws_lambda_function" "agent_graph" {
  function_name = "${local.name_prefix}-agent-graph"
  role          = aws_iam_role.lambda_execution_role.arn
  runtime       = "python3.11"
  handler       = "handler_agent_graph.lambda_handler"
  timeout       = 900
  memory_size   = 1024

  filename         = "${path.module}/../build/deployment.zip"
  source_code_hash = filebase64sha256("${path.module}/../build/deployment.zip")

  environment {
    variables = local.lambda_env
  }

  depends_on = [aws_cloudwatch_log_group.agent_graph_logs]

  tags = local.common_tags
}

# ---------------------------------------------------------------------------
# EventBridge Schedule (hourly)
# ---------------------------------------------------------------------------

resource "aws_cloudwatch_event_rule" "hourly_agent_graph" {
  name                = "${local.name_prefix}-hourly-agent-graph"
  description         = "Trigger ToggleBank Agent Graph synthetic traffic every hour"
  schedule_expression = var.schedule_expression

  tags = local.common_tags
}

resource "aws_cloudwatch_event_target" "agent_graph_target" {
  rule      = aws_cloudwatch_event_rule.hourly_agent_graph.name
  target_id = "AgentGraphTarget"
  arn       = aws_lambda_function.agent_graph.arn
}

resource "aws_lambda_permission" "allow_eventbridge_agent_graph" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.agent_graph.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.hourly_agent_graph.arn
}

# ---------------------------------------------------------------------------
# Outputs
# ---------------------------------------------------------------------------

output "agent_graph_function_name" {
  description = "Name of the Agent Graph synthetic traffic Lambda"
  value       = aws_lambda_function.agent_graph.function_name
}

output "agent_graph_log_group" {
  description = "CloudWatch log group for Agent Graph Lambda"
  value       = aws_cloudwatch_log_group.agent_graph_logs.name
}

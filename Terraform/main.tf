terraform {
  required_providers {
    launchdarkly = {
      source  = "launchdarkly/launchdarkly"
      version = "~> 2.5"
    }
  }
  required_version = "> 1.1.6"
}

provider "launchdarkly" {
  access_token = var.access_token
  api_host = var.api_host
}
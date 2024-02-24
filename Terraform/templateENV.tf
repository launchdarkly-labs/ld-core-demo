resource "launchdarkly_environment" "template-env" {
  name  = "template-env"
  key   = "template-env"
  color = "ff00ff"
  tags  = ["template-env"]

  project_key = var.project_key
}
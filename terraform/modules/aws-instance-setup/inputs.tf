variable "project_name" {
  type        = string
  description = "The prefix for the role name"
  default     = "starter-kit-v2"
}

variable "terraform_tag_value" {
  type        = string
  description = "Terraform tag value on AWS resources"
  default     = "appvantageasia"
}

variable "aws_tags" {
  type        = map
  description = "AWS Tags to be applied on AWS resources"
  default = {}
}

resource "random_id" "id" {
  keepers = {
    instance_type = var.project_name
  }

  byte_length = 4
}

variable "authorized_force_deletion" {
  type        = bool
  description = "Force deletion of resources"
  default     = false
}

variable "infosec_bucket_access_logs" {
  type        = string
  description = "Bucket name for access logs"
}

variable "instance_stage" {
  type        = string
  description = "Instance stage"
  default     = "unknown"
}

locals {
  project_full_name = "${var.project_name}-${random_id.id.hex}"
  tags = merge({
    "appvantage.com/project" : var.project_name,
    "appvantage.com/instance" : random_id.id.hex,
    "appvantage.com/stage" : var.instance_stage,
    "appvantage.com/terraform" : var.terraform_tag_value
  }, var.aws_tags)
}

variable "eks_cluster_oidc_arn" {
  type        = string
  description = "The OIDC ARN for the cluster"
}

variable "email_sender" {
  type        = string
  description = "The email sender"
}

variable "email_with_ses" {
  type        = bool
  description = "Send email with SES"
  default     = false
}

variable "helm_release_name" {
  type        = string
  description = "Helm release name"
  nullable    = true
  default     = null
}

variable "helm_release_namespace" {
  type        = string
  description = "Helm release namespace"
  nullable    = true
  default     = null
}

locals {
  helm_release_namespace = var.helm_release_namespace != null ? var.helm_release_namespace : local.project_full_name
  helm_release_name      = var.helm_release_name != null ? var.helm_release_name : local.project_full_name
}

output "helm_release_namespace" {
  value = local.helm_release_namespace
}

output "helm_release_name" {
  value = local.helm_release_name
}

output "tags" {
  value = local.tags
}

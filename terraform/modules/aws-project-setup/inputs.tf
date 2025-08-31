variable "development_branch_name" {
  type        = string
  description = "The name of the development branch"
  default     = "master"
}

variable "production_branch_name" {
  type        = string
  description = "The name of the production branch"
  default     = "latest"
}

variable "repository_name" {
  type        = string
  description = "The name of the repository"
  default     = "appvantageasia/starter-kit-v2"
}

variable "project_name" {
  type        = string
  description = "The prefix for the role name"
  default     = "starter-kit-v2"
}

variable "github_oidc_url" {
  type        = string
  description = "The OIDC URL for GitHub"
  default     = "https://token.actions.githubusercontent.com"
}

variable "github_oidc_audience" {
  type        = string
  description = "The OIDC audiance for GitHub"
  default     = "sts.amazonaws.com"
}

variable "terraform_tag_value" {
  type        = string
  description = "Terraform tag value on AWS resources"
  default     = "appvantageasia"
}

variable "aws_tags" {
  type        = map
  description = "AWS Tags to be applied on AWS resources"
  default     = {}
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

variable "aws_cloudfront_shield_region" {
  type        = string
  description = "AWS Cloudfront Shield Region"
  default     = null
}

data "aws_region" "current" {}

locals {
  aws_cloudfront_shield_region = var.aws_cloudfront_shield_region != null ? var.aws_cloudfront_shield_region : data.aws_region.current.name
  tags                         = merge({
    "appvantage.com/project" : var.project_name
    "appvantage.com/instance" : random_id.id.hex
    "appvantage.com/terraform" : var.terraform_tag_value
  }, var.aws_tags)
}

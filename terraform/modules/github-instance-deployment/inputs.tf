variable "project_name" {
  type        = string
  description = "The prefix for the role name"
}

variable "github_oidc_url" {
  type        = string
  description = "The OIDC URL for GitHub"
  default     = "https://token.actions.githubusercontent.com"
}

variable "github_oidc_audiance" {
  type        = string
  description = "The OIDC audiance for GitHub"
  default     = "sts.amazonaws.com"
}

variable "branch_name" {
  type        = string
  description = "The name of the branch to deploy from"
}

variable "repository_name" {
  type        = string
  description = "The name of the repository"
  default     = "appvantageasia/starter-kit-v2"
}

variable "aws_tags" {
  type        = map
  description = "AWS Tags to be applied on AWS resources"
  default = {}
}

variable "cluster_name" {
  type        = string
  description = "The name of the EKS cluster"
}

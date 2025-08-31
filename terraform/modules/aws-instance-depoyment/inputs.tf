variable "project_name" {
  type        = string
  description = "The prefix for the role name"
}

variable "instance_database_name" {
  type        = string
  description = "The name of the database"
}

variable "instance_database_uri" {
  type        = string
  description = "The URI of the database"
}

variable "instance_bucket_name" {
  type        = string
  description = "The name of the bucket"
}

variable "instance_bucket_region" {
  type        = string
  description = "The region of the bucket"
}

variable "instance_sa_arn" {
  type        = string
  description = "The ARN of the instance service account"
}

variable "aws_tags" {
  type        = map
  description = "AWS Tags to be applied on AWS resources"
  default = {}
}

variable "helm_release_name" {
  type        = string
  description = "Helm release name"
}

variable "helm_release_namespace" {
  type        = string
  description = "Helm release namespace"
}

variable "sentry_dsn" {
  type        = string
  description = "Sentry DSN"
  default     = "https://15566370967317e7dd0d2d7a414275da@o421078.ingest.us.sentry.io/4507382884728832"
}

resource "random_password" "session_secret" {
  length  = 64
  special = false

  keepers = {
    project_name = var.project_name
  }
}

variable "ingress_annotations" {
  type        = map
  description = "Ingress annotations"
  default = {}
}

variable "ingress_hostnames" {
  type = list(string)
  description = "Ingress hostnames"
  default = []
}

variable "ingress_class" {
  type        = string
  description = "Ingress class"
  default     = "nginx"
}

variable "image_registry" {
  type        = string
  description = "Image registry"
}

variable "image_repository" {
  type        = string
  description = "Image repository"
}

variable "enforce_application_version" {
  type        = string
  description = "Enforce application version"
  default     = null
}

variable "helm_deployment_strategy" {
  type        = string
  description = "Deployment strategy for the application"
  default     = "RollingUpdate"
}

variable "eks_cluster_name" {
  type        = string
  description = "The name of the EKS cluster"
}

variable "spa_console_cdn" {
  type        = string
  description = "The CDN for the SPA console"
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

variable "email_smtp_settings" {
  type = object({
    host = optional(string)
    port = optional(number)
    secure = optional(bool)
    username = optional(string)
    password = optional(string)
  })
  description = "SMTP settings"
  default     = null
}

variable "server_hostname" {
  type        = string
  description = "Server hostname"
}

variable "ses_region" {
  type        = string
  description = "SES region"
  default     = null
  nullable    = true
}

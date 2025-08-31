module "project" {
  source                     = "../modules/aws-project-setup"
  infosec_bucket_access_logs = "buckets-accesses-985587343714"
  aws_tags                   = local.aws_tags
}

output "release-role" {
  value = module.project.release-role
}

output "assets_cdn" {
  value = module.project.assets_cdn.domain_name
}

output "ecr_name" {
  value = module.project.ecr_name
}

output "ecr_url" {
  value = module.project.ecr_url
}

output "assets_bucket" {
  value = module.project.assets_bucket.bucket
}

output "storybook_bucket" {
  value = module.project.storybook_bucket.bucket
}

output "storybook_cdn" {
  value = module.project.storybook_cdn.domain_name
}

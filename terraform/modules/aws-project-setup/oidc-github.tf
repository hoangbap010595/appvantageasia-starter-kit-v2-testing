data "aws_iam_openid_connect_provider" "github" {
  url = var.github_oidc_url
}

locals {
  oidc_key = replace(data.aws_iam_openid_connect_provider.github.url, "https://", "")
}

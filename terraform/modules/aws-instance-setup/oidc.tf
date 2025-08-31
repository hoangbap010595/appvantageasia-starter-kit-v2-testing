data "aws_iam_openid_connect_provider" "eks" {
  arn      = var.eks_cluster_oidc_arn
}

locals {
  eks_oidc_key = replace(data.aws_iam_openid_connect_provider.eks.url, "https://", "")
}

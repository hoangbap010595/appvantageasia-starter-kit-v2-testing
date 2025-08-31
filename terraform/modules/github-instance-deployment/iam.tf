resource "aws_iam_role" "role" {
  name               = "${var.project_name}-deployment-role"
  assume_role_policy = data.aws_iam_policy_document.development-release-assume-policy.json
  tags               = var.aws_tags
}

data "aws_iam_policy_document" "development-release-assume-policy" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect = "Allow"

    condition {
      test     = "StringEquals"
      variable = "${local.oidc_key}:sub"
      values = ["repo:${var.repository_name}:ref:refs/heads/${var.branch_name}"]
    }

    condition {
      test     = "StringEquals"
      variable = "${local.oidc_key}:aud"
      values = [var.github_oidc_audiance]
    }

    principals {
      identifiers = [data.aws_iam_openid_connect_provider.github.arn]
      type = "Federated"
    }
  }
}

data "aws_eks_cluster" "cluster" {
  name = var.cluster_name
}

data "aws_iam_policy_document" "access-cluster-policy" {
  statement {
    effect = "Allow"

    actions = [
      "eks:AccessKubernetesApi",
      "eks:DescribeCluster",
    ]

    resources = [data.aws_eks_cluster.cluster.arn]
  }
}

resource "aws_iam_role_policy" "access-cluster-policy" {
  name   = "access-cluster-policy"
  role   = aws_iam_role.role.id
  policy = data.aws_iam_policy_document.access-cluster-policy.json
}

output "role" {
  value = aws_iam_role.role.arn
}

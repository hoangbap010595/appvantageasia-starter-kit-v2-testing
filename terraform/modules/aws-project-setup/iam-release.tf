resource "aws_iam_role" "development-release-role" {
  name               = "${var.project_name}-${random_id.id.hex}-development-release-role"
  assume_role_policy = data.aws_iam_policy_document.development-release-assume-policy.json
  tags               = local.tags
}

data "aws_iam_policy_document" "development-release-assume-policy" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect = "Allow"

    condition {
      test     = "StringEquals"
      variable = "${local.oidc_key}:sub"
      values = [
        "repo:${var.repository_name}:ref:refs/heads/${var.development_branch_name}",
        "repo:${var.repository_name}:ref:refs/heads/${var.production_branch_name}"
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "${local.oidc_key}:aud"
      values = [var.github_oidc_audience]
    }

    principals {
      identifiers = [data.aws_iam_openid_connect_provider.github.arn]
      type = "Federated"
    }
  }
}

resource "aws_iam_policy" "development-release-assets" {
  name        = "${var.project_name}-${random_id.id.hex}-s3-release-policy"
  path        = "/"
  description = "Grant operations to release assets and storybook for ${var.project_name}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = ["s3:PutObject", "s3:GetObject", "s3:ListBucket", "s3:DeleteObject"]
        Effect = "Allow"
        Resource = [
          aws_s3_bucket.assets.arn,
          "${aws_s3_bucket.assets.arn}/*",
          aws_s3_bucket.storybook.arn,
          "${aws_s3_bucket.storybook.arn}/*",
        ]
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "development-release-assets" {
  policy_arn = aws_iam_policy.development-release-assets.arn
  role       = aws_iam_role.development-release-role.name
}

resource "aws_iam_policy" "development-release-images" {
  name        = "${var.project_name}-${random_id.id.hex}-ecr-release-policy"
  path        = "/"
  description = "Grant access to upload ECR images for ${var.project_name}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = ["ecr:GetAuthorizationToken"]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:CompleteLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:InitiateLayerUpload",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage"
        ]
        Effect = "Allow"
        Resource = [aws_ecr_repository.main.arn]
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "development-release-images" {
  policy_arn = aws_iam_policy.development-release-images.arn
  role       = aws_iam_role.development-release-role.name
}

output "release-role" {
  value = aws_iam_role.development-release-role.arn
}

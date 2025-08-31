data "aws_iam_policy_document" "sa-assume-policy" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect = "Allow"

    condition {
      test     = "StringEquals"
      variable = "${local.eks_oidc_key}:sub"
      values = ["system:serviceaccount:${local.helm_release_namespace}:${local.helm_release_name}"]
    }

    condition {
      test     = "StringEquals"
      variable = "${local.eks_oidc_key}:aud"
      values = ["sts.amazonaws.com"]
    }

    principals {
      identifiers = [var.eks_cluster_oidc_arn]
      type = "Federated"
    }
  }
}

resource "aws_iam_role" "sa" {
  name               = "${local.project_full_name}-service-account"
  assume_role_policy = data.aws_iam_policy_document.sa-assume-policy.json
  tags               = local.tags
}

output "aws_iam_role" {
  value = aws_iam_role.sa.arn
}

resource "aws_iam_policy" "bucket" {
  name        = "${local.project_full_name}-storage-policy"
  path        = "/"
  description = "Grant operations on objects for public and private buckets for ${local.project_full_name}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = ["s3:PutObject", "s3:GetObject", "s3:ListBucket", "s3:DeleteObject"]
        Effect = "Allow"
        Resource = [
          aws_s3_bucket.private_storage.arn,
          "${aws_s3_bucket.private_storage.arn}/*"
        ]
      },
    ]
  })
}

resource "aws_iam_policy" "kms" {
  name        = "${local.project_full_name}-kms-policy"
  path        = "/"
  description = "Grant operations on the key for ${local.project_full_name}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = ["kms:Encrypt", "kms:Decrypt", "kms:ReEncrypt*", "kms:GenerateDataKey*", "kms:DescribeKey"],
        Effect   = "Allow",
        Resource = aws_kms_key.private_storage.arn
      },
    ]
  })
}

resource "aws_iam_policy" "ses" {
  count       = var.email_with_ses ? 1 : 0
  name        = "${local.project_full_name}-ses-policy"
  path        = "/"
  description = "Grant operations on the SES service for ${local.project_full_name}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = ["ses:SendEmail", "ses:SendRawEmail"]
        Effect   = "Allow"
        Resource = "*"
        Condition = {
          StringEquals = {
            "ses:FromAddress" = var.email_sender
          }
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "bucket" {
  policy_arn = aws_iam_policy.bucket.arn
  role       = aws_iam_role.sa.name
}

resource "aws_iam_role_policy_attachment" "kms" {
  policy_arn = aws_iam_policy.kms.arn
  role       = aws_iam_role.sa.name
}

resource "aws_iam_role_policy_attachment" "ses" {
  count      = var.email_with_ses ? 1 : 0
  policy_arn = aws_iam_policy.ses[0].arn
  role       = aws_iam_role.sa.arn
}

resource "aws_s3_bucket" "storybook" {
  bucket        = "${var.project_name}-${random_id.id.hex}-storybook"
  tags          = local.tags
  force_destroy = var.authorized_force_deletion
}

resource "aws_s3_bucket_versioning" "storybook" {
  bucket = aws_s3_bucket.storybook.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "storybook" {
  bucket = aws_s3_bucket.storybook.id

  rule {
    id     = "remove-noncurrent-versions"
    status = "Enabled"

    filter {}

    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }

  rule {
    id     = "prerelease-storage-transition"
    status = "Enabled"

    filter {
      prefix = "*.*.*-next.*/"
    }

    transition {
      storage_class = "INTELLIGENT_TIERING"
    }
  }
}

resource "aws_s3_bucket_logging" "storybook" {
  bucket        = aws_s3_bucket.storybook.id
  target_bucket = var.infosec_bucket_access_logs
  target_prefix = "${aws_s3_bucket.storybook.id}/"
}

data "aws_iam_policy_document" "storybook" {
  statement {
    sid     = "AllowSSLRequestsOnly"
    effect  = "Deny"
    actions = ["s3:*"]

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    resources = [
      aws_s3_bucket.storybook.arn,
      "${aws_s3_bucket.storybook.arn}/*",
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }

  statement {
    sid     = "AllowCloudFrontServicePrincipal"
    effect  = "Allow"
    actions = ["s3:GetObject"]

    resources = [
      aws_s3_bucket.storybook.arn,
      "${aws_s3_bucket.storybook.arn}/*",
    ]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.storybook.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "storybook" {
  bucket = aws_s3_bucket.storybook.id
  policy = data.aws_iam_policy_document.storybook.json
}

output "storybook_bucket" {
  value = aws_s3_bucket.storybook
}

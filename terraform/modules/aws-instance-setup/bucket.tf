resource "aws_s3_bucket" "private_storage" {
  bucket        = "${local.project_full_name}-private-storage"
  tags          = local.tags
  force_destroy = var.authorized_force_deletion
}

resource "aws_s3_bucket_versioning" "private_storage" {
  bucket = aws_s3_bucket.private_storage.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_cors_configuration" "private_storage" {
  bucket = aws_s3_bucket.private_storage.id

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}

data "aws_iam_policy_document" "private_storage" {
  statement {
    sid    = "AllowSSLRequestsOnly"
    effect = "Deny"
    actions = ["s3:*"]

    principals {
      type = "*"
      identifiers = ["*"]
    }

    resources = [
      aws_s3_bucket.private_storage.arn,
      "${aws_s3_bucket.private_storage.arn}/*",
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values = ["false"]
    }
  }
}

resource "aws_s3_bucket_policy" "private_storage" {
  bucket = aws_s3_bucket.private_storage.id
  policy = data.aws_iam_policy_document.private_storage.json
}

resource "aws_s3_bucket_lifecycle_configuration" "private_storage" {
  bucket = aws_s3_bucket.private_storage.id

  rule {
    id     = "remove-noncurrent-versions"
    status = "Enabled"

    filter {}

    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }

  rule {
    id     = "snapshots-storage-transition"
    status = "Enabled"

    filter {
      prefix = "snapshots/"
    }

    transition {
      days          = 7
      storage_class = "GLACIER"
    }
  }

  rule {
    id     = "remove-snapshots"
    status = "Enabled"

    filter {
      prefix = "snapshots/"
    }

    expiration {
      days = 30
    }
  }
}

resource "aws_s3_bucket_logging" "private_storage" {
  bucket        = aws_s3_bucket.private_storage.id
  target_bucket = var.infosec_bucket_access_logs
  target_prefix = "${aws_s3_bucket.private_storage.id}/"
}

resource "aws_kms_key" "private_storage" {
  key_usage                = "ENCRYPT_DECRYPT"
  customer_master_key_spec = "SYMMETRIC_DEFAULT"
  description              = "This key is used to encrypt bucket objects for ${local.project_full_name}"
  enable_key_rotation      = true
  tags                     = local.tags
}

resource "aws_kms_alias" "private_storage" {
  name          = "alias/${var.project_name}/${random_id.id.hex}/private-storage"
  target_key_id = aws_kms_key.private_storage.key_id
}

resource "aws_s3_bucket_server_side_encryption_configuration" "private_storage" {
  bucket = aws_s3_bucket.private_storage.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_alias.private_storage.id
    }
  }
}

output "bucket_name" {
  value = aws_s3_bucket.private_storage.id
}

output "bucket_region" {
  value = aws_s3_bucket.private_storage.region
}

resource "aws_ecr_repository" "main" {
  name                 = "${var.project_name}-${random_id.id.hex}"
  image_tag_mutability = "IMMUTABLE"
  force_delete         = var.authorized_force_deletion

  encryption_configuration {
    encryption_type = "KMS"
  }

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.tags
}

resource "aws_ecr_lifecycle_policy" "remove-untagged-image" {
  repository = aws_ecr_repository.main.name

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Expire images older than 7 days",
            "selection": {
                "tagStatus": "untagged",
                "countType": "sinceImagePushed",
                "countUnit": "days",
                "countNumber": 7
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}

output "ecr_url" {
  value = aws_ecr_repository.main.repository_url
}

output "ecr_name" {
  value = aws_ecr_repository.main.name
}

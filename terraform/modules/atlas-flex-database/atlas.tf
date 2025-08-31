data "mongodbatlas_project" "main" {
  project_id = var.atlas_project_id
}

data "mongodbatlas_flex_cluster" "main" {
  project_id = data.mongodbatlas_project.main.id
  name       = var.atlas_cluster_name
}

resource "mongodbatlas_database_user" "role" {
  project_id         = data.mongodbatlas_project.main.id
  username           = var.application_role_arn
  auth_database_name = "$external"
  aws_iam_type       = "ROLE"

  scopes {
    name = data.mongodbatlas_flex_cluster.main.name
    type = "CLUSTER"
  }

  roles {
    role_name     = "dbAdmin"
    database_name = var.atlas_database_name
  }

  roles {
    role_name     = "readWrite"
    database_name = var.atlas_database_name
  }
}

output "connection_string" {
  value = data.mongodbatlas_flex_cluster.main.connection_strings.standard_srv
}

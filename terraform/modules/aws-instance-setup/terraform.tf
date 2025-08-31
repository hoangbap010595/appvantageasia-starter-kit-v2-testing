terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.97.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "3.7.2"
    }

    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "1.33.0"
    }
  }
}

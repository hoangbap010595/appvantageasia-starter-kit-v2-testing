terraform {
  backend "s3" {
    bucket = "aws-apv-tfstate"
    key    = "apv-cluster/starter-kit-v2.tfstate"
    region = "ap-southeast-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.97.0"
    }
  }
}

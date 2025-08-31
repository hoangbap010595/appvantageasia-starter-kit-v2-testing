data "aws_eks_cluster" "host" {
  name = var.eks_cluster_name
}

data "aws_eks_cluster_auth" "host" {
  name = data.aws_eks_cluster.host.name
}

provider "helm" {
  alias = "cluster"

  kubernetes {
    host  = data.aws_eks_cluster.host.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.host.certificate_authority[0].data)
    token = data.aws_eks_cluster_auth.host.token
  }
}

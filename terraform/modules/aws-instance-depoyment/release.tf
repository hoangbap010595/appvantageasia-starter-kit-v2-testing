resource "helm_release" "app" {
  name         = var.helm_release_name
  namespace    = var.helm_release_namespace
  chart        = "${path.module}/../../../charts/starter-kit-v2/"
  reuse_values = true

  provider = helm.cluster

  set_sensitive {
    name  = "settings.session.secret"
    value = random_password.session_secret.result
  }

  values = [
    yamlencode({
      global = {

        serviceAccount = {
          annotations = {
            "eks.amazonaws.com/role-arn" = var.instance_sa_arn
          }
        }

        extraLabels = var.aws_tags,

        deploymentStrategy = {
          type = var.helm_deployment_strategy
        }

        image = {
          registry   = var.image_registry
          repository = var.image_repository
        }
      }

      settings = {
        database = {
          databaseName  = var.instance_database_name
          databaseUri   = var.instance_database_uri
          authMechanism = "MONGODB-AWS"
        }

        storage = {
          bucket = var.instance_bucket_name
          region = var.instance_bucket_region
        }

        environment = var.project_name

        sentry = {
          dsn = var.sentry_dsn
        }

        server = {
          hostname = var.server_hostname
        }
      }

      ingress = {
        enabled      = length(var.ingress_hostnames) > 0
        ingressClass = var.ingress_class
        annotations  = var.ingress_annotations

        hosts = [
          for host in var.ingress_hostnames : {
            host = host
            paths = [
              {
                path     = "/"
                pathType = "Prefix"
              }
            ]
          }
        ]

        tls = [
          for host in var.ingress_hostnames : {
            hosts = [host]
            secretName : "${replace(host, "*", "wildcard")}-tls"
          }
        ]
      }
    }),
    yamlencode(var.enforce_application_version != null ? {
      global = {
        image = {
          tag = var.enforce_application_version
        }
      }

      settings = {
        spa = {
          consoleCdn = "https://${var.spa_console_cdn}/${var.enforce_application_version}"
        }
      }
    } : {}),
    yamlencode({
      settings = {
        email = var.email_with_ses ? {
          provider = "SES"
          sender   = var.email_sender
          smtp = {}
          ses = {
            region = var.ses_region
          }
        } : {
          provider = "SMTP"
          sender   = var.email_sender
          ses = {}
          smtp     = var.email_smtp_settings
        }
      }
    })
  ]
}

resource "aws_cloudfront_origin_access_control" "assets" {
  name                              = aws_s3_bucket.assets.id
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "assets" {
  enabled         = true
  is_ipv6_enabled = true
  tags            = local.tags
  http_version    = "http2and3"

  origin {
    domain_name              = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id                = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.assets.id

    origin_shield {
      enabled              = true
      origin_shield_region = local.aws_cloudfront_shield_region
    }
  }

  default_cache_behavior {
    target_origin_id       = aws_s3_bucket.assets.bucket_regional_domain_name
    viewer_protocol_policy = "https-only"

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD", "OPTIONS"]
    compress        = true

    cache_policy_id            = data.aws_cloudfront_cache_policy.CachingOptimized.id
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.CORS-S3Origin.id
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.CORS-with-preflight-and-SecurityHeadersPolicy.id
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

output "assets_cdn" {
  value = aws_cloudfront_distribution.assets
}

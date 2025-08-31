data "aws_cloudfront_cache_policy" "CachingOptimized" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_origin_request_policy" "CORS-S3Origin" {
  name = "Managed-CORS-S3Origin"
}

data "aws_cloudfront_response_headers_policy" "CORS-with-preflight-and-SecurityHeadersPolicy" {
  name = "Managed-CORS-with-preflight-and-SecurityHeadersPolicy"
}

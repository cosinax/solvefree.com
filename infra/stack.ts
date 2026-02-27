import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";

interface FreeCalcStackProps extends cdk.StackProps {
  domainName: string;
}

export class FreeCalcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FreeCalcStackProps) {
    super(scope, id, props);

    const { domainName } = props;

    // ─── S3 Bucket for static site ───
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: `${domainName}-site`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // ─── Route53 Hosted Zone ───
    // Look up existing hosted zone, or create one
    const hostedZoneId = this.node.tryGetContext("hostedZoneId");
    const zone = hostedZoneId
      ? route53.HostedZone.fromHostedZoneAttributes(this, "Zone", {
          hostedZoneId,
          zoneName: domainName,
        })
      : new route53.HostedZone(this, "Zone", {
          zoneName: domainName,
        });

    // ─── ACM Certificate (must be in us-east-1 for CloudFront) ───
    const certificate = new acm.Certificate(this, "SiteCertificate", {
      domainName,
      subjectAlternativeNames: [`www.${domainName}`],
      validation: acm.CertificateValidation.fromDns(zone),
    });

    // ─── Security Headers Response Policy ───
    const securityHeadersPolicy = new cloudfront.ResponseHeadersPolicy(this, "SecurityHeaders", {
      securityHeadersBehavior: {
        contentTypeOptions: { override: true },
        frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
        referrerPolicy: { referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN, override: true },
        strictTransportSecurity: { accessControlMaxAge: cdk.Duration.days(365), includeSubdomains: true, override: true },
        xssProtection: { protection: true, modeBlock: true, override: true },
      },
      customHeadersBehavior: {
        customHeaders: [
          { header: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()", override: true },
        ],
      },
    });

    // ─── CloudFront Function: rewrite extensionless URLs to .html ───
    // Needed for Next.js static export — /health/bmi → /health/bmi.html
    const rewriteFn = new cloudfront.Function(this, "RewriteHtml", {
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var req = event.request;
  var uri = req.uri;
  // If no extension and not ending in /, append .html
  if (!uri.includes('.') && !uri.endsWith('/')) {
    req.uri = uri + '.html';
  }
  // Trailing slash → index.html
  if (uri.endsWith('/') && uri !== '/') {
    req.uri = uri + 'index.html';
  }
  return req;
}
      `),
      runtime: cloudfront.FunctionRuntime.JS_2_0,
    });

    // ─── CloudFront Distribution ───
    const distribution = new cloudfront.Distribution(this, "SiteDistribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy: securityHeadersPolicy,
        compress: true,
        functionAssociations: [{
          function: rewriteFn,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
      domainNames: [domainName, `www.${domainName}`],
      certificate,
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
          ttl: cdk.Duration.minutes(5),
        },
      ],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    // ─── Deploy site to S3 ───
    new s3deploy.BucketDeployment(this, "DeploySite", {
      sources: [s3deploy.Source.asset("../out")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
      memoryLimit: 512,
    });

    // ─── Route53 DNS Records ───
    // A record for apex domain
    new route53.ARecord(this, "SiteARecord", {
      zone,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });

    // A record for www subdomain
    new route53.ARecord(this, "SiteWwwARecord", {
      zone,
      recordName: "www",
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });

    // AAAA records for IPv6
    new route53.AaaaRecord(this, "SiteAAAARecord", {
      zone,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });

    new route53.AaaaRecord(this, "SiteWwwAAAARecord", {
      zone,
      recordName: "www",
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });

    // ─── Outputs ───
    new cdk.CfnOutput(this, "BucketName", {
      value: siteBucket.bucketName,
    });

    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
    });

    new cdk.CfnOutput(this, "SiteUrl", {
      value: `https://${domainName}`,
    });

    if (!hostedZoneId) {
      new cdk.CfnOutput(this, "NameServers", {
        value: (zone as route53.HostedZone).hostedZoneNameServers?.join(", ") || "N/A",
        description: "Point your domain registrar NS records to these",
      });
    }
  }
}

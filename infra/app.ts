import * as cdk from "aws-cdk-lib";
import { FreeCalcStack } from "./stack";

const app = new cdk.App();

const domainName = app.node.tryGetContext("domainName") || "freecalc.com";

new FreeCalcStack(app, "FreeCalcStack", {
  domainName,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1", // Required for CloudFront + ACM
  },
});

app.synth();

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
const { writeEnvFile, writeConfFile } = require('./utils');
const authConfig = require('../resources/auth/parameters');

const { oAuthMetadata: { AllowedOAuthScopes } } = authConfig(null)

const getStackOutputs = async (provider, stage, region) => {
  const { stackName } = serverless.service.provider;

  const result = await provider.request(
    'CloudFormation',
    'describeStacks',
    { StackName: stackName },
    stage,
    region,
  );

  const outputsArray = result.Stacks[0].Outputs;

  const outputs = {};
  for (let i = 0; i < outputsArray.length; i += 1) {
    outputs[outputsArray[i].OutputKey] = outputsArray[i].OutputValue;
  }

  return outputs;
};

const setupFrontendEnvFile = async () => {
  // eslint-disable-next-line no-undef
  const provider = serverless.getProvider('aws');
  // eslint-disable-next-line no-undef
  const { stage, region } = options;

  console.log(`stage = ${stage}, region = ${region}`);

  const res = await getStackOutputs(provider, stage, region);
  const result = {
    Auth: {
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: res.IdentityPoolId,

      // REQUIRED - Amazon Cognito Region
      region,

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: res.UserPoolId,

      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: res.AppClientIDWeb,

      oauth: {
        domain: res.HostedUIDomain,
        scope: AllowedOAuthScopes,
        redirectSignIn: JSON.parse(res.OAuthMetadata).CallbackURLs,
        redirectSignOut: JSON.parse(res.OAuthMetadata).LogoutURLs,
        responseType: 'code',
      },
    },
    Analytics: {
      disabled: true,
      autoSessionRecord: true,
      // AWSPinpoint: {
      //   appId: res.PinpointId,
      //   region: res.PinpointRegion,
      // },
    },
    aws_user_files_s3_bucket: res.S3BucketName,
    aws_user_files_s3_bucket_region: res.ProjectRegion,
  };

  // console.log(res);
  // await writeConfFile(
  //   JSON.stringify({
  //     appId: res.PinpointId,
  //     appName: res.PinpointAppName,
  //   }),
  // );
  const fileName = `aws-exports-${stage}.json`;
  await writeEnvFile(JSON.stringify(result, null, 2), fileName);
};

setupFrontendEnvFile();

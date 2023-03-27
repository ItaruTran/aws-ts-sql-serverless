
let config = {
  "systemUserEmail": "ththong@sk-global.biz",
  "allowUnauthenticatedIdentities": true,
  "autoVerifiedAttributes": ['email'],
  "mfaConfiguration": "OFF",
  "mfaTypes": ["SMS Text Message"],
  "smsAuthenticationMessage": "Your authentication code is {####}",
  "smsVerificationMessage": "Your verification code is {####}",
  "emailVerificationSubject": "Your verification code",
  "emailVerificationMessage": "Your verification code is {####}",
  "defaultPasswordPolicy": false,
  "passwordPolicyMinLength": 8,
  "passwordPolicyCharacters": [],
  "requiredAttributes": ["email"],
  "userpoolClientGenerateSecret": true,
  "userpoolClientRefreshTokenValidity": 7,
  "userpoolClientWriteAttributes": ["email"],
  "userpoolClientReadAttributes": ["email"],
  "userpoolClientSetAttributes": false,
  "usernameAttributes": ["email"],
  "hostedUIDomainName": "${self:service}",
  "authProvidersUserPool": ["COGNITO"],
  "hostedUIProviderCreds": [],
  "hostedUIProviderMeta": [
    {
      "ProviderName": "Facebook",
      "authorize_scopes": "email,public_profile",
      "AttributeMapping": {
        "email": "email",
        "username": "id",
        "custom:c_name": "name",
        "custom:c_avatar": "cover"
      }
    },
    {
      "ProviderName": "Google",
      "authorize_scopes": "openid email profile",
      "AttributeMapping": {
        "email": "email",
        "username": "sub",
        "custom:c_name": "name",
        "custom:c_avatar": "picture"
      }
    }
  ],
  "oAuthMetadata": {
    "AllowedOAuthFlows": ["code"],
    "AllowedOAuthScopes": ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"],
    "CallbackURLs": ["http://localhost:3000/user/signed-in/"],
    "LogoutURLs": ["http://localhost:3000/"]
  }
}

const jsonToStr = [
  "hostedUIProviderCreds",
  "hostedUIProviderMeta",
  "oAuthMetadata",
]

for (const key of jsonToStr) {
  config[key + 'String'] = JSON.stringify(config[key])
}

module.exports = serverless => config

import {
  ChangePasswordCommand,
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  UpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";
import { env } from "@repo/config";

export type CognitoConfig = {
  region: string;
  clientId: string;
};

export class Cognito {
  private client: CognitoIdentityProviderClient;

  constructor(public config: CognitoConfig) {
    this.client = new CognitoIdentityProviderClient({
      region: config.region,
    });
  }

  private calculateSecretHash(username: string): string {
    const clientSecret = env.cognito.clientSecret();
    return createHmac("SHA256", clientSecret)
      .update(username + this.config.clientId)
      .digest("base64");
  }

  async updateUserAttributes(params: {
    accessToken: string;
    userAttributes: Record<string, string>;
  }) {
    const attributes = Object.entries(params.userAttributes).map(
      ([Name, Value]) => ({
        Name,
        Value,
      })
    );

    return await this.client.send(
      new UpdateUserAttributesCommand({
        AccessToken: params.accessToken,
        UserAttributes: attributes,
      })
    );
  }

  async getUserAttributes(accessToken: string) {
    const { UserAttributes } = await this.client.send(
      new GetUserCommand({
        AccessToken: accessToken,
      })
    );

    const attributes: Record<string, string> = {};
    if (UserAttributes) {
      for (const attribute of UserAttributes) {
        if (attribute.Name && attribute.Value !== undefined) {
          attributes[attribute.Name] = attribute.Value;
        }
      }
    }
    return attributes;
  }

  async signIn(credentials: { username: string; password: string }) {
    const secretHash = this.calculateSecretHash(credentials.username);

    const { AuthenticationResult, ChallengeName, Session } = await this.client
      .send(
        new InitiateAuthCommand({
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: this.config.clientId,
          AuthParameters: {
            USERNAME: credentials.username,
            PASSWORD: credentials.password,
            SECRET_HASH: secretHash,
          },
        })
      )
      .catch((error) => {
        console.error("Error authenticating user: ", error);
        throw new Error(error.name);
      });

    if (ChallengeName === "NEW_PASSWORD_REQUIRED") {
      return {
        challengeName: ChallengeName,
        session: Session,
        username: credentials.username,
      };
    }

    if (!AuthenticationResult) {
      throw new Error("No authentication result");
    }

    const token = {
      accessToken: AuthenticationResult.AccessToken!,
      idToken: AuthenticationResult.IdToken!,
      refreshToken: AuthenticationResult.RefreshToken!,
      tokenType: "Bearer",
    };

    const user = await this.getUserAttributes(token.accessToken);

    return { token, user };
  }

  async completeNewPasswordChallenge({
    username,
    session,
    newPassword,
  }: {
    username: string;
    session: string;
    newPassword: string;
  }) {
    const secretHash = this.calculateSecretHash(username);

    const command = new RespondToAuthChallengeCommand({
      ClientId: this.config.clientId,
      ChallengeName: "NEW_PASSWORD_REQUIRED",
      Session: session,
      ChallengeResponses: {
        USERNAME: username,
        NEW_PASSWORD: newPassword,
        SECRET_HASH: secretHash,
      },
    });

    try {
      const response = await this.client.send(command);
      if (response.AuthenticationResult) {
        const token = {
          accessToken: response.AuthenticationResult.AccessToken!,
          idToken: response.AuthenticationResult.IdToken!,
          refreshToken: response.AuthenticationResult.RefreshToken!,
          tokenType: "Bearer",
        };

        const user = await this.getUserAttributes(token.accessToken);

        return {
          token,
          user,
        };
      }
      throw new Error("No authentication result in response");
    } catch (error) {
      console.error("Error completing new password challenge:", error);
      throw error;
    }
  }

  async forgotPassword(username: string) {
    const secretHash = this.calculateSecretHash(username);

    await this.client.send(
      new ForgotPasswordCommand({
        Username: username,
        ClientId: this.config.clientId,
        SecretHash: secretHash,
      })
    );
  }

  async resetPassword(params: {
    username: string;
    code: string;
    password: string;
  }) {
    const secretHash = this.calculateSecretHash(params.username);

    return await this.client.send(
      new ConfirmForgotPasswordCommand({
        Username: params.username,
        ConfirmationCode: params.code,
        Password: params.password,
        ClientId: this.config.clientId,
        SecretHash: secretHash,
      })
    );
  }

  async changePassword(params: {
    currentPassword: string;
    newPassword: string;
    accessToken: string;
  }) {
    return await this.client.send(
      new ChangePasswordCommand({
        PreviousPassword: params.currentPassword,
        ProposedPassword: params.newPassword,
        AccessToken: params.accessToken,
      })
    );
  }

  async refreshToken(params: { refreshToken: string; username: string }) {
    const secretHash = this.calculateSecretHash(params.username);

    const { AuthenticationResult } = await this.client
      .send(
        new InitiateAuthCommand({
          AuthFlow: "REFRESH_TOKEN_AUTH",
          ClientId: this.config.clientId,
          AuthParameters: {
            REFRESH_TOKEN: params.refreshToken,
            USERNAME: params.username,
            SECRET_HASH: secretHash,
          },
        })
      )
      .catch((error) => {
        console.error("Error refreshing token: ", error);
        throw new Error(error.name);
      });

    if (!AuthenticationResult) {
      throw new Error("No authentication result");
    }

    return {
      accessToken: AuthenticationResult.AccessToken!,
      idToken: AuthenticationResult.IdToken!,
    };
  }

  async updateUserAttributesAndGetTokens(params: {
    accessToken: string;
    userAttributes: Record<string, string>;
    refreshToken: string;
    username: string;
  }) {
    await this.updateUserAttributes({
      accessToken: params.accessToken,
      userAttributes: params.userAttributes,
    });

    const tokens = await this.refreshToken({
      refreshToken: params.refreshToken,
      username: params.username,
    });

    const user = await this.getUserAttributes(tokens.accessToken);

    return {
      tokens,
      user,
    };
  }
}

const getRegionFromIssuer = (issuer?: string): string => {
  if (issuer) {
    const match = issuer.match(/cognito-idp\.([^.]+)\.amazonaws\.com/);
    if (match) {
      return match[1];
    }
  }
  return env.cognito.region();
};

function getCognitoConfig() {
  const issuer = env.cognito.issuer();
  const cognitoRegion = issuer
    ? getRegionFromIssuer(issuer)
    : env.cognito.region();

  return {
    region: cognitoRegion,
    clientId: env.cognito.clientId(),
  };
}

let cognitoInstance: Cognito | null = null;

export function getCognito(): Cognito {
  if (!cognitoInstance) {
    const config = getCognitoConfig();
    cognitoInstance = new Cognito(config);
  }
  return cognitoInstance;
}

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getAuthOptions, getCognito, decodeCognitoToken } from "@repo/auth-ui";

export async function POST(request: Request) {
  const session = await getServerSession(getAuthOptions());

  if (!session?.accessToken || !session?.refreshToken || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { organizationId } = await request.json();

    if (!organizationId) {
      return NextResponse.json(
        { error: "organizationId is required" },
        { status: 400 }
      );
    }

    const cognito = getCognito();

    const { username } = session.idToken
      ? decodeCognitoToken(session.idToken)
      : { username: undefined };

    const { tokens } = await cognito.updateUserAttributesAndGetTokens({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      username: username ?? session.user.email,
      userAttributes: {
        "custom:currentOrganization": organizationId,
      },
    });

    return NextResponse.json({ success: true, tokens });
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 }
    );
  }
}

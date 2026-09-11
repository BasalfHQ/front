export enum Stage {
  DEV = "dev",
  PROD = "prod",
}

export enum EnvVar {
  COGNITO_CLIENT_ID = "COGNITO_CLIENT_ID",
  COGNITO_CLIENT_SECRET = "COGNITO_CLIENT_SECRET",
  COGNITO_ISSUER = "COGNITO_ISSUER",
  COGNITO_REGION = "COGNITO_REGION",
  NEXTAUTH_SECRET = "NEXTAUTH_SECRET",
  NEXTAUTH_URL = "NEXTAUTH_URL",
  AUTH_COOKIE_DOMAIN = "AUTH_COOKIE_DOMAIN",
  USER_MGT_BFF_URL = "USER_MGT_BFF_URL",
  CMS_MGT_BFF_URL = "CMS_MGT_BFF_URL",
  HOST_MGT_BFF_URL = "HOST_MGT_BFF_URL",
  SLOT_MGT_BFF_URL = "SLOT_MGT_BFF_URL",
  SLOT_MGT_BFF_LIB_URL = "SLOT_MGT_BFF_LIB_URL",
  BOOK_MGT_BFF_URL = "BOOK_MGT_BFF_URL",
  FILE_MGT_BFF_URL = "FILE_MGT_BFF_URL",
  MCP_API_URL = "MCP_API_URL",
}

const STAGE = (process.env.NEXT_PUBLIC_STAGE as Stage) || Stage.DEV;

function getEnv(name: EnvVar): string | undefined {
  return process.env[`BASALF_${STAGE.toUpperCase()}_${name}`];
}

// NEXT_PUBLIC_ vars must be a literal `process.env.NEXT_PUBLIC_X` member
// expression for Next.js to inline them into the client bundle at build
// time — a computed/templated key (as getEnv above uses) is invisible to
// that static replacement and stays undefined in the browser.
function publicFileDomain(): string | undefined {
  return STAGE === Stage.PROD
    ? process.env.NEXT_PUBLIC_BASALF_PROD_FILE_DOMAIN
    : process.env.NEXT_PUBLIC_BASALF_DEV_FILE_DOMAIN;
}

function publicMcpUrl(): string | undefined {
  return STAGE === Stage.PROD
    ? process.env.NEXT_PUBLIC_BASALF_PROD_MCP_URL
    : process.env.NEXT_PUBLIC_BASALF_DEV_MCP_URL;
}

function requireEnv(name: EnvVar): string {
  const value = getEnv(name);
  if (!value) {
    throw new Error(
      `BASALF_${STAGE.toUpperCase()}_${name} environment variable is required`,
    );
  }
  return value;
}

export const env = {
  stage: STAGE,
  cognito: {
    clientId: () => requireEnv(EnvVar.COGNITO_CLIENT_ID),
    clientSecret: () => requireEnv(EnvVar.COGNITO_CLIENT_SECRET),
    issuer: () => getEnv(EnvVar.COGNITO_ISSUER),
    region: () => getEnv(EnvVar.COGNITO_REGION) || "eu-central-1",
  },
  auth: {
    secret: () => requireEnv(EnvVar.NEXTAUTH_SECRET),
    url: () => getEnv(EnvVar.NEXTAUTH_URL),
    cookieDomain: () => getEnv(EnvVar.AUTH_COOKIE_DOMAIN),
  },
  api: {
    userMgtBffUrl: () => getEnv(EnvVar.USER_MGT_BFF_URL),
    cmsMgtBffUrl: () => getEnv(EnvVar.CMS_MGT_BFF_URL),
    hostMgtBffUrl: () => getEnv(EnvVar.HOST_MGT_BFF_URL),
    slotMgtBffUrl: () => getEnv(EnvVar.SLOT_MGT_BFF_URL),
    bookMgtBffUrl: () => getEnv(EnvVar.BOOK_MGT_BFF_URL),
    fileMgtBffUrl: () => getEnv(EnvVar.FILE_MGT_BFF_URL),
    mcpApiUrl: () => getEnv(EnvVar.MCP_API_URL),
  },
  fileDomain: () => publicFileDomain(),
  mcpUrl: () => publicMcpUrl(),
};

export const baseUrl =
  process.env.NEXT_PUBLIC_STAGE === "prod"
    ? "https://basalf.com/"
    : "http://localhost:3000/";

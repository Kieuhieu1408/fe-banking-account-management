export interface AuthResult {
    scope: string;
    access_token: string;
    expires_in?: number;
    refresh_expires_in?: number;
    refresh_token?: string;
    token_type?: string;
    "not-before-policy"?: number;
    session_state?: string;
}

export interface JWTPayload {
  scope: string;
  sub: string;
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  realm_access?: {
    roles: string[];
  };
  preferred_username?: string;
  name?: string;
  email?: string;
}
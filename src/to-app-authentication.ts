import jsonwebtoken from "jsonwebtoken";

export function toAppAuthentication(id: number, privateKey: string) {
  const now = Math.floor(Date.now() / 1000);
  const expiration = now + 60 * 10; // JWT expiration time (10 minute maximum)
  const payload = {
    iat: now, // Issued at time
    exp: expiration,
    iss: id
  };

  const JWT = jsonwebtoken.sign(payload, privateKey, {
    algorithm: "RS256"
  });

  return {
    type: "app",
    token: JWT,
    appId: id,
    expiration,
    headers: {
      authorization: `bearer ${JWT}`
    },
    query: {}
  };
}

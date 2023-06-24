export function validatePrivatekeyContent(privateKey: string) {
  // first check
  if (!privateKey.startsWith("----") && !privateKey.endsWith("----")) {
    return false;
  }

  // second check
  const pk: string[] = privateKey.trim().split(" ");
  if (pk.length > 1) {
    const protocol = pk[1];
    const begin = `-----BEGIN ${protocol} PRIVATE KEY-----`;
    const end = `-----END ${protocol} PRIVATE KEY----`;

    if (!(privateKey.includes(begin) && privateKey.includes(end))) {
      return false;
    }
  } else {
    // there is no whitespace inside private key content and still invalid
    return false;
  }

  return true;
}

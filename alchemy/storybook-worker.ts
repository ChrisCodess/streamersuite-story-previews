interface AssetBinding {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: AssetBinding;
  STORYBOOK_PASSWORD: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!isAuthorized(request, env.STORYBOOK_PASSWORD)) {
      return new Response("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="StreamerSuite Storybook"',
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};

function isAuthorized(request: Request, password: string): boolean {
  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Basic ")) {
    return false;
  }

  const decoded = decodeCredentials(authorization.slice("Basic ".length));

  if (!decoded) {
    return false;
  }

  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex === -1) {
    return false;
  }

  return secureEqual(decoded.slice(separatorIndex + 1), password);
}

function decodeCredentials(value: string): string | undefined {
  try {
    return atob(value);
  } catch {
    return undefined;
  }
}

function secureEqual(left: string, right: string): boolean {
  let mismatch = left.length ^ right.length;
  const length = Math.max(left.length, right.length);

  for (let index = 0; index < length; index++) {
    mismatch |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return mismatch === 0;
}

/**
 * Salesforce OAuth 2.0 refresh-token auth + query helper.
 *
 * Env vars required:
 *   SF_CLIENT_ID, SF_CLIENT_SECRET, SF_REFRESH_TOKEN
 * Optional:
 *   SF_INSTANCE_URL (default: https://openexchange.my.salesforce.com)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TokenCache {
  accessToken: string;
  expiresAt: number; // epoch ms
}

interface SFQueryResponse {
  totalSize: number;
  done: boolean;
  records: Record<string, unknown>[];
  nextRecordsUrl?: string;
}

// ---------------------------------------------------------------------------
// In-memory token cache
// ---------------------------------------------------------------------------

let cachedToken: TokenCache | null = null;

function getInstanceUrl(): string {
  return (
    process.env.SF_INSTANCE_URL || 'https://openexchange.my.salesforce.com'
  );
}

// ---------------------------------------------------------------------------
// getAccessToken — refresh-token OAuth 2.0 flow with auto-cache
// ---------------------------------------------------------------------------

export async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60 s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.SF_CLIENT_ID;
  const clientSecret = process.env.SF_CLIENT_SECRET;
  const refreshToken = process.env.SF_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    const missing: string[] = [];
    if (!clientId) missing.push('SF_CLIENT_ID');
    if (!clientSecret) missing.push('SF_CLIENT_SECRET');
    if (!refreshToken) missing.push('SF_REFRESH_TOKEN');
    throw new Error(
      `Missing Salesforce env vars: ${missing.join(', ')}. ` +
        'Configure them in .env.local or Vercel project settings.',
    );
  }

  const instanceUrl = getInstanceUrl();
  const tokenUrl = `${instanceUrl}/services/oauth2/token`;

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Salesforce token refresh failed (${res.status}): ${text}`,
    );
  }

  const data = await res.json();
  const accessToken: string = data.access_token;

  // SF tokens issued via refresh_token flow last ~2 hours by default.
  // `issued_at` is epoch-ms string; we add 2 h as conservative TTL.
  const issuedAt = Number(data.issued_at) || Date.now();
  const ttlMs = 2 * 60 * 60 * 1000; // 2 hours

  cachedToken = {
    accessToken,
    expiresAt: issuedAt + ttlMs,
  };

  return accessToken;
}

// ---------------------------------------------------------------------------
// querySalesforce — execute SOQL with automatic pagination
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function querySalesforce<T = Record<string, unknown>>(
  soql: string,
): Promise<T[]> {
  const accessToken = await getAccessToken();
  const instanceUrl = getInstanceUrl();

  const initialUrl = `${instanceUrl}/services/data/v60.0/query?q=${encodeURIComponent(soql)}`;

  const res = await fetch(initialUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();

    // If 401 (expired/invalid token), clear cache so next call retries
    if (res.status === 401) {
      cachedToken = null;
    }

    throw new Error(`Salesforce query failed (${res.status}): ${text}`);
  }

  const data: SFQueryResponse = await res.json();
  const records = (data.records ?? []) as T[];

  // Paginate through nextRecordsUrl
  let nextUrl: string | null = data.nextRecordsUrl ?? null;
  while (nextUrl) {
    const nextRes = await fetch(`${instanceUrl}${nextUrl}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!nextRes.ok) break;
    const nextData: SFQueryResponse = await nextRes.json();
    records.push(...((nextData.records ?? []) as T[]));
    nextUrl = nextData.nextRecordsUrl ?? null;
  }

  return records;
}

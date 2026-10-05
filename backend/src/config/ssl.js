import fs from 'node:fs';

/**
 * Shared MySQL TLS options for hosted databases (Aiven / TiDB / Clever Cloud …).
 *
 * Set on Render:
 *   DB_SSL=true
 *   DB_SSL_CA="-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n"
 *     (paste the provider's CA cert; newlines may be written as \n)
 *
 * If DB_SSL_CA is omitted, the connection is encrypted but the certificate is
 * not verified — acceptable for a demo, but always prefer pinning the CA.
 */
export function dbSslOptions() {
  if (process.env.DB_SSL !== 'true') return undefined;

  const rawCa = process.env.DB_SSL_CA;
  if (rawCa) {
    const ca = rawCa.includes('BEGIN CERTIFICATE') ? rawCa.replace(/\\n/g, '\n') : fs.readFileSync(rawCa, 'utf8');
    return { ca, rejectUnauthorized: true };
  }
  return { rejectUnauthorized: false };
}

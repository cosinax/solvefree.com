"use client";
import { useState, useEffect } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + (4 - str.length % 4) % 4, "=");
  try { return atob(padded); } catch { return ""; }
}

function parseJwt(token: string): { header: object | null; payload: object | null; error: string } {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return { header: null, payload: null, error: "Invalid JWT: must have 3 parts separated by dots." };
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return { header, payload, error: "" };
  } catch {
    return { header: null, payload: null, error: "Failed to decode JWT. Check the token format." };
  }
}

export default function JwtDecoderPage() {
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
  const { header, payload, error } = parseJwt(token);
  const now = Math.floor(Date.now() / 1000);
  const p = payload as Record<string, unknown> | null;
  const exp = p?.exp as number | undefined;
  const iat = p?.iat as number | undefined;
  const nbf = p?.nbf as number | undefined;
  const isExpired = exp ? now > exp : false;

  return (
    <CalculatorShell title="JWT Decoder" description="Decode and inspect JSON Web Tokens (JWT). Signature is NOT verified — for inspection only.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">JWT Token</label>
          <textarea value={token} onChange={e => setToken(e.target.value)} rows={4}
            className="w-full px-4 py-3 font-mono text-xs bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
        </div>
        {error && <div className="px-4 py-3 bg-red-50 dark:bg-red-950 rounded-lg text-danger text-sm">{error}</div>}
        {header && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Header</span>
              <span className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded font-mono">{(header as Record<string, string>).alg}</span>
            </div>
            <pre className="px-4 py-3 bg-background border border-card-border rounded-lg text-xs font-mono overflow-x-auto">{JSON.stringify(header, null, 2)}</pre>
          </div>
        )}
        {payload && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Payload</span>
              {isExpired && <span className="text-xs px-2 py-0.5 bg-red-50 dark:bg-red-950 text-danger rounded font-medium">⚠️ Expired</span>}
              {!isExpired && exp && <span className="text-xs px-2 py-0.5 bg-green-50 dark:bg-green-950 text-success rounded font-medium">✓ Valid</span>}
            </div>
            <pre className="px-4 py-3 bg-background border border-card-border rounded-lg text-xs font-mono overflow-x-auto">{JSON.stringify(payload, null, 2)}</pre>
            {(exp || iat || nbf) && (
              <div className="mt-2 space-y-1">
                {iat && <div className="flex justify-between text-xs px-3 py-1.5 bg-background border border-card-border rounded"><span className="text-muted">Issued at (iat)</span><span className="font-mono">{new Date(iat * 1000).toLocaleString()}</span></div>}
                {nbf && <div className="flex justify-between text-xs px-3 py-1.5 bg-background border border-card-border rounded"><span className="text-muted">Not before (nbf)</span><span className="font-mono">{new Date(nbf * 1000).toLocaleString()}</span></div>}
                {exp && <div className={`flex justify-between text-xs px-3 py-1.5 rounded ${isExpired ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 border" : "bg-background border border-card-border"}`}><span className="text-muted">Expires (exp)</span><span className="font-mono">{new Date(exp * 1000).toLocaleString()}</span></div>}
              </div>
            )}
          </div>
        )}
        <div className="text-xs px-4 py-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          ⚠️ <strong>Signature not verified.</strong> This tool only decodes the token for inspection. Anyone can decode JWTs — never put sensitive data in the payload.
        </div>
      </div>
    </CalculatorShell>
  );
}

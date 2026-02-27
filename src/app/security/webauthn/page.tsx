"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useState } from "react";

type Status = "idle" | "pending" | "success" | "error";

function base64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function formatCredential(cred: PublicKeyCredential): Record<string, unknown> {
  const resp = cred.response as AuthenticatorAttestationResponse | AuthenticatorAssertionResponse;
  const isAttestation = "attestationObject" in resp;
  return {
    id: cred.id,
    type: cred.type,
    response: isAttestation
      ? {
          clientDataJSON: base64url((resp as AuthenticatorAttestationResponse).clientDataJSON),
          attestationObject: base64url((resp as AuthenticatorAttestationResponse).attestationObject),
        }
      : {
          clientDataJSON: base64url((resp as AuthenticatorAssertionResponse).clientDataJSON),
          authenticatorData: base64url((resp as AuthenticatorAssertionResponse).authenticatorData),
          signature: base64url((resp as AuthenticatorAssertionResponse).signature),
          userHandle: (resp as AuthenticatorAssertionResponse).userHandle
            ? base64url((resp as AuthenticatorAssertionResponse).userHandle!)
            : null,
        },
  };
}

function parseClientDataJSON(b64: string): Record<string, unknown> | null {
  try {
    const json = atob(b64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const btn =
  "px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const primaryBtn = `${btn} bg-primary text-white hover:bg-primary/90`;

export default function WebAuthnPage() {
  const [regStatus, setRegStatus] = useState<Status>("idle");
  const [regResult, setRegResult] = useState<Record<string, unknown> | null>(null);
  const [regError, setRegError] = useState<string>("");
  const [storedCredId, setStoredCredId] = useState<string>("");

  const [authStatus, setAuthStatus] = useState<Status>("idle");
  const [authResult, setAuthResult] = useState<Record<string, unknown> | null>(null);
  const [authError, setAuthError] = useState<string>("");

  const [username, setUsername] = useState("test-user");

  async function register() {
    setRegStatus("pending");
    setRegResult(null);
    setRegError("");
    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const userId = crypto.getRandomValues(new Uint8Array(16));

      const cred = (await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "SolveFree WebAuthn Test", id: window.location.hostname },
          user: {
            id: userId,
            name: username || "test-user",
            displayName: username || "Test User",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },   // ES256
            { type: "public-key", alg: -257 },  // RS256
          ],
          authenticatorSelection: {
            residentKey: "preferred",
            userVerification: "preferred",
          },
          timeout: 60000,
          attestation: "none",
        },
      })) as PublicKeyCredential | null;

      if (!cred) throw new Error("No credential returned");

      const formatted = formatCredential(cred);
      setStoredCredId(cred.id);
      setRegResult(formatted);
      setRegStatus("success");
    } catch (e: unknown) {
      setRegStatus("error");
      setRegError(e instanceof Error ? e.message : String(e));
    }
  }

  async function authenticate() {
    setAuthStatus("pending");
    setAuthResult(null);
    setAuthError("");
    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const opts: PublicKeyCredentialRequestOptions = {
        challenge,
        timeout: 60000,
        userVerification: "preferred",
        rpId: window.location.hostname,
      };
      if (storedCredId) {
        opts.allowCredentials = [{ id: Uint8Array.from(atob(storedCredId.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0)), type: "public-key" }];
      }

      const cred = (await navigator.credentials.get({ publicKey: opts })) as PublicKeyCredential | null;
      if (!cred) throw new Error("No credential returned");

      const formatted = formatCredential(cred);
      setAuthResult(formatted);
      setAuthStatus("success");
    } catch (e: unknown) {
      setAuthStatus("error");
      setAuthError(e instanceof Error ? e.message : String(e));
    }
  }

  const supported = typeof window !== "undefined" && !!window.PublicKeyCredential;

  const statusBadge = (s: Status, ok: string) =>
    s === "pending" ? (
      <span className="text-xs text-muted">Working…</span>
    ) : s === "success" ? (
      <span className="text-xs text-green-600 font-medium">{ok}</span>
    ) : s === "error" ? (
      <span className="text-xs text-red-500 font-medium">Failed</span>
    ) : null;

  return (
    <CalculatorShell
      title="WebAuthn Tester"
      description="Test passkey registration and authentication in your browser using the WebAuthn API."
    >
      {!supported && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          WebAuthn is not supported in this browser or requires HTTPS.
        </div>
      )}

      {/* Username */}
      <div className="mb-6">
        <label className="block text-xs text-muted mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          placeholder="test-user"
        />
        <p className="text-xs text-muted mt-1">Used as the WebAuthn user.name field. No data leaves your browser.</p>
      </div>

      {/* Registration */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">1. Register a Passkey</h2>
          {statusBadge(regStatus, "Registered ✓")}
        </div>
        <button onClick={register} disabled={!supported || regStatus === "pending"} className={primaryBtn}>
          {regStatus === "pending" ? "Waiting for authenticator…" : "Register"}
        </button>
        <p className="text-xs text-muted mt-2">
          Creates a new credential using your device authenticator (Face ID, Touch ID, Windows Hello, security key, etc.)
        </p>

        {regError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-mono break-all">
            {regError}
          </div>
        )}

        {regResult && (
          <div className="mt-3 space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-xs font-semibold text-green-800 mb-1">Credential ID</div>
              <div className="text-xs font-mono break-all text-green-700">{regResult.id as string}</div>
            </div>
            {(() => {
              const resp = regResult.response as { clientDataJSON?: string };
              const parsed = resp?.clientDataJSON ? parseClientDataJSON(resp.clientDataJSON) : null;
              return parsed ? (
                <div className="p-3 bg-card border border-card-border rounded-lg">
                  <div className="text-xs font-semibold mb-1">clientDataJSON (decoded)</div>
                  <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
                    {JSON.stringify(parsed, null, 2)}
                  </pre>
                </div>
              ) : null;
            })()}
            <details className="text-xs">
              <summary className="cursor-pointer text-muted hover:text-foreground">Raw credential (base64url)</summary>
              <pre className="mt-2 p-3 bg-card border border-card-border rounded-lg overflow-x-auto whitespace-pre-wrap break-all font-mono">
                {JSON.stringify(regResult, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </section>

      {/* Authentication */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">2. Authenticate</h2>
          {statusBadge(authStatus, "Authenticated ✓")}
        </div>
        <button onClick={authenticate} disabled={!supported || authStatus === "pending"} className={primaryBtn}>
          {authStatus === "pending" ? "Waiting for authenticator…" : "Authenticate"}
        </button>
        <p className="text-xs text-muted mt-2">
          {storedCredId
            ? "Uses the credential registered above. Your authenticator will verify your identity."
            : "No credential registered yet — will prompt for any available passkey on this device."}
        </p>

        {authError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-mono break-all">
            {authError}
          </div>
        )}

        {authResult && (
          <div className="mt-3 space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-xs font-semibold text-green-800 mb-1">Authentication succeeded</div>
              <div className="text-xs text-green-700">Credential ID: <span className="font-mono break-all">{authResult.id as string}</span></div>
            </div>
            {(() => {
              const resp = authResult.response as { clientDataJSON?: string };
              const parsed = resp?.clientDataJSON ? parseClientDataJSON(resp.clientDataJSON) : null;
              return parsed ? (
                <div className="p-3 bg-card border border-card-border rounded-lg">
                  <div className="text-xs font-semibold mb-1">clientDataJSON (decoded)</div>
                  <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
                    {JSON.stringify(parsed, null, 2)}
                  </pre>
                </div>
              ) : null;
            })()}
            <details className="text-xs">
              <summary className="cursor-pointer text-muted hover:text-foreground">Raw assertion (base64url)</summary>
              <pre className="mt-2 p-3 bg-card border border-card-border rounded-lg overflow-x-auto whitespace-pre-wrap break-all font-mono">
                {JSON.stringify(authResult, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </section>

      {/* Info */}
      <div className="mt-8 pt-6 border-t border-card-border text-xs text-muted space-y-1">
        <p><strong>Privacy:</strong> Everything runs in your browser. No credentials, keys, or user data are sent to any server.</p>
        <p><strong>Note:</strong> WebAuthn requires HTTPS (or localhost). Credentials registered here are scoped to this origin and cannot be used elsewhere.</p>
      </div>
    </CalculatorShell>
  );
}

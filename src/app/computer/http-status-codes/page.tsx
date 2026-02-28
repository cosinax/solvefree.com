"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const statusCodes = [
  // 1xx
  { code: 100, name: "Continue", desc: "Server received request headers, client should proceed" },
  { code: 101, name: "Switching Protocols", desc: "Server is switching protocols (e.g. to WebSocket)" },
  // 2xx
  { code: 200, name: "OK", desc: "Request succeeded" },
  { code: 201, name: "Created", desc: "Request succeeded and resource was created" },
  { code: 202, name: "Accepted", desc: "Request accepted but not yet processed" },
  { code: 204, name: "No Content", desc: "Request succeeded, no body returned" },
  { code: 206, name: "Partial Content", desc: "Partial resource returned (range request)" },
  // 3xx
  { code: 301, name: "Moved Permanently", desc: "Resource has permanently moved to new URL" },
  { code: 302, name: "Found", desc: "Temporary redirect to another URL" },
  { code: 303, name: "See Other", desc: "Redirect to another URL using GET" },
  { code: 304, name: "Not Modified", desc: "Cached version is still valid (ETag/If-Modified-Since)" },
  { code: 307, name: "Temporary Redirect", desc: "Temporary redirect, preserve method" },
  { code: 308, name: "Permanent Redirect", desc: "Permanent redirect, preserve method" },
  // 4xx
  { code: 400, name: "Bad Request", desc: "Request is malformed or invalid" },
  { code: 401, name: "Unauthorized", desc: "Authentication required or failed" },
  { code: 403, name: "Forbidden", desc: "Server refuses to authorize the request" },
  { code: 404, name: "Not Found", desc: "Resource not found" },
  { code: 405, name: "Method Not Allowed", desc: "HTTP method not supported for this resource" },
  { code: 408, name: "Request Timeout", desc: "Client took too long to send the request" },
  { code: 409, name: "Conflict", desc: "Request conflicts with current resource state" },
  { code: 410, name: "Gone", desc: "Resource has been permanently deleted" },
  { code: 413, name: "Content Too Large", desc: "Request body exceeds server limit" },
  { code: 414, name: "URI Too Long", desc: "Request URI is too long" },
  { code: 415, name: "Unsupported Media Type", desc: "Content type not supported" },
  { code: 422, name: "Unprocessable Entity", desc: "Semantic error in request body (WebDAV / REST)" },
  { code: 429, name: "Too Many Requests", desc: "Rate limit exceeded" },
  // 5xx
  { code: 500, name: "Internal Server Error", desc: "Unexpected server error" },
  { code: 501, name: "Not Implemented", desc: "Server doesn't support the request method" },
  { code: 502, name: "Bad Gateway", desc: "Upstream server returned invalid response" },
  { code: 503, name: "Service Unavailable", desc: "Server is down or overloaded" },
  { code: 504, name: "Gateway Timeout", desc: "Upstream server did not respond in time" },
  { code: 505, name: "HTTP Version Not Supported", desc: "Server doesn't support the HTTP version" },
];

const groupColor: Record<number, string> = {
  1: "text-blue-500",
  2: "text-green-600 dark:text-green-400",
  3: "text-yellow-600 dark:text-yellow-400",
  4: "text-orange-600 dark:text-orange-400",
  5: "text-red-600 dark:text-red-400",
};

const groupBg: Record<number, string> = {
  1: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  2: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  3: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
  4: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
  5: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
};

const groupLabel: Record<number, string> = {
  1: "1xx Informational",
  2: "2xx Success",
  3: "3xx Redirection",
  4: "4xx Client Error",
  5: "5xx Server Error",
};

export default function HttpStatusCodesPage() {
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<number | null>(null);

  const filtered = statusCodes.filter(s => {
    if (activeGroup !== null && Math.floor(s.code / 100) !== activeGroup) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.code.toString().includes(q) || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <CalculatorShell title="HTTP Status Codes" description="Quick reference for all HTTP response status codes.">
      <div className="space-y-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by code, name, or description..."
          className="w-full px-3 py-2 text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="flex flex-wrap gap-1">
          {[null, 1, 2, 3, 4, 5].map(g => (
            <button key={String(g)} onClick={() => setActiveGroup(g === activeGroup ? null : g)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${activeGroup === g ? "bg-primary text-white border-primary" : "bg-background border-card-border hover:bg-primary-light"}`}>
              {g === null ? "All" : groupLabel[g]}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          {filtered.map(s => {
            const grp = Math.floor(s.code / 100);
            return (
              <div key={s.code} className={`px-4 py-3 rounded-lg border ${groupBg[grp]}`}>
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono font-bold text-base ${groupColor[grp]}`}>{s.code}</span>
                  <span className="font-semibold text-sm">{s.name}</span>
                </div>
                <p className="text-xs text-muted mt-0.5">{s.desc}</p>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-sm text-muted text-center py-4">No status codes match your search.</p>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}

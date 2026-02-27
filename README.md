# SolveFree.com

A free, open-source collection of 150+ calculators and tools — built for everyone, without ads or tracking.

## What it is

SolveFree is a fast, privacy-respecting toolkit covering everyday calculations across math, finance, health, unit conversions, networking, security, programming, and more. Every tool runs entirely in the browser — no data is ever sent to a server.

- **No ads.** No banners, no popups, no sponsored results.
- **No tracking.** No analytics, no cookies, no fingerprinting.
- **No accounts.** Nothing to sign up for, nothing to log in to.
- **Shareable.** Tool state is stored in the URL hash so you can share results directly.

## Why it exists

The internet is full of calculator sites that bury the tool under ads and harvest user data. SolveFree exists to prove that useful, well-made tools can be provided freely without those trade-offs. The intent is to use AI for good — to build things that genuinely help people without exploiting them.

This entire website was built using [Claude Code](https://claude.ai/code) by Anthropic.

## Stack

- [Next.js 14](https://nextjs.org) (App Router, static export)
- TypeScript
- Tailwind CSS
- 100% client-side — no backend required

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Building

```bash
npm run build
```

Outputs a fully static site to `/out`.

## Contributing

PRs welcome. If you find a calculation that's wrong or a tool that's missing, open an issue.

## License

MIT

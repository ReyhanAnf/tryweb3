# Advanced Degen Meme Coin Analysis System

A private, client-side, decision-support system for analyzing meme coins with deterministic risk scoring and AI auditing.

**Core Philosophy**: "Token = Guilty Until Proven Otherwise"

## Features
- **Deterministic Risk Scoring**: Weighted checklists (Liquidity, Contract, Holders, etc.)
- **Token Identity & Verification**: Detailed metadata input with dynamic inline verification tools (DexScreener, Honeypot.is, etc.).
- **AI Analysis**: Primary AI (Skeptical) + Secondary AI (Auditor) utilizing Token Identity context.
- **Static Architecture**: Deployable to GitHub Pages (`output: export`)
- **Privacy First**: No backend. Data stored in `IndexedDB`. API Key via Environment Variable.
- **Security**: Local password protection (PBKDF2/SHA-256).

## Setup & Run

### Prerequisites
- [Bun](https://bun.sh) (Required)
- OpenAI API Key (Set in local `.env` as `NEXT_PUBLIC_OPENAI_API_KEY`)

### Installation
```bash
bun install
```

### Development
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000).

### Build for Production (GitHub Pages)
```bash
bun run build
```
The output will be in the `out/` directory.

## Configuration

### Password Setup
The default password hash corresponds to an unknown value (security by obscurity in this template, BUT YOU MUST CHANGE IT).
The default `validHash` in `lib/auth.ts` is currently a placeholder.

**To set your own password:**
1. Open the browser console on the Login page.
2. Enter your desired password in the "Passphrase" field.
3. Click "Initialize Session".
4. Check the console logs for "Computed Hash for input: ...".
5. Copy that hash string.
6. Update `lib/auth.ts`:
   ```typescript
   storedHash: "YOUR_COPIED_HASH",
   ```

### Risk Thresholds
Edit `config/risk.ts` to adjust:
- High/Medium Risk Score Thresholds
- Severity Multipliers

### Checklists
Add or remove checks in `data/checklists/index.ts`.

## Architecture
- **Tech**: Next.js 16 (App Router), TailwindCSS, Shadcn UI Concepts.
- **State**: React State + IndexedDB (`idb`).
- **Auth**: PBKDF2 Hashing (Web Crypto API).
- **AI**: Direct Client-to-OpenAI fetch.

## License
Private Use Only.

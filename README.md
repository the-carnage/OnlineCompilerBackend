# Backend — Online Compiler

Brief: lightweight Express backend that compiles/runs code for supported languages and returns stdout/stderr.

Prerequisites

- Node.js (16+)
- Python 3 (for `python` execution)
- g++ (for `cpp` compilation)

Install

```bash
cd backend
npm install
```

Run (development)

```bash
npm start
# starts nodemon which runs index.js (server listens on port 3000)
```

API

- POST /compile/:language
  - Body (JSON): { "code": "...", "input": "..." }
  - Supported : `python`, `cpp`, `javascript`
  - Response: { "stdout": "...", "stderr": "..." }

Files

- `index.js` — main Express server and execution logic
- `main.py`, `main.cpp`, `main.js` — temporary files written at runtime

Notes

- This server executes arbitrary code — do NOT use in production without sandboxing.
- Ensure required language runtimes and compilers are installed and available in PATH.

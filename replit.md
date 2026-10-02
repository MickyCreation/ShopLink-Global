# ShopLink

ShopLink is an imported React 19 / TypeScript marketplace demo using Vite 8 and Tailwind CSS 4. Keep the existing source structure and stack.

## Running on Replit

- Use the **Start application** workflow (the Run button), which runs `npm run dev`.
- Vite serves on `0.0.0.0:5000`, with proxied hosts allowed for Replit Preview.
- Node.js 20.19+ is required; the configured Node.js 20 module is compatible.
- Dependencies are tracked in `package.json` and `package-lock.json`. On a fresh checkout, install them with `npm ci`.
- Run `npm run lint` for the TypeScript check and `npm run build` for a production build.

## Demo limitations

The app currently uses mock authentication, products, orders, shopping requests, chat, and notifications. Running it does not connect a live marketplace, payment service, or persistent backend.

No secrets or external services are required for the current demo. The environment example and Gemini dependency are not used by the current source code. Do not expose API keys in frontend code when adding integrations.
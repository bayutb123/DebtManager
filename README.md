# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# Debt & Receivable Manager (Frontend)

Modern React + TypeScript app for tracking debts, receivables, contacts, and payments. Uses mock-friendly architecture now, wired for real backend integration (Google OAuth → JWT, REST API layer).

## Stack
- Vite, React 19, TypeScript
- React Router, TanStack Query, Zustand
- Tailwind CSS (with custom theme), lightweight UI kit
- React Hook Form + Zod
- Recharts
- Google OAuth (@react-oauth/google)
- Firebase SDK (initialized, optional analytics)

## Getting started
```bash
npm install
cp .env.example .env   # fill in values below
npm run dev
```

### Required env vars
- `VITE_GOOGLE_CLIENT_ID` — your Web OAuth client ID (Google/Firebase console)
- `VITE_API_BASE_URL` — backend base URL (e.g., http://localhost:8080)
- Firebase (optional analytics): `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`

### Auth flow
1. Google Sign-In returns `idToken`.
2. Frontend POST `/auth/google` with `{ idToken }`.
3. Backend returns `{ token, user }`; we store both in Zustand (persisted).
4. All subsequent calls send `Authorization: Bearer <token>`. On 401 → logout + redirect to /login.

### API endpoints used
- `/contacts` CRUD
- `/debts` CRUD, `/debts/{id}/payment`
- `/receivables` CRUD, `/receivables/{id}/payment`
- `/transactions`
- `/dashboard/summary`

### Key paths
- App shell: `src/app/App.tsx`, routes `src/router`
- Layout: `src/layout/PrimaryLayout.tsx`
- Features: `src/features/*` (auth, debts, receivables, contacts, dashboard)
- API client: `src/services/api/client.ts`
- Forms: `src/features/*/components/*Form.tsx`
- Styling: `src/index.css`, `tailwind.config.js`

### Data & UI notes
- Currency: IDR with thousand separators (`formatCurrency`).
- When no contacts exist, add-debt/receivable forms prompt to create a contact first.
- Charts show current totals and recent transactions from backend.

### Scripts
- `npm run dev` — start dev server
- `npm run build` — type-check + production build
- `npm run preview` — preview built app

## Ready for backend swap
All feature services call the REST API; mocks have been removed. Replace base URL/env as needed; schema matches the provided integration guide. Optimistic updates refresh via TanStack Query invalidations.

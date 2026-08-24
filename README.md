# Xervices Pro — Artisan App

[![Expo](https://img.shields.io/badge/Expo-54-000?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb?logo=react)](https://reactnative.dev)
[![New Architecture](https://img.shields.io/badge/New%20Arch-enabled-success)](https://reactnative.dev/docs/the-new-architecture/landing-page)
[![Edge to Edge](https://img.shields.io/badge/Edge--to--Edge-enabled-success)](#)

Mobile app for **artisans** (service providers) on the Xervices marketplace. Artisans onboard, get matched to nearby service requests, send offers, complete jobs, chat with customers, and withdraw escrow-secured earnings.

- **Platforms:** iOS, Android, Web (Expo Router static export)
- **Bundle id:** `com.xervices.artisan` (with `.dev` and `.preview` flavors)
- **Companion document:** [USER_STORIES.md](USER_STORIES.md) — full feature catalogue.

---

## Table of contents

- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environments & configuration](#environments--configuration)
- [Scripts](#scripts)
- [API integration](#api-integration)
- [State, sockets & background tasks](#state-sockets--background-tasks)
- [UI system](#ui-system)
- [Builds & releases (EAS)](#builds--releases-eas)
- [Push notifications](#push-notifications)
- [Adding components](#adding-components)
- [Conventions](#conventions)
- [Troubleshooting](#troubleshooting)

---

## Highlights

- ⚛️ **Expo Router** file-based routing with route groups (`(tabs)`, `(home)`).
- 🛒 Real-time marketplace: nearby service requests, offers, counter-offers, jobs.
- 💬 In-app chat with text, image, and voice notes (sockets via `socket.io-client`).
- 📍 Background location tracking (`expo-location` + `expo-task-manager`) with consent disclosure.
- 💸 Wallet, transaction history, bank accounts, withdrawals, promo codes, referrals.
- 🛡️ Auth flows: email/phone login, OTP email + device verification, Apple Sign-In, transaction PIN.
- 🔔 Push notifications (Expo + FCM) plus in-app notification feed.
- 🎨 NativeWind (Tailwind v3) + React Native Reusables UI, custom Cabinet Grotesk typography.
- 🧰 Type-safe API client (`openapi-fetch`) generated from the staging OpenAPI schema.

---

## Tech stack

| Layer | Library |
| --- | --- |
| Framework | [Expo 54](https://expo.dev), React Native 0.81, React 19 |
| Routing | [Expo Router 6](https://docs.expo.dev/router/introduction/) |
| Styling | [NativeWind 4](https://www.nativewind.dev/) + Tailwind CSS 3 |
| UI primitives | [`@rn-primitives/*`](https://rnprimitives.com/) + [React Native Reusables](https://github.com/founded-labs/react-native-reusables) |
| Forms & validation | [`@tanstack/react-form`](https://tanstack.com/form) + [`zod`](https://zod.dev) v4 |
| Server state | [`@tanstack/react-query`](https://tanstack.com/query) v5 |
| HTTP / types | [`openapi-fetch`](https://openapi-ts.dev/openapi-fetch/) + generated `api/schema.ts` |
| Local state | [`zustand`](https://zustand-demo.pmnd.rs/) persisted via `expo-sqlite/kv-store` |
| Sockets | [`socket.io-client`](https://socket.io) |
| Maps | `react-native-maps` + Google Maps SDK |
| Media | `expo-image`, `expo-image-picker`, `expo-camera`, `expo-audio`, `expo-video` |
| Sheets | `@gorhom/bottom-sheet`, `react-native-actions-sheet` |
| Notifications | `expo-notifications` (Expo push + FCM credentials per env) |
| Animations | `react-native-reanimated` v4, `react-native-worklets` |
| Toasts | `sonner-native` |

---

## Project structure

```
artisan-app/
├── app/                       # Expo Router routes (file-based)
│   ├── _layout.tsx            # Root: providers, splash, guard stacks
│   ├── (tabs)/                # Authenticated tabs (home, jobs, earnings, profile)
│   ├── verify/                # NIN / artisan verification flow
│   ├── login.tsx, register.tsx, verify-email.tsx, verify-device.tsx,
│   ├── forgot-password*.tsx, new-password.tsx,
│   ├── become-artisan.tsx, onboarding.tsx,
│   ├── chat.tsx, ongoing.tsx, dispute.tsx, rate.tsx,
│   ├── terms.tsx, privacy.tsx, +not-found.tsx, +html.tsx
├── api/                       # openapi-fetch client + typed endpoints
│   ├── client.ts              # public & authenticated clients
│   ├── index.ts               # `api.*` query/mutation factories
│   ├── helpers.ts             # error normalization & toast helpers
│   ├── token-storage.ts       # access / refresh token persistence
│   └── schema.ts              # generated OpenAPI types
├── components/
│   ├── ui/                    # Reusable primitives (Button, Input, Select, …)
│   ├── home/, earnings/, profile/, screens/, sheets/
│   ├── layout.tsx, auth-header.tsx, html-content.tsx, …
├── hooks/                     # Sockets, timers, background location
├── lib/                       # utils, theme, socket factory, permission helpers
├── providers/                 # Query, Notification, Marketplace, NotificationSocket
├── store/                     # zustand stores (auth, data, location-consent)
├── assets/                    # images, icons (SVG), fonts (Cabinet Grotesk)
├── app.config.ts              # Expo config (per-env credentials)
├── eas.json                   # EAS build / submit profiles
├── orval.config.ts, metro.config.js, babel.config.js, tailwind.config.js
├── location-task.ts           # Expo TaskManager background location task
├── global.css                 # Tailwind layer entry
└── USER_STORIES.md            # Functional spec derived from the codebase
```

---

## Getting started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) (the lockfile is `pnpm-lock.yaml`)
- macOS with Xcode for iOS, or Android Studio for Android — or run a dev client on a physical device.
- An Expo account on the `xervices` org with access to project `xervices-pro` (EAS project id in `app.config.ts`).

### Install & run

```bash
pnpm install

# Start the dev server (Expo)
pnpm dev          # = expo start
npx expo start --dev-client --ios

# Start with cache cleared
pnpm start        # = expo start -c

# Launch a specific platform
pnpm ios
pnpm android
pnpm web
```

Because this app uses native modules (camera, audio, background location, FCM, maps), Expo Go is **not** sufficient — you must use a **dev client build** (see [Builds & releases](#builds--releases-eas)).

### Regenerate API types

```bash
pnpm generate:schema
# Pulls from https://staging-api.getxervices.com/api/docs-json -> api/schema.ts
```

---

## Environments & configuration

The app supports three environments, each with its own bundle id, scheme, Firebase services file, and Google Maps key. Selection is driven by the `APP_ENV` env var (read in `app.config.ts`).

| `APP_ENV`     | App name                | Bundle id / Package name           | Scheme              | Google Services file              |
| ------------- | ----------------------- | ---------------------------------- | ------------------- | --------------------------------- |
| `development` | Xervices Pro Development | `com.xervices.artisan.dev`         | `xervices-pro-dev`  | `dev-google-services.json`        |
| `preview`     | Xervices Pro Preview     | `com.xervices.artisan.preview`     | `xervices-pro-prev` | `preview-google-services.json`    |
| `production`  | Xervices Pro             | `com.xervices.artisan`             | `xervices-pro`      | `prod-google-services.json`       |

Copy `.env.local.example` to `.env.local` and fill in any required values before running. Sensitive files **must not** be committed:

- `dev-google-services.json`, `preview-google-services.json`, `prod-google-services.json`
- `dev-service-account.json`, `preview-service-account.json`, `prod-service-account.json`

(These are listed in `.gitignore`.)

---

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Start Expo dev server |
| `pnpm start` / `pnpm android` / `pnpm ios` / `pnpm web` | Start with cache reset, optionally on a target |
| `pnpm generate:schema` | Regenerate `api/schema.ts` from the staging OpenAPI doc |
| `pnpm build` | EAS build for **both** platforms |
| `pnpm build:android[:dev\|:preview\|:prod-apk]` | Targeted Android builds |
| `pnpm build:ios[:dev\|:preview]` | Targeted iOS builds |
| `pnpm update[:android\|:ios][:preview]` | Publish an EAS Update on the matching channel |
| `pnpm patch` / `pnpm minor` / `pnpm major` | Bump the version in `package.json` (also drives `app.config.ts` version) |
| `pnpm clean` | Remove `.expo` and `node_modules` (POSIX `rm`) |

---

## API integration

All HTTP calls go through `openapi-fetch` clients in [api/client.ts](api/client.ts):

- `publicApiClient` — used for `/auth/login`, `/auth/register`, etc.
- `apiClient` — attaches the access token, refreshes via `POST /api/auth/refresh` on 401.

Endpoints are exposed as factory functions on [`api`](api/index.ts) that return either `queryOptions(...)` or `{ mutationFn }` so they can be passed straight to TanStack Query:

```ts
const { data, isLoading } = useQuery(api.getAllServiceRequest());
const { mutate } = useMutation(api.createNewOffer());
```

Errors are normalized in [api/helpers.ts](api/helpers.ts) with `getErrorMessage` / `showErrorMessage` (toast via `sonner-native`).

Tokens are persisted via [api/token-storage.ts](api/token-storage.ts) (using `expo-sqlite/kv-store`).

See [USER_STORIES.md](USER_STORIES.md) for the full functional surface (auth, marketplace, jobs, earnings, disputes, notifications, support, legal).

---

## State, sockets & background tasks

- **Auth & onboarding state:** [`store/auth-store.ts`](store/auth-store.ts) — persisted zustand store (`user`, `isLoggedIn`, `hasCompletedOnboarding`). Route guards in [app/_layout.tsx](app/_layout.tsx) use these via `Stack.Protected`.
- **Location consent:** [`store/location-consent-store.ts`](store/location-consent-store.ts) drives the prominent disclosure dialog before the OS permission prompt.
- **Marketplace context:** [`providers/use-marketplace-context.tsx`](providers/use-marketplace-context.tsx) — wires sockets per logged-in artisan.
- **Sockets:** `hooks/use-{chat,jobs,offers,service-requests,notification}-socket.ts` connect to the platform socket server (factory: [`lib/socket.ts`](lib/socket.ts)).
- **Background location:** [`location-task.ts`](location-task.ts) registers an Expo TaskManager task that posts to `/api/users/location`. iOS uses `UIBackgroundModes: ['location']`; Android declares `ACCESS_BACKGROUND_LOCATION` + `FOREGROUND_SERVICE_LOCATION`.

---

## UI system

- Components live in [components/](components/) with primitives under [components/ui/](components/ui/).
- Styling is **NativeWind 4** + Tailwind v3 with custom font family **Cabinet Grotesk** (8 weights loaded in [app.config.ts](app.config.ts)).
- Bottom sheets: `@gorhom/bottom-sheet` for nested screens, `react-native-actions-sheet` for global action sheets registered in [components/sheets/index.tsx](components/sheets/index.tsx).
- HTML content (policies, terms) is rendered via [components/html-content.tsx](components/html-content.tsx) using `react-native-render-html`.

---

## Builds & releases (EAS)

This project uses [EAS Build](https://docs.expo.dev/build/introduction/), [EAS Update](https://docs.expo.dev/eas-update/introduction/), and [EAS Submit](https://docs.expo.dev/submit/introduction/). Profiles are defined in `eas.json`.

```bash
# One-off build of both platforms (default profile)
pnpm build

# Development build (installable dev-client)
pnpm build:android:dev
pnpm build:ios:dev

# Preview / staging build
pnpm build:android:preview
pnpm build:ios:preview

# Production
pnpm build:android         # AAB for Play Store
pnpm build:android:prod-apk
pnpm build:ios             # IPA for App Store
```

Runtime updates use the EAS Update channel matching each environment:

```bash
pnpm update:android            # production channel
pnpm update:android:preview    # preview channel
pnpm update:ios
pnpm update:ios:preview
```

Versioning is `appVersion` policy — bump with `pnpm patch | minor | major` before building.

---

## Push notifications

1. The app registers for Expo push tokens on login (`providers/notification-provider.tsx`).
2. The token is sent to the server: `POST /api/notifications/devices` with `{ pushToken, platform }`.
3. On logout, the device is deregistered (`DELETE /api/notifications/devices`).
4. Android uses **FCM v1** credentials via the per-env `*-google-services.json` and `*-service-account.json`. Configure each EAS build profile separately following <https://docs.expo.dev/push-notifications/fcm-credentials/>.

---

## Adding components

This project is bootstrapped on [React Native Reusables](https://reactnativereusables.com). To add more primitives:

```bash
npx react-native-reusables/cli@latest add [...components]
# e.g.
npx react-native-reusables/cli@latest add input textarea
```

`components.json` records which generator config is in use.

---

## Conventions

- **Imports:** use the `@/` alias (configured in [tsconfig.json](tsconfig.json)). Avoid relative `../../..` paths.
- **API calls:** add new endpoints to [api/index.ts](api/index.ts) so they are typed and reusable from any screen.
- **Forms:** prefer `@tanstack/react-form` + a `zod` schema in `validators.onSubmit` (see [app/register.tsx](app/register.tsx) for the canonical pattern).
- **Server state:** never store API responses in zustand; let TanStack Query own them. zustand is reserved for auth/session and UI-only state.
- **Toasts:** use `showErrorMessage` / `showSuccessMessage` from [api/helpers.ts](api/helpers.ts) — do not call `toast` directly.
- **Multipart uploads:** see the `becomeArtisan`, `updateProfile`, `startJob`, `completeJob`, and `createDispute` mutations in [api/index.ts](api/index.ts) for the established multipart pattern (mind iOS `file://` stripping).
- **Routing guards:** add new authenticated routes inside the `Stack.Protected guard={isLoggedIn}` block in [app/_layout.tsx](app/_layout.tsx).
- **Code style:** Prettier with `prettier-plugin-tailwindcss` is configured; run your editor's formatter on save.

---

## Troubleshooting

- **Metro picks up stale state** → `pnpm start` (passes `-c` to clear the cache).
- **Build fails on Android FCM** → confirm the correct `*-google-services.json` is present for the `APP_ENV` you are building, and that the matching service account is referenced in `eas.json`.
- **Background location not running** → ensure both foreground and background permission have been granted; the app only starts the task once both `Location.getForegroundPermissionsAsync()` and `getBackgroundPermissionsAsync()` return `granted` (see [app/(tabs)/_layout.tsx](app/(tabs)/_layout.tsx)).
- **OpenAPI types out of date** → re-run `pnpm generate:schema` against `staging-api.getxervices.com`.
- **Apple Sign-In not appearing in dev** → must be on iOS, signed into iCloud, and using a build with the Apple Sign-In capability (provisioned via EAS credentials).

---

## License

Proprietary — © Xervices. All rights reserved.

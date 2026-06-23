# Xervices Pro — Artisan App User Stories

> Mobile app for **artisans** (service providers) on the Xervices platform. Artisans onboard, get matched to nearby service requests, send offers, complete jobs, receive escrow-secured payments, and grow their reputation.

This document captures the product behavior implemented in this Expo / React Native app. Stories are grouped by epic, with acceptance criteria derived from the actual screens and API surface.

---

## Personas

- **Prospective Artisan** — A new user who has installed the app but has not yet created an account or completed onboarding.
- **Pending Artisan** — A registered user whose artisan profile (skills, license, NIN, certifications) has not yet been verified.
- **Verified Artisan** — A fully onboarded artisan who can receive service requests, place offers, and accept jobs.
- **Active Artisan** — A verified artisan currently working a job (in transit, in progress, or pending completion).

---

## Epic 1 — Onboarding & First Run

### US-1.1 — View onboarding slides
**As a** prospective artisan
**I want to** see an introductory walkthrough the first time I open the app
**So that** I understand the value proposition before signing up.

**Acceptance criteria**
- On first launch, three onboarding slides auto-advance every 4 seconds (`Reach more clients`, `Secure escrow payments`, `Grow your reputation`).
- I can swipe / tap arrow controls to move forward and backward manually.
- A "Get Started" button completes onboarding and routes me to login. Onboarding state is persisted (zustand + `expo-sqlite/kv-store`) so I never see it again on the same device.

### US-1.2 — Splash & app readiness
**As a** user opening the app
**I want to** see a branded splash screen while providers and stored state initialize
**So that** the app feels responsive and intentional during cold start.

**Acceptance criteria**
- A native splash is shown immediately, then handed off to a custom splash for ~2 s while QueryClient, location, keyboard, and notification providers initialize.

---

## Epic 2 — Authentication & Account Security

### US-2.1 — Register as an artisan
**As a** prospective artisan
**I want to** create an account with my name, phone, email, password, and optional referral code
**So that** I can start the artisan onboarding flow.

**Acceptance criteria**
- The form validates: full name (no emojis), phone (required), lowercase email, password (length 6+, upper/lower/number/special — visible checklist), matching confirm password.
- On success the account is created, a success toast is shown, and any referral code is applied via `/api/referrals/apply`.
- I am routed to email verification with my email and phone passed forward.

### US-2.2 — Log in
**As a** registered user
**I want to** log in with email/phone + password
**So that** I can access my artisan dashboard.

**Acceptance criteria**
- The form accepts email or phone, plus password.
- Device id and device name are attached to the login payload (via `expo-application` / `expo-device`).
- On success the app routes me based on server response:
  - email not verified → `/verify-email`
  - device verification required → `/verify-device` with the verification token
  - not yet an artisan → `/become-artisan`
  - otherwise → enter the authenticated tabs.
- "Remember me" toggle and a "Forgot Password?" link are visible.

### US-2.3 — Verify email with OTP
**As a** newly registered user
**I want to** enter an OTP sent to my email
**So that** my email is confirmed and my account is activated.

**Acceptance criteria**
- I can request a resend of the verification code.
- Submitting a valid OTP marks the email as verified server-side.

### US-2.4 — Verify a new device
**As a** returning user signing in from an unknown device
**I want to** confirm an OTP tied to my device verification token
**So that** unauthorized sign-ins are blocked.

**Acceptance criteria**
- The screen consumes the `deviceVerificationToken` from login and submits the OTP via `/api/auth/verify-device`.
- On success, tokens are persisted and I am routed forward as usual.

### US-2.5 — Forgot / reset password
**As a** user who forgot my password
**I want to** request a reset, enter the OTP, and set a new password
**So that** I can regain access.

**Acceptance criteria**
- `forgot-password` → `forgot-password-otp` → `new-password` form a complete reset flow backed by `/api/auth/forgot-password` and `/api/auth/reset-password`.

### US-2.6 — Change password from profile
**As a** logged-in artisan
**I want to** change my password from my profile (with OTP verification)
**So that** I can rotate credentials.

**Acceptance criteria**
- From `profile/password`, request an OTP, enter it on `password-otp`, then submit a new password on `new-password`.

### US-2.7 — Set / verify transaction PIN
**As a** verified artisan
**I want to** set and verify a transaction PIN
**So that** sensitive actions (withdrawals, payouts) are protected.

**Acceptance criteria**
- Check pin status, request an OTP, set a PIN, and verify it via `/api/security/check-pin-status`, `/api/security/pin/request-otp`, `/api/security/pin`.
- A `pin-sheet` bottom sheet is used to capture the PIN.

### US-2.8 — Apple Sign-In *(iOS)*
**As an** iOS user
**I want to** sign in with Apple
**So that** I can authenticate without managing a password.

**Acceptance criteria**
- Apple Sign-In is integrated into the auth flow alongside email/password (recent feature commit: *integrate Apple Sign-In for mobile authentication*).

---

## Epic 3 — Becoming an Artisan (Professional Profile)

### US-3.1 — Become an artisan
**As a** registered customer-side user who is not yet an artisan
**I want to** convert my account to an artisan account
**So that** I can receive service requests.

**Acceptance criteria**
- `/become-artisan` calls `/api/users/me/become-artisan` and refreshes my access token so the new role is reflected in the JWT.

### US-3.2 — Submit professional details
**As a** new artisan
**I want to** submit my skills (categories), years of experience, professional license, license state and issue date, certifications, and previous-job samples
**So that** I can be reviewed and verified.

**Acceptance criteria**
- Categories are loaded from `/api/categories` and selected via a multi-select.
- Certifications and previous job samples can be uploaded as files (images/PDFs). Each file is sent as multipart form data to `/api/artisans/onboard`.
- Successful submission moves me to the verification screens.

### US-3.3 — NIN verification
**As a** new artisan
**I want to** verify my National Identification Number
**So that** the platform can confirm my identity.

**Acceptance criteria**
- The two-step `verify/` flow submits my NIN to `/api/artisans/verify-nin` and surfaces server errors clearly.

### US-3.4 — View / manage my artisan profile
**As a** verified artisan
**I want to** view and edit my professional profile (skills, license, certifications)
**So that** I can keep it current.

**Acceptance criteria**
- Personal details (`profile/personal`) and certification details (`profile/certification-details` component) are editable; updates use `/api/artisans/me` via PATCH with multipart form data.

---

## Epic 4 — Home Dashboard & Marketplace

### US-4.1 — See an at-a-glance dashboard
**As a** verified artisan
**I want to** see nearby service requests, my offers, earnings overview, level/stats, and platform promos on the home screen
**So that** I can act on the most important things first.

**Acceptance criteria**
- Home runs parallel queries for: nearby service requests (`/browse/nearby`, 25 km radius, 50 results), artisan profile, earnings, my offers, featured/user-of-the-week profiles, news & promo slides, and current jobs.
- Pull-to-refresh re-fetches all of the above.
- Cards: availability status, overview, stats, verify-account CTA (if not verified), user-of-week, promotions, rate-client prompt (if a recently completed job is unrated).

### US-4.2 — Toggle availability
**As a** verified artisan
**I want to** toggle my availability on/off
**So that** I only receive offers when I am ready to work.

**Acceptance criteria**
- The availability switch calls `PATCH /api/artisans/availability` and reflects the new state immediately.

### US-4.3 — Receive a service request via real-time socket
**As an** available artisan
**I want to** see new service requests appear in real time
**So that** I can respond before competitors.

**Acceptance criteria**
- A socket connection (`hooks/use-service-requests-socket.ts`) subscribes to nearby request events.
- New requests are appended to the home feed without manual refresh.

### US-4.4 — View a service request
**As an** artisan
**I want to** open a request, see its details, customer profile snapshot, location, and customer reviews/stats
**So that** I can decide whether to send an offer.

**Acceptance criteria**
- The request screen displays customer rating stats (`/api/reviews/customer/{id}/stats`) and review history (`/api/reviews/customer/{id}`).
- The request screen refetches every 5 s to stay current.

### US-4.5 — Place an offer
**As an** artisan
**I want to** submit a price + message in response to a service request
**So that** I can bid for the job.

**Acceptance criteria**
- `POST /api/offers` accepts an amount and message; success updates the "My Offers" list.

### US-4.6 — Send a counter offer
**As an** artisan
**I want to** counter the customer's response with a new amount and message
**So that** I can negotiate.

**Acceptance criteria**
- `counter-offer-sheet` opens, calls `POST /api/offers/{id}/counter`, and refreshes the offer history.

### US-4.7 — Respond to or withdraw an offer
**As an** artisan
**I want to** accept / reject the customer's counter, or withdraw my offer
**So that** I retain control of pending negotiations.

**Acceptance criteria**
- `POST /api/offers/{id}/respond` and `POST /api/offers/{id}/withdraw` are available from the offer list/detail.
- Offer history (`/api/offers/{id}/history`) is viewable.

### US-4.8 — See an in-app broadcast
**As an** artisan
**I want to** see platform-wide broadcasts (announcements, promos)
**So that** I do not miss important notices.

**Acceptance criteria**
- Active broadcasts from `/api/broadcasts/active` are rendered as a dialog; dismiss calls `/api/broadcasts/{id}/dismiss` so it does not reappear.

---

## Epic 5 — Jobs (Active Work)

### US-5.1 — See my jobs grouped by status
**As an** artisan
**I want to** view jobs split by current/in-progress and completed
**So that** I can focus on active work.

**Acceptance criteria**
- The Jobs tab queries `/api/jobs` and groups them. A separate `completed` view exists.

### US-5.2 — Start a job with before-photos
**As an** artisan
**I want to** start an accepted job by uploading "before" photos via the camera
**So that** the platform has evidence of pre-work conditions.

**Acceptance criteria**
- `camera-sheet` captures multi-photo input; submission posts multipart `beforePhotos[]` to `/api/jobs/{id}/start`.

### US-5.3 — Track location in the background while on a job
**As an** artisan
**I want to** allow the app to track my location in the background
**So that** the customer can see I am en route.

**Acceptance criteria**
- A consent dialog (`LocationConsentDialog`) requests background location with a clear disclosure before the OS prompt.
- `location-task.ts` registers an Expo TaskManager task that sends position updates to `/api/users/location`.
- iOS `UIBackgroundModes: ['location']` and Android `ACCESS_BACKGROUND_LOCATION` are configured in `app.config.ts`.
- Tracking starts only when both foreground + background permissions are granted; stops when I log out or leave the tabs.

### US-5.4 — Chat with the customer
**As an** artisan
**I want to** message the customer for a job in real time
**So that** I can coordinate access, parking, scope clarifications, etc.

**Acceptance criteria**
- `chat.tsx` loads a chat room via `/api/chat/jobs/{jobId}` and message history via `/api/chat/rooms/{id}/messages`.
- A socket (`use-chat-socket.ts`) delivers new messages live.
- Voice notes can be recorded (recording-indicator + `expo-audio`); images/files can be attached.

### US-5.5 — Complete a job with after-photos
**As an** artisan
**I want to** mark a job complete and upload after-photos
**So that** the customer can review and release escrow.

**Acceptance criteria**
- `POST /api/jobs/{id}/complete` accepts multipart `afterPhotos[]`.
- A photo preview screen lets me confirm uploads first.

### US-5.6 — Cancel a job
**As an** artisan
**I want to** cancel a job with a reason
**So that** customers and the platform know why work is stopping.

**Acceptance criteria**
- `POST /api/jobs/{id}/cancel` accepts a reason payload.
- I am informed of the cancellation policy (see Epic 9).

### US-5.7 — Rate the customer after completion
**As an** artisan
**I want to** rate the customer after a job
**So that** other artisans benefit from my feedback.

**Acceptance criteria**
- `canReview` (`/api/reviews/can-review/{jobId}`) gates the prompt.
- Submission via `POST /api/reviews/customer` clears the prompt from home.

### US-5.8 — File a dispute against a job
**As an** artisan
**I want to** open a dispute (e.g., non-payment, scope conflict) with description and media evidence
**So that** Xervices can mediate.

**Acceptance criteria**
- `create-dispute` screen submits to `POST /api/disputes` with multipart `media[]`.
- I can view my disputes (`/api/disputes`), open a dispute detail (`/api/disputes/{id}`), and add further evidence (`/api/disputes/{id}/evidence`).

---

## Epic 6 — Earnings, Wallet & Withdrawals

### US-6.1 — View my earnings overview
**As an** artisan
**I want to** see my wallet balance, total earned, and platform commission rate
**So that** I know what I have made.

**Acceptance criteria**
- Earnings tab pulls `/api/earnings` and `/api/earnings/commission-rate`.
- A balance card prominently surfaces available balance.

### US-6.2 — Browse transaction history
**As an** artisan
**I want to** filter transactions by period (today, this week, this month, previous month, this year), date range, and type
**So that** I can reconcile my income.

**Acceptance criteria**
- `/api/transactions` is called with `period`, `startDate`, `endDate`, `type` query params; a filter sheet drives the UI.

### US-6.3 — Add and manage bank accounts
**As an** artisan
**I want to** add, verify, set-default, and remove bank accounts
**So that** payouts go to the right destination.

**Acceptance criteria**
- `POST /api/bank-accounts`, `POST /api/bank-accounts/verify`, `POST /api/bank-accounts/{id}/set-default`, `DELETE /api/bank-accounts/{id}` are all wired into the bank UI.

### US-6.4 — Withdraw to bank
**As an** artisan
**I want to** request a withdrawal of available balance to my default bank account, gated by my transaction PIN
**So that** funds reach me securely.

**Acceptance criteria**
- `withdraw-sheet` collects amount and PIN; submits to `POST /api/withdrawals`.

### US-6.5 — Apply and use promo codes
**As an** artisan
**I want to** apply a promo code and see active discounts/promotions
**So that** I benefit from platform incentives.

**Acceptance criteria**
- `add-promo-code-sheet` (in `profile/promo`) and `/api/promotions/me`, `/api/promotions/discounts` power the promo experience.

### US-6.6 — Refer another artisan and withdraw the bonus
**As an** artisan
**I want to** see my referral code/info and withdraw earned bonuses to my wallet
**So that** I am rewarded for bringing peers onto the platform.

**Acceptance criteria**
- `/api/referrals/me` shows my info; `/api/referrals/apply` is called at registration; `/api/referrals/withdraw-to-wallet` moves the bonus into the wallet.

---

## Epic 7 — Profile, Levels & Reputation

### US-7.1 — View my level
**As an** artisan
**I want to** see my current level, the available levels, and what unlocks the next one
**So that** I am motivated to improve.

**Acceptance criteria**
- `profile/level` pulls `/api/artisans/me/level` and `/api/artisans/levels`.

### US-7.2 — Be featured as "User of the Week"
**As a** top-performing artisan
**I want to** appear on the home feed of other artisans / customers as a featured profile
**So that** my reputation grows.

**Acceptance criteria**
- `/api/featured-profiles?type=artisan` is rendered as a `user-of-week` card on home.

### US-7.3 — Verify my account (badge)
**As an** artisan
**I want to** see a verify-account CTA on home when I am not yet verified
**So that** I can complete the verification flow and unlock perks.

**Acceptance criteria**
- The CTA is shown conditionally; `toggleArtisanVerification` toggles verification status; a `verification-profile-sheet` provides context.

---

## Epic 8 — Notifications & Real-Time Updates

### US-8.1 — Receive push notifications
**As an** artisan
**I want to** receive push notifications for new service requests, offer responses, chat messages, payouts, and disputes
**So that** I never miss revenue-impacting events.

**Acceptance criteria**
- On login, the Expo push token is registered via `POST /api/notifications/devices` (platform `ios`/`android`).
- On logout, the device is unregistered.
- Notification handler is set up in `providers/notification-provider.tsx`.

### US-8.2 — In-app notification feed
**As an** artisan
**I want to** see an unread notification count and a notifications screen
**So that** I can review history.

**Acceptance criteria**
- `/api/notifications/unread-count` drives the badge; `/api/notifications` lists items.
- I can mark a single (`/api/notifications/mark-read`) or all (`/api/notifications/mark-all-read`) as read.
- A socket (`use-notification-socket.ts`) pushes new notifications live.

### US-8.3 — Live job/offer/marketplace updates
**As an** artisan
**I want to** see offers, jobs, and service requests update live as their state changes
**So that** I do not act on stale data.

**Acceptance criteria**
- Dedicated sockets exist for chat (`use-chat-socket`), jobs (`use-jobs-socket`), offers (`use-offers-socket`), notifications, and service requests, all coordinated by `MarketplaceProvider`.

---

## Epic 9 — Support, Legal & Account Hygiene

### US-9.1 — Contact support
**As an** artisan
**I want to** submit a support ticket or open a WhatsApp chat with support
**So that** I can resolve issues.

**Acceptance criteria**
- `profile/contact-support` and `profile/mail-support` open form / mail-to flows.
- `POST /api/support/tickets` creates a ticket; `/api/support/whatsapp-links` lists WhatsApp routes.

### US-9.2 — Read legal documents
**As an** artisan
**I want to** read Terms of Service, Privacy Policy, Cancellation Policy, and About Xervices in-app
**So that** I am informed of the rules.

**Acceptance criteria**
- Each document is rendered from the API: `/api/terms-and-conditions`, `/api/privacy-policy`, `/api/cancellation-policy`, `/api/about-xervices`, displayed via the `html-content` component.

### US-9.3 — Rate the Xervices app
**As an** artisan
**I want to** submit a rating and comment for the Xervices app itself
**So that** the team can improve it.

**Acceptance criteria**
- `profile/rate` posts to `/api/app-ratings` and lists my prior ratings via `/api/app-ratings/me`.

### US-9.4 — Delete my account
**As an** artisan
**I want to** request account deletion (with confirmation)
**So that** my data is removed.

**Acceptance criteria**
- A `delete-account-sheet` confirms intent and calls `DELETE /api/users/me`; auth state and tokens are cleared on success.

### US-9.5 — Log out
**As an** artisan
**I want to** log out from profile
**So that** my session ends on shared devices.

**Acceptance criteria**
- Logout unregisters the push device, calls `POST /api/auth/logout`, clears auth store, clears tokens (`api/token-storage.ts`), and stops background location tracking.

---

## Cross-cutting Non-functional Stories

### US-NF-1 — Resilient auth tokens
- Access tokens are refreshed via `POST /api/auth/refresh`; tokens persist in secure storage (`api/token-storage.ts`).

### US-NF-2 — Type-safe API
- The API client uses `openapi-fetch` with types generated from the staging OpenAPI schema (`pnpm generate:schema`). All endpoints in `api/index.ts` are typed against `paths`.

### US-NF-3 — Multi-environment builds
- `development`, `preview`, and `production` flavors are configured via `app.config.ts` and `eas.json`, each with its own bundle id, scheme, Firebase / Google Maps credentials.

### US-NF-4 — Theming & typography
- The app uses NativeWind / Tailwind with the Cabinet Grotesk font family across 8 weights, configured in `app.config.ts` and `tailwind.config.js`.

### US-NF-5 — Accessibility & keyboard handling
- `react-native-keyboard-controller` provides keyboard-aware behavior throughout forms.
- Tab bar items expose accessibility role/state.

### US-NF-6 — Haptics
- Toggling switches/checkboxes and key actions emit light haptic feedback via `expo-haptics`.

---

## Out of scope (not in this codebase)

- The customer-side app (the "Xervices" app for requesters) lives elsewhere.
- Admin / dispute mediation tooling is not part of this client.

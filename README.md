# GlobalMoneyCalc

Free, mobile-friendly money calculators and currency tools in 10 languages: English, Chinese, Hindi, Spanish, Arabic, Bengali, French, Portuguese, Russian and Indonesian.

## Included
- Ten-language selector shared across the website: English, 中文, हिन्दी, Español, العربية, বাংলা, Français, Português, Русский and Bahasa Indonesia
- Optional Supabase account page with email sign-up, sign-in, sign-out and password recovery
- Cloud personal dashboard for profiles, income/expense transactions, debt tracking with partial settlement, and monthly spending budgets
- Supabase Row Level Security limits each signed-in account to its own profile and financial records; the browser uses only a publishable key
- Language choice is saved in the visitor's browser and reused across pages
- Arabic pages use right-to-left layout
- Currency converter with indicative market rates from ExchangeRate.dev and manual provider-rate entry
- A visual currency-rate chart page with a searchable list of the provider's supported currencies
- Currency chart selector that can use any base currency returned by the API
- Rate observation time and market-session status displayed with the data
- A shared USD-based browser cache across the homepage converter and currency chart, normally refreshed every 15 minutes
- Stale-rate warnings and saved-rate fallback when a refresh cannot complete
- Salary, budget and savings calculators
- Salary calculator with deductions, daily and hourly estimates
- Monthly income and expense budget calculator
- Monthly savings projection
- Advertising and direct sponsorship information page
- Privacy Policy, Terms of Use, money calculator guides and a multilingual exchange-rate methodology page
- Custom 404 page, SEO metadata, XML sitemap, robots.txt and favicon
- Cloudflare Pages security headers: framing protection, HTTPS-only transport, restricted device permissions, and no-store/noindex account page
- Live local date and time at the top of every page
- Footer credit: SABBIR AHMED TAHIR

## Currency-rate data
The website uses the ExchangeRate.dev API. Its free and keyless feed is delayed by 15 minutes; this is indicative market information, not a live bank quote, cash-exchange rate or settlement price. The API documents support for 144 currencies. The visual chart refreshes its rates periodically and caches the most recent successful response in the visitor's browser.

The free plan lists 5,000 requests per month and 10 requests per minute; anonymous callers are also rate-limited by IP. Free-plan display requires a visible link reading **Rates by Exchangerate.dev** on each page or screen showing rate data. The provider's terms prohibit redistribution of raw or derived rate data through another API, SDK, feed, export or dataset. See the [API documentation](https://exchangerate.dev/docs), [pricing](https://exchangerate.dev/pricing) and [Terms of Service](https://exchangerate.dev/terms).

## Launch checklist
See [LAUNCH-CHECKLIST-BN.md](LAUNCH-CHECKLIST-BN.md) for deployment, troubleshooting, ads, privacy and mobile testing.

## Publish with Cloudflare Pages
The production site is deployed from this repository through the Cloudflare Pages Git integration.

- Production URL: https://globalmoneycalc.pages.dev/
- Account dashboard: https://globalmoneycalc.pages.dev/account.html
- Source repository: https://github.com/sabbir019109307/GlobalMoneyCalc
- Production branch: `main`
- Framework preset: `None`
- Build command: leave blank (plain static HTML/CSS/JavaScript)
- Repository root: use the repository root; do not set a nested root directory.

Cloudflare Pages automatically builds and deploys new commits pushed to the connected `main` branch. Confirm the latest production deployment is successful in the Cloudflare dashboard before treating a commit as live.

## Supabase database migrations and security

Database migration history is mirrored in `supabase/migrations/`. The finance tables have Row Level Security enabled and authenticated policies bind every profile/record to `auth.uid()`. Existing account tables explicitly grant CRUD to the authenticated role; they do not grant the anonymous role access.

Two follow-up migrations tighten default privileges for new objects created by the `postgres` role in the `public` schema. New tables/functions/sequences created by that role do not automatically receive Data API privileges; migrations must explicitly grant only what they need and enable RLS before exposing tables. The project integration cannot alter the separate `supabase_admin` creator-role defaults, so do not create exposed public tables as that role without reviewing those defaults first.

## Account data and privacy
- Public calculator inputs and saved calculation snapshots are processed/stored in the visitor's browser and are not included in currency-rate API requests.
- When a visitor intentionally creates an account and saves records in `account.html`, profile, income/expense, debt and monthly budget records are sent to Supabase and stored with that account.
- Row Level Security policies restrict each authenticated account to its own records. Supabase Auth handles passwords; no service-role key is placed in public JavaScript.
- Account use is optional; the regular calculators do not require registration.
- Account dashboard: https://globalmoneycalc.pages.dev/account.html
- Before email confirmation and password recovery can return correctly, add the Cloudflare Pages account URL to Supabase Authentication → URL Configuration. See `LAUNCH-CHECKLIST-BN.md`.
- Supabase's built-in hosted email sender is for team-member testing only (currently 2 emails per hour); public sign-up/confirmation/password-reset flows need a custom SMTP provider. Do not disable email confirmation to bypass this limit.

## Important
- Public calculator input amounts are processed in the visitor's browser and are not sent to GlobalMoneyCalc or included in currency-rate API requests.
- Exchange rates can differ from a bank, card provider, cash exchange or remittance service. Always check the amount actually offered after fees and spreads.
- No ad network is connected yet. The advertising area is a placeholder; do not add AdSense scripts or an ads.txt publisher record until an account is approved and the real publisher ID is available.
- Direct sponsorship information is in `advertise.html`. The current inquiry route is a public GitHub issue; do not post private information there.
- The free Cloudflare Pages address uses a shared `pages.dev` subdomain. Advertising services may have their own site/domain eligibility requirements; check their current rules before expecting approval or buying a custom domain.
- This website is informational and does not provide professional financial, tax, legal or investment advice.


## Visitor analytics (optional)
- A consent-first Google Analytics 4 loader is included in `analytics.js` on every page.
- Analytics is fully disabled until the owner adds a real GA4 Measurement ID (`G-...`) to `analytics.js`.
- After configuration, visitors must choose **Allow analytics**; Reject prevents the Google tag from loading.
- Calculator inputs are never included in analytics events.
- Setup guide: [ANALYTICS-SETUP-BN.md](ANALYTICS-SETUP-BN.md).
- No fabricated/local-only public visitor counter is used. Real visitor metrics require a connected analytics property.


## Saved calculations
- The homepage includes Save buttons for currency, salary, budget, and savings calculations.
- Saved inputs and results stay in the visitor's own browser local storage on that device; there is no account, server upload, or cross-device sync.
- Visitors can restore inputs or delete individual/all saved entries. Browser storage clearing may erase them.
- Implementation: `save-calculations.js`.

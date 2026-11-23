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
- Live local date and time at the top of every page
- Footer credit: SABBIR AHMED TAHIR

## Currency-rate data
The website uses the ExchangeRate.dev API. Its free and keyless feed is delayed by 15 minutes; this is indicative market information, not a live bank quote, cash-exchange rate or settlement price. The API documents support for 144 currencies. The visual chart refreshes its rates periodically and caches the most recent successful response in the visitor's browser.

The free plan lists 5,000 requests per month and 10 requests per minute; anonymous callers are also rate-limited by IP. Free-plan display requires a visible link reading **Rates by Exchangerate.dev** on each page or screen showing rate data. The provider's terms prohibit redistribution of raw or derived rate data through another API, SDK, feed, export or dataset. See the [API documentation](https://exchangerate.dev/docs), [pricing](https://exchangerate.dev/pricing) and [Terms of Service](https://exchangerate.dev/terms).

## Launch checklist
See [LAUNCH-CHECKLIST-BN.md](LAUNCH-CHECKLIST-BN.md) for deployment, troubleshooting, ads, privacy and mobile testing.

## Publish with GitHub Pages
1. Open this repository's **Settings**.
2. Select **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/(root)**, then press **Save**.
5. GitHub will display the published Pages URL. Expected URL:
   https://sabbir019109307.github.io/GlobalMoneyCalc/

## Account data and privacy
- Public calculator inputs and saved calculation snapshots are processed/stored in the visitor's browser and are not included in currency-rate API requests.
- When a visitor intentionally creates an account and saves records in `account.html`, profile, income/expense, debt and monthly budget records are sent to Supabase and stored with that account.
- Row Level Security policies restrict each authenticated account to its own records. Supabase Auth handles passwords; no service-role key is placed in public JavaScript.
- Account use is optional; the regular calculators do not require registration.
- Account dashboard: https://sabbir019109307.github.io/GlobalMoneyCalc/account.html
- Before email confirmation and password recovery can return correctly, add the GitHub Pages account URL to Supabase Authentication → URL Configuration. See `LAUNCH-CHECKLIST-BN.md`.

## Important
- Public calculator input amounts are processed in the visitor's browser and are not sent to GlobalMoneyCalc or included in currency-rate API requests.
- Exchange rates can differ from a bank, card provider, cash exchange or remittance service. Always check the amount actually offered after fees and spreads.
- No ad network is connected yet. The advertising area is a placeholder; do not add AdSense scripts or an ads.txt publisher record until an account is approved and the real publisher ID is available.
- Direct sponsorship information is in `advertise.html`. The current inquiry route is a public GitHub issue; do not post private information there.
- The GitHub Pages project URL contains a path. A separate domain may be useful for some advertising services, but do not assume a domain is available or buy one without authorization.
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

# GlobalMoneyCalc — Launch Checklist (বাংলা)

এই নথিতে সম্পন্ন কাজ, ফোনে হাতে-কলমে পরীক্ষা এবং যে কাজের জন্য অ্যাকাউন্ট বা মালিকের সিদ্ধান্ত প্রয়োজন—সেগুলো আলাদা রাখা হয়েছে।

## 1. রিপোজিটরিতে সম্পন্ন

- [x] ১০টি ভাষার ইন্টারফেস; আরবি ভাষায় RTL লেআউট
- [x] মুদ্রা কনভার্টার, বেতন, বাজেট ও সঞ্চয় ক্যালকুলেটর
- [x] হোমপেজ কনভার্টারে ৫৮টি বাছাই করা মুদ্রা
- [x] ExchangeRate.dev-এর USD-ভিত্তিক ইন্ডিকেটিভ রেট; ফ্রি/keyless feed ১৫ মিনিট বিলম্বিত
- [x] নিজের bank/exchange rate লিখে হিসাব করার বিকল্প
- [x] browser cache, stale-rate warning এবং manual fallback
- [x] ছবির আদলে রঙিন বার-চার্ট ও লাল তীরসহ currency-rates.html
- [x] API-তে পাওয়া মুদ্রা থেকে base currency নির্বাচন, প্রথম ৮টি বার এবং সব রেটের searchable table
- [x] একবার USD-ভিত্তিক ডেটা এনে browser-এ সব currency pair হিসাব; base বদলালে নতুন API request লাগে না
- [x] হোমপেজ ও চার্ট খোলা থাকলে প্রতি ১৫ মিনিট পর নতুন রেট আনার চেষ্টা করে
- [x] হোমপেজ ও চার্ট একই browser cache ভাগ করে, তাই পেজ বদলালে অপ্রয়োজনীয় duplicate API call কমে
- [x] রেট পর্যবেক্ষণের সময়, market session এবং provider attribution link
- [x] Rate methodology, Guides, Privacy Policy, Terms, Advertise এবং ১০ ভাষার 404 পেজ
- [x] সব public page-এ ১০ ভাষার selector, পছন্দ সংরক্ষণ ও Arabic RTL
- [x] account.html-এ Supabase email Auth এবং cloud personal finance dashboard
- [x] প্রতিটি পেজের একেবারে উপরে চলমান স্থানীয় তারিখ/সময়; নিচে SABBIR AHMED TAHIR credit
- [x] robots.txt, sitemap.xml (currency-rates page-সহ), favicon
- [x] সব পেজে ঐচ্ছিক GA4 integration প্রস্তুত; আসল Measurement ID না দেওয়া পর্যন্ত সম্পূর্ণ বন্ধ
- [x] GA4 চালু হলে Allow/Reject consent banner; Reject করলে Google tag লোড হয় না
- [x] Privacy Policy পেজে analytics preference পরিবর্তনের ব্যবস্থা
- [x] GitHub Actions-এ প্রয়োজনীয় পেজ, local links, metadata, JavaScript syntax ও sitemap validation

## 2. প্রকাশনা

মূল ওয়েবসাইট:
https://sabbir019109307.github.io/GlobalMoneyCalc/

মুদ্রার চার্ট:
https://sabbir019109307.github.io/GlobalMoneyCalc/currency-rates.html

ব্যক্তিগত অ্যাকাউন্ট:
https://sabbir019109307.github.io/GlobalMoneyCalc/account.html

GitHub Pages-এর সর্বশেষ build/deploy run Success না হওয়া পর্যন্ত নতুন commit live হয়েছে ধরে নেবেন না। Actions:
https://github.com/sabbir019109307/GlobalMoneyCalc/actions

ফোনে পেজ পুরোনো দেখালে Chrome Incognito tab খুলুন অথবা সাইটের cache/site data পরিষ্কার করে reload করুন।

## 3. মুদ্রার রেটের নিয়ম

- Free/keyless feed ১৫ মিনিট বিলম্বিত; এটি প্রতি সেকেন্ডের live bank FX quote নয়।
- ExchangeRate.dev API ১৪৪টি মুদ্রা সমর্থন করে; API-তে না থাকা মুদ্রা চার্টে দেখানো যাবে না।
- Free plan: ৫,০০০ request/মাস ও ১০ request/মিনিট। Keyless caller: প্রতি IP-তে ১০ request/মিনিট এবং ১০০ request/ঘণ্টা।
- Free-plan data দেখানো প্রতিটি পেজ/স্ক্রিনে দৃশ্যমান Rates by Exchangerate.dev link থাকতে হবে।
- Raw বা derived rate data অন্য API, SDK, feed, file export বা dataset হিসেবে পুনর্বিতরণ করা যাবে না। এই সাইটে rate-data download নেই।
- রেট indicative; ব্যাংক, cash exchange, card বা remittance provider-এর buy/sell rate ও fee আলাদা হতে পারে।

Provider-এর বর্তমান নির্দেশিকা:
- API docs: https://exchangerate.dev/docs
- Latest endpoint: https://exchangerate.dev/docs/endpoints/latest
- Free limits: https://exchangerate.dev/free-plan-limits
- Pricing: https://exchangerate.dev/pricing
- Terms: https://exchangerate.dev/terms

## 4. আপনার ফোনে এখনো যে পরীক্ষা দরকার

- [ ] দশটি ভাষার selector সব পেজে ব্যবহার করে দেখুন; আরবিতে RTL layout যাচাই করুন।
- [ ] KWD→BDT, USD→BDT, USD→EUR এবং USD→INR রূপান্তর পরীক্ষা করুন।
- [ ] Manual provider rate দিয়ে conversion পরীক্ষা করুন।
- [ ] চার্টে KWD, USD, EUR ও BDT base বেছে দেখুন; search-এ BDT, Euro, Rupee লিখে দেখুন।
- [ ] Salary, budget ও savings calculator-এ খালি, শূন্য ও অস্বাভাবিক input দিয়ে পরীক্ষা করুন।
- [ ] 360px-প্রস্থ ফোনে লেখা কাটা বা অপ্রয়োজনীয় horizontal scroll হচ্ছে কি না দেখুন।
- [ ] Privacy, Terms, Guides, Rates, Currency Rates, Advertise ও My Account পেজ খুলে দেখুন।
- [ ] Supabase Dashboard → Authentication → URL Configuration-এ Site URL `https://sabbir019109307.github.io/GlobalMoneyCalc/` সেট করুন। Redirect URLs-এ এই দুইটি exact URL যোগ করুন: `https://sabbir019109307.github.io/GlobalMoneyCalc/account.html` এবং `https://sabbir019109307.github.io/GlobalMoneyCalc/account.html?reset=1`।
- [ ] নিজের একটি পরীক্ষামূলক ইমেইল দিয়ে account তৈরি করুন; confirmation email খুলে verify করে login করুন।
- [ ] Profile name, currency ও language পরিবর্তন করে Save করুন; refresh ও অন্য পেজে গিয়ে language পছন্দ থাকে কি না দেখুন।
- [ ] একটি income, একটি expense, একটি debt (partial payment-সহ) ও একটি monthly budget যোগ/সম্পাদনা/মুছে পরীক্ষা করুন।
- [ ] Forgot password দিয়ে reset email এবং নতুন password দিয়ে login পরীক্ষা করুন।

## 5. বিজ্ঞাপন ও sponsor — অ্যাকাউন্ট মালিকের কাজ বাকি

- [ ] কোনো ad network এখনো সংযুক্ত নয়; placeholder-কে live বিজ্ঞাপন বলা যাবে না।
- [ ] AdSense account, publisher ID ও Google approval প্রয়োজন। ID না পাওয়া পর্যন্ত AdSense script বা ads.txt publisher record বসানো যাবে না।
- [ ] AdSense sign-up URL-এ path দেওয়া যায় না; standard domain প্রয়োজন। GitHub Pages-এর বর্তমান URL-এ /GlobalMoneyCalc path আছে। Google-এর URL rules দেখুন: https://support.google.com/adsense/answer/2784438
- [ ] GitHub Pages-এর default github.io subdomain সাধারণ AdSense subdomain rule-এ পড়ে না; custom top-level domain লাগতে পারে। Domain কেনা এখনো হয়নি।
- [ ] Site ownership verification ও Google policy review শেষে Ready status না পাওয়া পর্যন্ত বিজ্ঞাপন দেখানো যাবে না: https://support.google.com/adsense/answer/12169212
- [ ] Direct sponsor যোগাযোগের জন্য প্রকাশযোগ্য business email বা private contact form দরকার। বর্তমান GitHub Issues inquiry public; সেখানে ব্যক্তিগত তথ্য দেবেন না।
- [ ] বাস্তব analytics ছাড়া visitor, traffic বা earnings-এর সংখ্যা sponsor-কে জানাবেন না।

## 6. Privacy ও security

- [x] বর্তমানে ad script বা analytics tracker নেই।
- [x] Public calculator input ও save করা calculation browser local storage-এ থাকে; exchange-rate API-তে টাকার পরিমাণ পাঠানো হয় না।
- [x] অ্যাকাউন্টে ব্যবহারকারী ইচ্ছাকৃতভাবে যে profile, income/expense, debt ও budget রেকর্ড save করেন তা Supabase-এ সংরক্ষিত হয়; Privacy Policy-তে জানানো হয়েছে।
- [x] চারটি ব্যক্তিগত টেবিলেই RLS চালু; প্রত্যেক authenticated user শুধু নিজের রেকর্ডে প্রবেশ করতে পারে।
- [x] anon role থেকে ব্যক্তিগত টেবিলের access revoke করা; authenticated role-এ প্রয়োজনীয় CRUD grant আছে।
- [x] Supabase Auth password পরিচালনা করে; public source-এ service_role/secret key নেই।
- [x] API key বা private secret public JavaScript-এ রাখা হয়নি।
- [x] GA4 consent flow ও Privacy Policy disclosure প্রস্তুত; Measurement ID না থাকায় analytics এখনো বন্ধ।
- [ ] Google Analytics-এ নিজের Property/Web stream তৈরি করে G-... Measurement ID যোগ করতে হবে।
- [ ] Search Console-এ URL-prefix property verify করে sitemap.xml জমা দিতে হবে।
- [ ] Supabase URL/Redirect URL configuration এবং email confirmation flow নিজের Supabase Dashboard-এ একবার পরীক্ষা করতে হবে।
- [ ] ভবিষ্যতে rate provider API key লাগলে browser JavaScript-এ নয়—server-side proxy/secret manager দরকার।

## 7. মালিকের সিদ্ধান্ত ছাড়া করা হয়নি

- Domain কেনা বা DNS পরিবর্তন
- AdSense account খোলা, publisher ID বসানো বা paid plan নেওয়া
- Supabase Authentication → URL Configuration-এ Site URL ও Redirect URLs যাচাই/সেট করা এবং নিজের ইমেইলে end-to-end sign-up, confirmation ও reset পরীক্ষা
- Public business email প্রকাশ
- GA4 Measurement ID তৈরি/যোগ করা ও Search Console verification token আনা

এসবের জন্য আপনার নিজের account, অনুমোদন বা সিদ্ধান্ত প্রয়োজন।



## 9. Supabase Account — শেষ owner setup

কোড ও ডাটাবেসের সংযোগ তৈরি করা হয়েছে। তবে email confirmation/password recovery-এর redirect চালাতে Supabase Auth-এ সাইটের URL একবার allowlist করতে হবে।

1. Supabase Dashboard খুলে **GlobalMoneyCalc** project নির্বাচন করুন।
2. **Authentication → URL Configuration** খুলুন।
3. **Site URL** হিসেবে দিন:
   `https://sabbir019109307.github.io/GlobalMoneyCalc/`
4. **Redirect URLs**-এ এই দুটি URL যোগ করুন:
   `https://sabbir019109307.github.io/GlobalMoneyCalc/account.html`
   `https://sabbir019109307.github.io/GlobalMoneyCalc/account.html?reset=1`
5. Save করুন।

তারপর ওয়েবসাইটের **My account** পেজে গিয়ে নিজের ইমেইল দিয়ে account তৈরি করুন। Confirmation email এলে সেটি খুলে verify করুন, তারপর login করুন। প্রথমবার login হলে আপনার profile তৈরি হবে।

নিরাপত্তা পরীক্ষার জন্য আলাদা browser/incognito profile দিয়ে অন্য account তৈরি করে নিশ্চিত করুন যে এক account অন্য account-এর transaction/debt/budget দেখতে পারে না। কোনো service-role বা secret key ওয়েবসাইটে দেবেন না।

Supabase URL configuration guide: https://supabase.com/docs/guides/auth/redirect-urls

## 10. এখনো হাতে পরীক্ষা প্রয়োজন

- [ ] ইমেইল confirmation link account.html-এ ফেরে কি না
- [ ] Login, logout, password reset পরীক্ষা
- [ ] Income, expense, debt, partial payment এবং budget save/edit/delete পরীক্ষা
- [ ] একই account অন্য browser/device-এ login করলে একই data দেখা যায় কি না
- [ ] আলাদা account দিয়ে অন্যের তথ্য দেখা যায় না—RLS isolation পরীক্ষা
- [ ] ১০ ভাষায় account form এবং Arabic RTL layout পরীক্ষা


## 8. Analytics ও Search Console সেটআপ
বাংলা নির্দেশনা: [ANALYTICS-SETUP-BN.md](ANALYTICS-SETUP-BN.md)। Measurement ID ও Search Console verification Google Account মালিককেই তৈরি করতে হবে।

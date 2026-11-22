# GlobalMoneyCalc — Launch Checklist (বাংলা)

এই নথিতে সম্পন্ন কাজ, ফোনে হাতে-কলমে পরীক্ষা এবং যে কাজের জন্য অ্যাকাউন্ট বা মালিকের সিদ্ধান্ত প্রয়োজন—সেগুলো আলাদা রাখা হয়েছে।

## 1. রিপোজিটরিতে সম্পন্ন

- [x] ইংরেজি ও বাংলা ইন্টারফেস
- [x] মুদ্রা কনভার্টার, বেতন, বাজেট ও সঞ্চয় ক্যালকুলেটর
- [x] হোমপেজ কনভার্টারে ৫৮টি বাছাই করা মুদ্রা
- [x] ExchangeRate.dev-এর USD-ভিত্তিক ইন্ডিকেটিভ রেট; ফ্রি/keyless feed ১৫ মিনিট বিলম্বিত
- [x] নিজের bank/exchange rate লিখে হিসাব করার বিকল্প
- [x] browser cache, stale-rate warning এবং manual fallback
- [x] ছবির আদলে রঙিন বার-চার্ট ও লাল তীরসহ currency-rates.html
- [x] API-তে পাওয়া মুদ্রা থেকে base currency নির্বাচন, প্রথম ৮টি বার এবং সব রেটের searchable table
- [x] একবার USD-ভিত্তিক ডেটা এনে browser-এ সব currency pair হিসাব; base বদলালে নতুন API request লাগে না
- [x] হোমপেজ ও চার্ট একই browser cache ভাগ করে, তাই পেজ বদলালে অপ্রয়োজনীয় duplicate API call কমে
- [x] রেট পর্যবেক্ষণের সময়, market session এবং provider attribution link
- [x] Rate methodology, Guides, Privacy Policy, Terms, Advertise এবং bilingual 404 pages
- [x] প্রতিটি পেজের একেবারে উপরে চলমান স্থানীয় তারিখ/সময়; নিচে SABBIR AHMED TAHIR credit
- [x] robots.txt, sitemap.xml (currency-rates page-সহ), favicon
- [x] GitHub Actions-এ প্রয়োজনীয় পেজ, local links, metadata, JavaScript syntax ও sitemap validation

## 2. প্রকাশনা

মূল ওয়েবসাইট:
https://sabbir019109307.github.io/GlobalMoneyCalc/

মুদ্রার চার্ট:
https://sabbir019109307.github.io/GlobalMoneyCalc/currency-rates.html

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

- [ ] বাংলা/English toggle সব পেজে ব্যবহার করে দেখুন।
- [ ] KWD→BDT, USD→BDT, USD→EUR এবং USD→INR রূপান্তর পরীক্ষা করুন।
- [ ] Manual provider rate দিয়ে conversion পরীক্ষা করুন।
- [ ] চার্টে KWD, USD, EUR ও BDT base বেছে দেখুন; search-এ BDT, Euro, Rupee লিখে দেখুন।
- [ ] Salary, budget ও savings calculator-এ খালি, শূন্য ও অস্বাভাবিক input দিয়ে পরীক্ষা করুন।
- [ ] 360px-প্রস্থ ফোনে লেখা কাটা বা অপ্রয়োজনীয় horizontal scroll হচ্ছে কি না দেখুন।
- [ ] Privacy, Terms, Guides, Rates, Currency Rates ও Advertise links খুলে দেখুন।

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
- [x] Calculator amount browser-এ হিসাব হয়; API-তে পাঠানো হয় না।
- [x] API key বা private secret public JavaScript-এ রাখা হয়নি।
- [ ] Analytics বা advertising tracker যোগ করার আগে Privacy Policy ও প্রয়োজনীয় consent disclosure আপডেট করতে হবে।
- [ ] ভবিষ্যতে API key লাগলে browser JavaScript-এ নয়—server-side proxy/secret manager দরকার।

## 7. মালিকের সিদ্ধান্ত ছাড়া করা হয়নি

- Domain কেনা বা DNS পরিবর্তন
- AdSense account খোলা, publisher ID বসানো বা paid plan নেওয়া
- Public business email প্রকাশ
- Analytics/third-party visitor tracking চালু করা

এসবের জন্য আপনার নিজের account, অনুমোদন বা সিদ্ধান্ত প্রয়োজন।

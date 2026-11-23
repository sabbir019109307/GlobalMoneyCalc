# Google Analytics ও Search Console সেটআপ — GlobalMoneyCalc

এই ধাপগুলো আপনার নিজের Google Account দিয়ে করতে হবে। পাসওয়ার্ড বা ব্যক্তিগত লগইন তথ্য কাউকে পাঠাবেন না।

## ১) Google Analytics 4 চালু করা

1. https://analytics.google.com/ খুলে নিজের Google Account দিয়ে প্রবেশ করুন।
2. **Start measuring** নির্বাচন করে Account ও Property তৈরি করুন। Property name দিন **GlobalMoneyCalc**।
3. Reporting time zone হিসেবে **Asia/Kuwait** নির্বাচন করতে পারেন।
4. **Data Streams → Add stream → Web** খুলুন। Website URL হিসেবে `https://globalmoneycalc.pages.dev` এবং Stream name হিসেবে `GlobalMoneyCalc` দিন।
5. Web stream তৈরি হলে Stream details থেকে **Measurement ID** কপি করুন। এটি `G-` দিয়ে শুরু হয়; এটি password বা API secret নয়।
6. ID-টি আমাকে দিলে আমি `analytics.js`-এ বসিয়ে দিতে পারব। অথবা GitHub-এ `analytics.js` ফাইলের `const MEASUREMENT_ID = "";` লাইনে আপনার ID বসান।
7. পরিবর্তন প্রকাশ হলে ওয়েবসাইট খুলে **Allow analytics** চাপুন। Google Analytics-এর **Reports → Realtime**-এ নিজের test visit দেখা যাচ্ছে কি না পরীক্ষা করুন।

Google-এর নির্দেশনা: https://support.google.com/analytics/answer/14183469

## ২) কীভাবে ভিজিটর দেখবেন

Google Analytics-এর Reports-এ Users, Sessions, Views, Pages and screens, country/region এবং realtime activity পাওয়া যায়। এগুলো আলাদা মেট্রিক; “ভিজিটর” ও “পেজ ভিউ” এক জিনিস নয়।

এই সাইটে analytics code ডিফল্টভাবে বন্ধ। বৈধ Measurement ID যোগ করার পরও ভিজিটরকে আলাদা করে **Allow analytics** নির্বাচন করতে হবে। **Reject** করলে Google Analytics tag লোড হয় না। Calculator-এ লেখা অঙ্ক Google Analytics-এ পাঠানো হয় না।

## ৩) Google Search Console

1. https://search.google.com/search-console/ খুলুন।
2. **URL prefix** নির্বাচন করে এই সম্পূর্ণ ঠিকানা দিন:  
   `https://globalmoneycalc.pages.dev/`
3. Google যে HTML meta verification token বা HTML verification file দেবে, সেটি সাইটে যোগ করতে হবে। Token/file তৈরি হলে আমাকে পাঠালে আমি যুক্ত করে দিতে পারব। এটি verification code—Google password নয়।
4. Ownership verify হলে **Sitemaps** অংশে `sitemap.xml` জমা দিন। সম্পূর্ণ URL:  
   `https://globalmoneycalc.pages.dev/sitemap.xml`

Search Console Google Search-এ indexing ও search performance দেখায়; এটি visitor analytics-এর বিকল্প নয়।

## ৪) যা এখনও মালিকের অ্যাকাউন্ট/সিদ্ধান্ত ছাড়া করা যাবে না

- Analytics Measurement ID তৈরি করা ও আপনার Google Account-এ property খোলা।
- Search Console-এর ownership verification token পাওয়া।
- AdSense application ও approval। বর্তমান ঠিকানা `pages.dev` shared subdomain। Google AdSense-এর বর্তমান eligibility ও site-ownership নিয়মে এটি গ্রহণযোগ্য কি না আপনার AdSense account-এ যাচাই করতে হবে; অনুমোদন নিশ্চিত নয়। প্রয়োজন হলে custom domain লাগতে পারে, তবে এখনই domain কিনবেন না।
- Direct sponsorship-এর জন্য প্রকাশ্য business email ঠিকানা নির্ধারণ করা।

AdSense URL নিয়ম: https://support.google.com/adsense/answer/2784438

**নিরাপত্তা:** Google password, recovery code, API secret বা payment details পাঠাবেন না। Measurement ID ও Search Console verification token-ই শুধু প্রয়োজনমতো শেয়ার করবেন।

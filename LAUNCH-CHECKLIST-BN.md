# GlobalMoneyCalc — Launch Checklist (বাংলা)

এই নথিতে কোন কাজ শেষ, কোনটি বাকি এবং GitHub Pages-এ 404 হলে কীভাবে পরীক্ষা করতে হবে তা দেওয়া হলো।

## 1. ইতিমধ্যে রিপোজিটরিতে সম্পন্ন

- [x] ইংরেজি ও বাংলা ইন্টারফেস
- [x] মুদ্রা কনভার্টার, বেতন, বাজেট ও সঞ্চয় ক্যালকুলেটর
- [x] ৫৮টি মুদ্রার নির্বাচন; দৈনিক USD-ভিত্তিক রেফারেন্স রেট
- [x] নিজস্ব rate entry এবং cache মেয়াদ শেষ হলে সতর্কতা
- [x] Rate source/methodology page: `rates.html`
- [x] Guides, privacy policy, terms এবং sponsorship তথ্য পেজ
- [x] কাস্টম bilingual 404 পেজ
- [x] `robots.txt` এবং `sitemap.xml`
- [x] Homepage-এ keyboard skip link এবং calculator button type নির্দিষ্ট করা

## 2. GitHub Pages প্রকাশনা নিশ্চিত করা — সবচেয়ে জরুরি

এই রিপোজিটরির Pages URL:

https://sabbir019109307.github.io/GlobalMoneyCalc/

GitHub মোবাইল অ্যাপে বা ব্রাউজারে এই ধাপগুলো অনুসরণ করুন:

1. রিপোজিটরি খুলুন: https://github.com/sabbir019109307/GlobalMoneyCalc
2. **Settings → Pages** খুলুন।
3. GitHub account-এর **Settings → Emails**-এ অন্তত একটি email **Verified** আছে কি না দেখুন।
4. **Settings → Pages**-এ source যদি **Deploy from a branch** হয়, branch **main** এবং folder **/(root)** নির্বাচন করে Save করুন।
5. publishing source-এ পরিবর্তন করা account-এর repository-তে admin permission থাকতে হবে। এই রিপোজিটরিতে সংযুক্ত GitHub account-এর admin permission আছে; email verification আলাদাভাবে পরীক্ষা করুন।
6. রিপোজিটরির **Actions** ট্যাব খুলুন।
7. **pages-build-deployment** বা Pages-এর build/deployment workflow-এর সর্বশেষ run খুলুন।
8. run-এর অবস্থা **Success** না হওয়া পর্যন্ত live হয়েছে ধরে নেবেন না। **Failure** হলে failed step খুলে error message কপি করে রাখুন।
9. সফল হওয়ার পর নিচের URL-গুলো ফোনের Chrome-এ আলাদা করে খুলুন:
   - https://sabbir019109307.github.io/GlobalMoneyCalc/
   - https://sabbir019109307.github.io/GlobalMoneyCalc/rates.html
   - https://sabbir019109307.github.io/GlobalMoneyCalc/guides.html
   - https://sabbir019109307.github.io/GlobalMoneyCalc/privacy.html
   - https://sabbir019109307.github.io/GlobalMoneyCalc/terms.html
   - https://sabbir019109307.github.io/GlobalMoneyCalc/advertise.html
10. পেজ না বদলালে Chrome-এর Incognito tab-এ খুলুন বা site data/cache পরিষ্কার করে আবার পরীক্ষা করুন।

**404 হলে আগে যাচাই করুন:** `index.html` অবশ্যই `main` branch-এর root-এ থাকতে হবে; নামের বড়-ছোট অক্ষরও হুবহু ঠিক হতে হবে। GitHub Pages-এর official troubleshooting: https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites

**গুরুত্বপূর্ণ:** এই রিপোজিটরিতে `index.html` root-এ আছে এবং repository public। তবে GitHub Pages deployment-এর সর্বশেষ run-এর সবুজ Success status এখনো এই নথিতে যাচাই করা হয়নি। কাস্টম 404 পেজ deployment failure ঠিক করে না; সেটি কেবল live site-এর মধ্যে ভুল URL হলে সাহায্য করে।

## 3. মুদ্রার রেট সংক্রান্ত নিয়ম

- [x] API credit link কনভার্টারের পাশে রাখা হয়েছে।
- [x] API response browser local storage-এ next update time পর্যন্ত cache হয়।
- [x] API ব্যর্থ হলে manual provider rate ব্যবহার করা যায়।
- [x] Expired cached rate সতর্কতা দিয়ে চিহ্নিত হয়।
- [ ] Launch-এর আগে কয়েকটি currency pair (KWD/BDT, USD/BDT, USD/EUR, USD/INR) হাতে-কলমে পরীক্ষা করুন।
- [ ] বাস্তব ব্যাংক/এক্সচেঞ্জের final quote-এর সঙ্গে ফল মিলিয়ে দেখুন; fees/spread এই টুলে যোগ হয় না।

Provider terms ও documentation:
- https://www.exchangerate-api.com/docs/free
- https://www.exchangerate-api.com/terms

Open Access endpoint attribution চায়, দৈনিক আপডেট হয়, caching অনুমোদন করে এবং raw rate data পুনরায় বিতরণ নিষিদ্ধ করে। তাই raw-rate download বা public API feed হিসেবে এই তথ্য প্রকাশ করবেন না।

## 4. বিজ্ঞাপন ও আয়

- [ ] কোনো বিজ্ঞাপন নেটওয়ার্ক এখনো সংযুক্ত নয়।
- [ ] Publisher ID ও account approval না পাওয়া পর্যন্ত AdSense script বা `ads.txt` publisher record যোগ করবেন না।
- [ ] Google AdSense-এ site submit করার আগে domain strategy ঠিক করুন। বর্তমান GitHub Pages URL-এ path রয়েছে; Google-এর site URL নিয়ম অনুযায়ী AdSense registration-এ standard domain লাগবে, path নয়: https://support.google.com/adsense/answer/2784438
- [ ] AdSense-এর জন্য সাইটের HTML/source access এবং site ownership verification লাগবে: https://support.google.com/adsense/answer/91205
- [ ] বিজ্ঞাপন বসানোর আগে privacy policy, consent এবং audience geography অনুযায়ী আইন/Google policy যাচাই করুন।
- [ ] Direct sponsorship-এর জন্য ব্যক্তিগত তথ্য না প্রকাশ করে একটি public business email বা private contact form স্থাপন করুন। এখনকার GitHub Issues inquiry public; সেখানে পাসওয়ার্ড, ফোন নম্বর, account number বা confidential documents দেবেন না।
- [ ] Visitor, traffic, country বা earnings-এর সংখ্যা বাস্তব analytics ছাড়া sponsor-কে জানাবেন না।

## 5. Privacy, analytics ও security

- [x] বর্তমান সংস্করণে ad script বা analytics tracker নেই বলে Privacy Policy-তে উল্লেখ আছে।
- [x] Calculator-এর amount browser-এ হিসাব হয়; currency API-তে amount পাঠানো হয় না।
- [ ] Analytics যোগ করলে Privacy Policy ও cookie/consent disclosure আগে আপডেট করুন।
- [ ] EEA/UK/Switzerland-এর ব্যবহারকারীকে personalised ads দেখালে Google-এর বর্তমান consent requirements ও certified CMP নিয়ম যাচাই করুন।
- [ ] কোনো API key, private email, password বা account ID HTML/JavaScript-এ রাখবেন না।
- [ ] বিজ্ঞাপন বা third-party script যুক্ত করার আগে privacy, performance এবং mobile layout পুনরায় পরীক্ষা করুন।

## 6. Launch-এর আগে নিজের ফোনে পরীক্ষা

- [ ] বাংলা/English toggle সব পেজে কাজ করে।
- [ ] ৫৮টি currency selector থেকে নির্বাচন করা যায়।
- [ ] Manual rate দিয়ে হিসাব হয়।
- [ ] Salary, budget ও savings calculator-এ ভুল/খালি ইনপুট দিলে নিরাপদ error দেখায়।
- [ ] 360px-প্রস্থ ফোনেও horizontal scroll বা কাটা লেখা নেই।
- [ ] Privacy, Terms, Guides, Rates ও Advertise footer links সঠিক পেজ খোলে।
- [ ] কোনো বাস্তব বিজ্ঞাপন বা sponsor result না থাকলে placeholder-কে live ad বলা হয় না।

## 7. এখনও ব্যবহারকারীর সিদ্ধান্ত বা তথ্য দরকার

- নিজস্ব domain কিনবেন কি না — এখনই কেনা বাধ্যতামূলক নয়; বাজেট শূন্য রাখলে GitHub Pages URL দিয়েই সাইট পরীক্ষা চালানো যায়।
- Sponsors-এর জন্য কোন public business email প্রকাশ করা যাবে।
- ভবিষ্যতে analytics ব্যবহার করতে চান কি না।

**কোনো ডোমেইন, বিজ্ঞাপন অ্যাকাউন্ট, analytics service বা paid plan এই নথি থেকে স্বয়ংক্রিয়ভাবে চালু করা হয়নি।**

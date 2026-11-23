/*
 * GlobalMoneyCalc optional Google Analytics 4 integration.
 * Replace the empty MEASUREMENT_ID with your real public GA4 ID (G-XXXXXXXXXX).
 * Analytics stays OFF until a valid ID is configured AND a visitor accepts.
 */
(() => {
  "use strict";
  const MEASUREMENT_ID = "";
  const CONSENT_KEY = "gmc_ga4_consent_v1";
  if (!/^G-[A-Z0-9]+$/.test(MEASUREMENT_ID)) return;
  const language = () => (document.documentElement.lang || "en").toLowerCase().startsWith("bn") ? "bn" : "en";
  const copy = {
    en: {title:"Your privacy choices",message:"With your permission, Google Analytics helps the site owner understand visits and improve GlobalMoneyCalc. Analytics is optional. Calculator amounts are not sent to Google Analytics.",accept:"Allow analytics",reject:"Reject",reset:"Change analytics choice"},
    bn: {title:"আপনার গোপনীয়তার পছন্দ",message:"আপনার অনুমতি পেলে Google Analytics ভিজিটের তথ্য বুঝতে এবং GlobalMoneyCalc উন্নত করতে সাহায্য করবে। এটি ঐচ্ছিক। ক্যালকুলেটরে লেখা টাকার অঙ্ক Google Analytics-এ পাঠানো হয় না।",accept:"অ্যানালিটিক্স চালু করুন",reject:"অনুমতি দেব না",reset:"অ্যানালিটিক্সের পছন্দ পরিবর্তন"}
  };
  let loaded=false, banner=null;
  function choice(){try{return localStorage.getItem(CONSENT_KEY);}catch(_){return null;}}
  function save(value){try{localStorage.setItem(CONSENT_KEY,value);}catch(_){}}
  function loadAnalytics(){
    if(loaded)return;
    loaded=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments);};
    window.gtag("js",new Date());
    window.gtag("config",MEASUREMENT_ID,{send_page_view:true});
    const script=document.createElement("script");
    script.async=true;
    script.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(MEASUREMENT_ID);
    script.onerror=()=>{loaded=false;};
    document.head.appendChild(script);
  }
  function hideBanner(){if(banner)banner.remove();banner=null;}
  function showBanner(){
    if(banner||choice()==="accepted"||choice()==="rejected")return;
    const words=copy[language()];
    banner=document.createElement("section");
    banner.id="gmc-analytics-consent";
    banner.setAttribute("role","dialog");
    banner.setAttribute("aria-label",words.title);
    banner.innerHTML='<div><strong class="gmc-title"></strong><p class="gmc-message"></p></div><div class="gmc-actions"><button type="button" class="gmc-accept"></button><button type="button" class="gmc-reject"></button></div>';
    banner.querySelector(".gmc-title").textContent=words.title;
    banner.querySelector(".gmc-message").textContent=words.message;
    banner.querySelector(".gmc-accept").textContent=words.accept;
    banner.querySelector(".gmc-reject").textContent=words.reject;
    banner.querySelector(".gmc-accept").addEventListener("click",()=>{save("accepted");hideBanner();loadAnalytics();});
    banner.querySelector(".gmc-reject").addEventListener("click",()=>{save("rejected");hideBanner();});
    document.body.appendChild(banner);
  }
  const style=document.createElement("style");
  style.textContent=`
    #gmc-analytics-consent{position:fixed;z-index:10000;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));max-width:760px;margin:0 auto;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;background:#fff;color:#172039;border:1px solid #dfe4ef;border-radius:16px;box-shadow:0 12px 40px rgba(10,18,40,.22);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
    #gmc-analytics-consent .gmc-title{display:block;font-size:15px;margin-bottom:4px}
    #gmc-analytics-consent .gmc-message{margin:0;color:#53607a;max-width:510px}
    #gmc-analytics-consent .gmc-actions{display:flex;gap:8px;flex-wrap:wrap}
    #gmc-analytics-consent button{border:1px solid #d7dced;border-radius:10px;padding:9px 12px;font:700 13px system-ui;cursor:pointer;background:#f4f6fb;color:#172039}
    #gmc-analytics-consent .gmc-accept{background:#7157f2;border-color:#7157f2;color:#fff}
    #gmc-analytics-consent button:focus-visible{outline:3px solid #998cff;outline-offset:3px}
    @media(max-width:520px){#gmc-analytics-consent{align-items:stretch}#gmc-analytics-consent .gmc-actions{width:100%}#gmc-analytics-consent button{flex:1}}
  `;
  document.head.appendChild(style);
  function render(){
    if(choice()==="accepted"){hideBanner();loadAnalytics();}
    else if(choice()==="rejected")hideBanner();
    else showBanner();
    const reset=document.querySelector("[data-analytics-reset]");
    if(reset){
      reset.hidden=false;
      reset.textContent=copy[language()].reset;
      reset.addEventListener("click",()=>{try{localStorage.removeItem(CONSENT_KEY);}catch(_){}hideBanner();showBanner();},{once:true});
    }
  }
  render();
  new MutationObserver(()=>{
    if(banner){const old=banner;banner=null;old.remove();showBanner();}
    const reset=document.querySelector("[data-analytics-reset]");
    if(reset)reset.textContent=copy[language()].reset;
  }).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
})();

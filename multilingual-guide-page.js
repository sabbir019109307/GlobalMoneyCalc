/* Ten-language rendering for detailed calculator guides. */
(() => {
 "use strict";
 const data={...(window.GMC_GUIDE_BASE_WORDS||{})};
 Object.entries((window.GMC_PAGE_WORDS||{}).guides||{}).forEach(([code,words])=>{
  data[code]={...(data[code]||{}),...words};
 });
 const select=document.getElementById("languageSelect");
 const supported=["en","bn","zh","hi","es","ar","fr","pt","ru","id"];
 let lang=(()=>{try{const saved=localStorage.getItem("gmc_language");return supported.includes(saved)?saved:"en";}catch{return "en";}})();
 function apply(next,save=true){
  if(supported.includes(next))lang=next;
  const words=data[lang]||data.en||{};
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-guide-word]").forEach(node=>{
   const key=node.getAttribute("data-guide-word");
   if(words[key]!==undefined)node.innerHTML=words[key];
  });
  if(select){select.value=lang;select.setAttribute("aria-label",({en:"Choose language",bn:"ভাষা নির্বাচন করুন",zh:"选择语言",hi:"भाषा चुनें",es:"Elegir idioma",ar:"اختر اللغة",fr:"Choisir la langue",pt:"Escolher idioma",ru:"Выбрать язык",id:"Pilih bahasa"})[lang]||"Choose language");}
  const titleKey=document.body.getAttribute("data-guide-title-key");
  if(titleKey&&words[titleKey])document.title=words[titleKey]+" | GlobalMoneyCalc";
  if(save){try{localStorage.setItem("gmc_language",lang);}catch{}}
 }
 if(select)select.addEventListener("change",()=>apply(select.value));
 apply(lang,false);
})();

/* Ten-language rendering for detailed calculator guides. */
(() => {
 "use strict";
 const data = window.GMC_PAGE_WORDS && window.GMC_PAGE_WORDS.guides;
 const select = document.getElementById("languageSelect");
 const supported = ["en","bn","zh","hi","es","ar","fr","pt","ru","id"];
 let lang = (() => { try { const saved=localStorage.getItem("gmc_language"); return supported.includes(saved)?saved:"en"; } catch { return "en"; } })();
 function apply(next, save=true) {
  if (supported.includes(next)) lang=next;
  const words=(data && data[lang]) || (data && data.en) || {};
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-guide-word]").forEach(node=>{
   const key=node.getAttribute("data-guide-word");
   if(words[key]!==undefined) node.innerHTML=words[key];
  });
  if(select){select.value=lang;select.setAttribute("aria-label",(window.GMC_LANGUAGE_LABELS?.[lang]?.name)||"Choose language");}
  const titleKey=document.body.getAttribute("data-guide-title-key");
  if(titleKey && words[titleKey]) document.title=words[titleKey]+" | GlobalMoneyCalc";
  if(save){try{localStorage.setItem("gmc_language",lang);}catch{}}
 }
 if(select) select.addEventListener("change",()=>apply(select.value));
 apply(lang,false);
})();

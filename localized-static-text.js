/* Localize the small site-credit line consistently across all supported languages. */
(() => {
 "use strict";
 const words={
  en:"Created with ❤️ by",bn:"তৈরি করেছেন ❤️",zh:"由 ❤️ 制作",hi:"❤️ द्वारा बनाया गया",es:"Creado con ❤️ por",
  ar:"تم الإنشاء بواسطة ❤️",fr:"Créé avec ❤️ par",pt:"Criado com ❤️ por",ru:"Создано с ❤️",id:"Dibuat dengan ❤️ oleh"
 };
 const select=document.getElementById("languageSelect");
 function apply(code){
  const lang=words[code]?code:"en";
  document.querySelectorAll("[data-gmc-lang-en][data-gmc-lang-bn]").forEach(node=>{node.textContent=words[lang];});
 }
 function applyCurrent(){apply(select?select.value:(document.documentElement.lang||"en"));}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",applyCurrent,{once:true});else applyCurrent();
 if(select)select.addEventListener("change",()=>apply(select.value));
})();

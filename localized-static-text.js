/* Keep the site credit and language-control accessibility text localized. */
(() => {
 "use strict";
 const words={
  en:"Created with ❤️ by",bn:"তৈরি করেছেন ❤️",zh:"由 ❤️ 制作",hi:"❤️ द्वारा बनाया गया",es:"Creado con ❤️ por",
  ar:"تم الإنشاء بواسطة ❤️",fr:"Créé avec ❤️ par",pt:"Criado com ❤️ por",ru:"Создано с ❤️",id:"Dibuat dengan ❤️ oleh"
 };
 const labels={en:"Choose language",bn:"ভাষা নির্বাচন করুন",zh:"选择语言",hi:"भाषा चुनें",es:"Elegir idioma",ar:"اختر اللغة",fr:"Choisir la langue",pt:"Escolher idioma",ru:"Выбрать язык",id:"Pilih bahasa"};
 function apply(){
  const select=document.getElementById("languageSelect");
  const lang=select&&labels[select.value]?select.value:(document.documentElement.lang||"en");
  document.querySelectorAll("[data-gmc-lang-en][data-gmc-lang-bn]").forEach(node=>{node.textContent=words[lang]||words.en;});
  if(select)select.setAttribute("aria-label",labels[lang]||labels.en);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",apply,{once:true});else apply();
 const select=document.getElementById("languageSelect");
 if(select)select.addEventListener("change",apply);
})();

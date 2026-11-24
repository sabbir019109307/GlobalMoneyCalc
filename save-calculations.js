/* GlobalMoneyCalc saved calculations v3 */
(() => {
  "use strict";
  const KEY = "gmc_saved_calculations_v1";
  const tools = [
    {type:"currency", result:"currencyResult", inputs:["amount","fromCurrency","toCurrency","rate","dailyMode","manualMode"]},
    {type:"salary", result:"salaryResult", inputs:["salaryAmount","salaryCurrency","days","hours","deduction"]},
    {type:"budget", result:"budgetResult", inputs:["income","budgetCurrency","housing","food","transport","other"]},
    {type:"savings", result:"savingsResult", inputs:["monthlySave","savingsCurrency","months","interest"]}
  ];
  const $ = id => document.getElementById(id);
  const bn = () => (document.documentElement.lang || "").toLowerCase().startsWith("bn");
  const words = {
    save:()=>bn()?"এই হিসাব সংরক্ষণ করুন":"Save this calculation",
    heading:()=>bn()?"সংরক্ষিত হিসাব":"Saved calculations",
    empty:()=>bn()?"এখনো কোনো হিসাব সংরক্ষণ করা হয়নি।":"No saved calculations yet.",
    saved:()=>bn()?"হিসাবটি এই ডিভাইসে সংরক্ষিত হয়েছে।":"Calculation saved on this device.",
    failed:()=>bn()?"সংরক্ষণ করা যায়নি। ব্রাউজারের স্টোরেজ পরীক্ষা করুন।":"Could not save. Check browser storage.",
    noResult:()=>bn()?"আগে হিসাব করুন, তারপর সংরক্ষণ করুন।":"Calculate first, then save.",
    remove:()=>bn()?"মুছুন":"Delete"
  };
  function read() {
    try { const x=JSON.parse(localStorage.getItem(KEY)||"[]"); return Array.isArray(x)?x:[]; }
    catch(e) { return []; }
  }
  function render() {
    const list=$("gmc-saved-list"); if(!list) return;
    list.replaceChildren();
    const items=read();
    if(!items.length){ const p=document.createElement("p"); p.textContent=words.empty(); list.append(p); return; }
    items.forEach(item=>{
      const card=document.createElement("article");
      const title=document.createElement("strong"); title.textContent=item.type==="salary"?(bn()?"বেতনের হিসাব":"Salary calculation"):item.type;
      const result=document.createElement("p"); result.textContent=item.result;
      const date=document.createElement("small"); date.textContent=new Date(item.date).toLocaleString();
      const del=document.createElement("button"); del.type="button"; del.textContent=words.remove();
      del.addEventListener("click",()=>{localStorage.setItem(KEY,JSON.stringify(read().filter(x=>x.id!==item.id)));render();});
      card.append(title,result,date,del); card.style.cssText="padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:10px";
      list.append(card);
    });
  }
  function init() {
    if ($("gmc-save-section")) return;
    tools.forEach(tool=>{
      const result=$(tool.result);
      if(!result) return;
      let button=$("gmc-save-"+tool.type);
      if(!button){
        button=document.createElement("button");
        button.id="gmc-save-"+tool.type; button.type="button";
        button.className="btn secondary";
        button.textContent=words.save();
        button.style.cssText="display:block;width:100%;margin-top:10px;padding:12px;cursor:pointer";
        result.insertAdjacentElement("afterend",button);
      }
      button.addEventListener("click",()=>{
        const output=(result.innerText||"").trim();
        if(!output || result.classList.contains("empty")) { window.alert(words.noResult()); return; }
        try {
          const values={};
          tool.inputs.forEach(id=>{const el=$(id); if(el) values[id]=el.value;});
          const items=read();
          items.unshift({id:String(Date.now())+Math.random(),type:tool.type,result:output,values,date:new Date().toISOString()});
          localStorage.setItem(KEY,JSON.stringify(items.slice(0,100)));
          render();
          window.alert(words.saved());
        } catch(e) { window.alert(words.failed()); }
      });
    });
    const section=document.createElement("section");
    section.id="gmc-save-section";
    section.style.cssText="margin:28px 0;padding:18px;background:#fff;border:1px solid #ddd;border-radius:14px";
    const h=document.createElement("h2"); h.textContent=words.heading();
    const list=document.createElement("div"); list.id="gmc-saved-list";
    section.append(h,list);
    const anchor=$("tools");
    if(anchor) anchor.insertAdjacentElement("afterend",section);
    else document.body.append(section);
    render();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();

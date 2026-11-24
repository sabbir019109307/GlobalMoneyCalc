/* GlobalMoneyCalc saved calculations v4 */
(() => {
  "use strict";
  const KEY = "gmc_saved_calculations_v1";
  const tools = [
    {type:"currency",result:"currencyResult",inputs:["amount","fromCurrency","toCurrency","rate"]},
    {type:"salary",result:"salaryResult",inputs:["salaryAmount","salaryCurrency","days","hours","deduction"]},
    {type:"budget",result:"budgetResult",inputs:["income","budgetCurrency","housing","food","transport","other"]},
    {type:"savings",result:"savingsResult",inputs:["monthlySave","savingsCurrency","months","interest"]}
  ];
  const $ = id => document.getElementById(id);
  const bn = () => (document.documentElement.lang || "").toLowerCase().startsWith("bn");
  const say = (en,bnText) => bn() ? bnText : en;
  function read() {
    try { const v=JSON.parse(localStorage.getItem(KEY)||"[]"); return Array.isArray(v)?v:[]; }
    catch (_) { return []; }
  }
  function status(message, ok, button) {
    const type=button ? button.getAttribute("data-gmc-save") : "global";
    const id="gmc-save-status-"+type;
    let node=$(id);
    if(!node) {
      node=document.createElement("p"); node.id=id;
      node.setAttribute("role","status"); node.setAttribute("aria-live","polite");
      node.style.cssText="display:block;min-height:22px;margin:7px 0 0;padding:8px 10px;border-radius:9px;font-size:13px;font-weight:700";
      if(button) button.insertAdjacentElement("afterend",node);
      else { const section=$("gmc-save-section"); if(section) section.append(node); else document.body.append(node); }
    }
    node.textContent=message;
    node.style.background=ok?"#e8f8ef":"#fff0ed";
    node.style.color=ok?"#17643a":"#9a2d20";
  }
  function render() {
    const list=$("gmc-saved-list"); if(!list) return;
    list.replaceChildren();
    const items=read();
    if(!items.length) {
      const p=document.createElement("p");
      p.textContent=say("No saved calculations yet.","এখনো কোনো হিসাব সংরক্ষণ করা হয়নি।");
      list.append(p); return;
    }
    items.forEach(item=>{
      const card=document.createElement("article");
      card.style.cssText="padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:10px";
      const title=document.createElement("strong");
      title.textContent=item.type==="salary"?say("Salary calculation","বেতনের হিসাব"):item.type;
      const result=document.createElement("p"); result.textContent=item.result;
      const date=document.createElement("small"); date.textContent=new Date(item.date).toLocaleString();
      const del=document.createElement("button"); del.type="button";
      del.textContent=say("Delete","মুছুন");
      del.addEventListener("click",()=>{
        try { localStorage.setItem(KEY,JSON.stringify(read().filter(x=>x.id!==item.id))); render(); }
        catch (_) { status(say("Could not delete this record.","হিসাবটি মুছতে পারিনি।"),false); }
      });
      card.append(title,result,date,del); list.append(card);
    });
  }
  function init() {
    tools.forEach(tool=>{
      const result=$(tool.result);
      if(!result) return;
      let button=$("gmc-save-"+tool.type);
      if(!button) {
        button=document.createElement("button");
        button.id="gmc-save-"+tool.type; button.type="button";
        button.className="btn primary";
        button.style.cssText="display:block;width:100%;margin-top:10px;padding:12px;cursor:pointer";
        result.insertAdjacentElement("afterend",button);
      }
      button.textContent=say("Save this calculation","এই হিসাব সংরক্ষণ করুন");
      button.setAttribute("data-gmc-save",tool.type);
      const statusId="gmc-save-status-"+tool.type;
      if(!$(statusId)) {
        const note=document.createElement("p"); note.id=statusId;
        note.setAttribute("role","status"); note.setAttribute("aria-live","polite");
        note.style.cssText="display:block;min-height:22px;margin:7px 0 0;padding:0;font-size:13px;font-weight:700";
        button.insertAdjacentElement("afterend",note);
      }
    });
    let section=$("gmc-save-section");
    if(!section) {
      section=document.createElement("section"); section.id="gmc-save-section";
      section.style.cssText="margin:28px 0;padding:18px;background:#fff;border:1px solid #ddd;border-radius:14px";
      const h=document.createElement("h2"); h.textContent=say("Saved calculations","সংরক্ষিত হিসাব");
      const list=document.createElement("div"); list.id="gmc-saved-list";
      section.append(h,list);
      const anchor=$("tools");
      if(anchor) anchor.insertAdjacentElement("afterend",section); else document.body.append(section);
    }
    render();
  }
  document.addEventListener("click",event=>{
    const button=event.target && event.target.closest ? event.target.closest("[data-gmc-save]") : null;
    if(!button) return;
    event.preventDefault();
    const tool=tools.find(x=>x.type===button.getAttribute("data-gmc-save"));
    if(!tool) return;
    const result=$(tool.result);
    const output=result ? (result.innerText||result.textContent||"").trim() : "";
    if(!result || !output || result.classList.contains("empty")) {
      status(say("Calculate first, then save.","আগে হিসাব করুন, তারপর সংরক্ষণ করুন।"),false,button); return;
    }
    try {
      const values={};
      tool.inputs.forEach(id=>{const field=$(id); if(field) values[id]=field.value;});
      const items=read();
      items.unshift({id:String(Date.now())+"-"+Math.random().toString(36).slice(2),type:tool.type,result:output,values,date:new Date().toISOString()});
      localStorage.setItem(KEY,JSON.stringify(items.slice(0,100)));
      render();
      status(say("Saved successfully on this device.","✓ হিসাব সংরক্ষিত হয়েছে!"),true,button);
    } catch (_) {
      status(say("Saving failed. Your browser may be blocking local storage.","✗ সংরক্ষণ হয়নি। ব্রাউজারের স্টোরেজ অনুমতি পরীক্ষা করুন।"),false,button);
    }
  },true);
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
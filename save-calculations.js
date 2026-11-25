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
      const date=document.createElement("small");
      const parsedDate=item.date?new Date(item.date):null;
      date.textContent=parsedDate&&Number.isFinite(parsedDate.getTime())?parsedDate.toLocaleString():say("Date unavailable","তারিখ পাওয়া যায়নি");
      const del=document.createElement("button"); del.type="button";
      del.textContent=say("Delete","মুছুন");
      del.addEventListener("click",()=>{
        try { localStorage.setItem(KEY,JSON.stringify(read().filter(x=>x.id!==item.id))); render(); }
        catch (_) { status(say("Could not delete this record.","হিসাবটি মুছতে পারিনি।"),false); }
      });
      card.append(title,result,date,del); list.append(card);
    });
  }
  function exportSavedPdf() {
    const items=read();
    if(!items.length) {
      status(say("There are no saved calculations to export.","PDF করার মতো কোনো সংরক্ষিত হিসাব নেই।"),false);
      return;
    }
    const lang=(document.documentElement.lang||"en").toLowerCase().split("-")[0];
    const bn=lang==="bn";
    const labels=bn?{
      title:"সংরক্ষিত হিসাবসমূহ",created:"তৈরির সময়",type:"হিসাবের ধরন",
      result:"ফলাফল",details:"ইনপুটের বিবরণ",date:"তারিখ পাওয়া যায়নি",
      note:"এই PDF আপনার এই ডিভাইসে সংরক্ষিত হিসাব থেকে তৈরি।",
      print:"PDF হিসেবে সংরক্ষণ / প্রিন্ট"
    }:{
      title:"All Saved Calculations",created:"Exported",type:"Calculation type",
      result:"Result",details:"Input details",date:"Date unavailable",
      note:"This PDF was generated from calculations saved on this device.",
      print:"Save as PDF / Print"
    };
    const esc=value=>String(value==null?"":value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
    const typeNames={currency:bn?"মুদ্রা রূপান্তর":"Currency",salary:bn?"বেতন":"Salary",budget:bn?"মাসিক বাজেট":"Monthly budget",savings:bn?"সঞ্চয়":"Savings"};
    const sections=items.map((item,index)=>{
      const d=item.date?new Date(item.date):null;
      const date=d&&Number.isFinite(d.getTime())?d.toLocaleString():labels.date;
      const values=item.values&&typeof item.values==="object"?Object.entries(item.values):[];
      const rows=values.map(([key,value])=>"<tr><th>"+esc(key)+"</th><td>"+esc(value)+"</td></tr>").join("");
      return "<section class='record'><h2>"+(index+1)+". "+esc(typeNames[item.type]||item.type||labels.type)+"</h2><p class='date'>"+esc(date)+"</p><h3>"+esc(labels.result)+"</h3><p class='result'>"+esc(item.result||"")+"</p>"+(rows?"<h3>"+esc(labels.details)+"</h3><table>"+rows+"</table>":"")+"</section>";
    }).join("");
    const now=new Date().toLocaleString();
    const html='<!doctype html><html lang="'+(bn?"bn":"en")+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(labels.title)+'</title><style>body{font-family:system-ui,-apple-system,"Noto Sans Bengali","Segoe UI",sans-serif;color:#172039;line-height:1.55;margin:0;padding:24px}main{max-width:800px;margin:auto}.brand{font-weight:800;color:#6652d9}.date,.note{color:#68738a;font-size:12px}h1{font-size:25px;margin:8px 0}h2{font-size:19px;margin:0 0 4px}h3{font-size:14px;margin:14px 0 5px}.record{padding:18px 0;border-bottom:2px solid #e5e9f2;break-inside:avoid}.result{white-space:pre-wrap;background:#f5f6fb;border:1px solid #e2e6ef;padding:12px;border-radius:9px}table{width:100%;border-collapse:collapse}th,td{text-align:start;padding:7px;border-bottom:1px solid #e5e9f2}th{width:45%;color:#58647b}.actions{margin:18px 0}.actions button{background:#6652d9;color:white;border:0;border-radius:8px;padding:11px 16px;font-weight:700}@media print{body{padding:0}.actions{display:none}}@page{margin:15mm}</style></head><body><main><div class="brand">GlobalMoneyCalc</div><h1>'+esc(labels.title)+'</h1><p class="date">'+esc(labels.created)+': '+esc(now)+' · '+items.length+'</p>'+sections+'<p class="note">'+esc(labels.note)+'</p><div class="actions"><button onclick="window.print()">'+esc(labels.print)+'</button></div></main><script>window.addEventListener("load",function(){setTimeout(function(){window.focus();window.print()},350)})<\\/script></body></html>';
    const popup=window.open("","_blank");
    if(!popup) {
      status(say("Allow pop-ups for this site, then try again.","এই সাইটের Pop-ups অনুমতি দিয়ে আবার চেষ্টা করুন।"),false);
      return;
    }
    popup.document.open(); popup.document.write(html); popup.document.close();
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
      const exportButton=document.createElement("button");
      exportButton.id="gmc-export-saved-pdf"; exportButton.type="button";
      exportButton.className="btn primary";
      exportButton.style.cssText="display:block;width:100%;margin:12px 0;padding:12px;cursor:pointer";
      exportButton.textContent=say("Download all saved as PDF","সব সংরক্ষিত হিসাব PDF ডাউনলোড");
      exportButton.addEventListener("click",exportSavedPdf);
      const list=document.createElement("div"); list.id="gmc-saved-list";
      section.append(h,exportButton,list);
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
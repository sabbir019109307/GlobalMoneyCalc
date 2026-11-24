/* GlobalMoneyCalc saved calculations — browser-local storage. */
(() => {
  "use strict";
  const KEY = "gmc_saved_calculations_v1";
  const $ = id => document.getElementById(id);
  const words = {
    en: {
      save:"Save this calculation", saved:"Saved calculations",
      empty:"No saved calculations yet. Calculate an amount and tap “Save this calculation”.",
      savedAt:"Saved", delete:"Delete", confirm:"Delete this saved calculation?",
      clear:"Clear all", clearConfirm:"Delete all saved calculations on this device?",
      savedOk:"Calculation saved on this device.", limit:"You can save up to 100 calculations. Delete an old one to save more.",
      currency:"Currency conversion", salary:"Salary calculation", budget:"Monthly budget", savings:"Savings projection",
      storage:"Saved only in this browser on this device. Clearing browser data may erase these records.",
      restore:"Restore inputs", storageUnavailable:"Browser storage is unavailable or full.",
      calculateFirst:"Calculate first, then save the result."
    },
    bn: {
      save:"এই হিসাব সংরক্ষণ করুন", saved:"সংরক্ষিত হিসাব",
      empty:"এখনো কোনো হিসাব সংরক্ষণ করা হয়নি। আগে হিসাব করুন, তারপর সংরক্ষণের বোতাম চাপুন।",
      savedAt:"সংরক্ষণের সময়", delete:"মুছুন", confirm:"এই সংরক্ষিত হিসাবটি মুছে ফেলবেন?",
      clear:"সব মুছুন", clearConfirm:"এই ডিভাইসের সব সংরক্ষিত হিসাব মুছে ফেলবেন?",
      savedOk:"এই ডিভাইসে হিসাব সংরক্ষিত হয়েছে।", limit:"সর্বোচ্চ ১০০টি হিসাব রাখা যাবে। নতুন হিসাব রাখতে পুরোনো একটি মুছুন।",
      currency:"মুদ্রা রূপান্তরের হিসাব", salary:"বেতনের হিসাব", budget:"মাসিক বাজেট", savings:"সঞ্চয়ের হিসাব",
      storage:"হিসাব শুধু এই ডিভাইসের এই ব্রাউজারে সংরক্ষিত থাকে। ব্রাউজারের ডেটা মুছলে এগুলোও মুছে যেতে পারে।",
      restore:"ইনপুট ফিরিয়ে আনুন", storageUnavailable:"ব্রাউজারে সংরক্ষণ করা যাচ্ছে না বা জায়গা নেই।",
      calculateFirst:"আগে হিসাব করুন, তারপর ফলাফল সংরক্ষণ করুন।"
    }
  };
  Object.assign(words, window.GMC_SAVE_WORDS || {});
  const language = () => {
    const code = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
    return words[code] ? code : "en";
  };
  const locale = () => ((window.GMC_LOCALES || {})[language()] || "en-US");
  const t = key => (words[language()] && words[language()][key]) || words.en[key] || key;
  const fields = {
    currency:["amount","fromCurrency","toCurrency","rate","dailyMode","manualMode"],
    salary:["salaryAmount","salaryCurrency","days","hours","deduction"],
    budget:["income","budgetCurrency","housing","food","transport","other"],
    savings:["monthlySave","savingsCurrency","months","interest"]
  };
  const labels = {currency:"currency",salary:"salary",budget:"budget",savings:"savings"};
  const tools = [
    {type:"currency", result:"currencyResult", button:"convert"},
    {type:"salary", result:"salaryResult", button:"calcSalary"},
    {type:"budget", result:"budgetResult", button:"calcBudget"},
    {type:"savings", result:"savingsResult", button:"calcSavings"}
  ];
  let statusNode;
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(value) ? value.filter(x => x && typeof x.id === "string" && typeof x.result === "string").slice(0,100) : [];
    } catch (_) { return []; }
  }
  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); return true; }
    catch (_) { return false; }
  }
  function valueOf(id) {
    const node = $(id);
    if (!node) return null;
    if (node.tagName === "BUTTON") return node.classList.contains("active");
    return node.value;
  }
  function restoreValues(values) {
    Object.entries(values || {}).forEach(([id,value]) => {
      const node = $(id);
      if (!node) return;
      if (id === "dailyMode" || id === "manualMode") { if (value) node.click(); }
      else if (node.tagName === "SELECT" || node.tagName === "INPUT") node.value = value;
    });
  }
  function hasResult(result) {
    return !!result && !result.classList.contains("empty") && !!result.innerText.trim();
  }
  function render() {
    const list = $("gmc-saved-list");
    if (!list) return;
    list.replaceChildren();
    const items = read();
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "gmc-save-empty";
      empty.textContent = t("empty");
      list.appendChild(empty);
      return;
    }
    items.forEach(item => {
      const card = document.createElement("article");
      card.className = "gmc-saved-card";
      const title = document.createElement("strong");
      title.textContent = t(labels[item.type] || "saved");
      const result = document.createElement("p");
      result.className = "gmc-saved-result";
      result.textContent = item.result;
      const date = document.createElement("small");
      const d = new Date(item.savedAt);
      date.textContent = t("savedAt") + ": " + (Number.isNaN(d.getTime()) ? "" : new Intl.DateTimeFormat(locale(), {dateStyle:"medium",timeStyle:"short"}).format(d));
      const actions = document.createElement("div");
      actions.className = "gmc-saved-actions";
      const restore = document.createElement("button");
      restore.type = "button";
      restore.textContent = t("restore");
      restore.addEventListener("click", () => {
        restoreValues(item.values);
        const target = $(item.type);
        if (target) target.scrollIntoView({behavior:"smooth",block:"center"});
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = t("delete");
      remove.addEventListener("click", () => {
        if (!window.confirm(t("confirm"))) return;
        write(read().filter(x => x.id !== item.id));
        render();
      });
      actions.append(restore, remove);
      card.append(title, result, date, actions);
      list.appendChild(card);
    });
  }
  function refreshButtons() {
    tools.forEach(tool => {
      const button = $(tool.button + "_save");
      if (button) button.disabled = !hasResult($(tool.result));
    });
  }
  function setup() {
    tools.forEach(tool => {
      const result = $(tool.result);
      const calculator = $(tool.type);
      if (!result || !calculator) return;
      let button = $(tool.button + "_save");
      if (!button) {
        button = document.createElement("button");
        button.type = "button";
        button.id = tool.button + "_save";
        button.className = "btn secondary gmc-save-button";
        button.textContent = t("save");
        result.insertAdjacentElement("afterend", button);
      }
      button.disabled = !hasResult(result);
      button.addEventListener("click", () => {
        if (!hasResult(result)) {
          if (statusNode) statusNode.textContent = t("calculateFirst");
          return;
        }
        const items = read();
        if (items.length >= 100) {
          if (statusNode) statusNode.textContent = t("limit");
          return;
        }
        const values = {};
        (fields[tool.type] || []).forEach(id => { values[id] = valueOf(id); });
        const id = window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(36).slice(2);
        items.unshift({id,type:tool.type,values,result:result.innerText.trim(),savedAt:new Date().toISOString()});
        if (!write(items)) {
          if (statusNode) statusNode.textContent = t("storageUnavailable");
          return;
        }
        if (statusNode) statusNode.textContent = t("savedOk");
        render();
      });
      new MutationObserver(refreshButtons).observe(result, {attributes:true,childList:true,characterData:true,subtree:true});
    });
    const section = document.createElement("section");
    section.id = "gmc-saved-calculations";
    section.className = "gmc-saved-section";
    const heading = document.createElement("div");
    heading.className = "gmc-saved-heading";
    const intro = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = t("saved");
    const note = document.createElement("p");
    note.className = "gmc-storage-note";
    note.textContent = t("storage");
    intro.append(title,note);
    const clear = document.createElement("button");
    clear.type = "button";
    clear.id = "gmc-clear-saved";
    clear.textContent = t("clear");
    heading.append(intro,clear);
    statusNode = document.createElement("p");
    statusNode.id = "gmc-save-status";
    statusNode.setAttribute("role","status");
    statusNode.setAttribute("aria-live","polite");
    const list = document.createElement("div");
    list.id = "gmc-saved-list";
    section.append(heading,statusNode,list);
    clear.addEventListener("click", () => {
      if (!read().length) return;
      if (window.confirm(t("clearConfirm"))) {
        write([]);
        statusNode.textContent = "";
        render();
      }
    });
    const toolsSection = $("tools");
    if (toolsSection) toolsSection.insertAdjacentElement("afterend",section);
    render();
    window.addEventListener("storage", event => { if (event.key === KEY) render(); });
    new MutationObserver(() => {
      title.textContent = t("saved");
      note.textContent = t("storage");
      clear.textContent = t("clear");
      section.querySelectorAll(".gmc-save-button").forEach(b => b.textContent = t("save"));
      render();
    }).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
    refreshButtons();
  }
  const style = document.createElement("style");
  style.textContent = `
    .gmc-save-button{width:100%;margin-top:9px;border:1px solid #dce2ee;background:#f4f6fb;color:#34405d;box-shadow:none}
    .gmc-save-button:disabled{opacity:.55;cursor:not-allowed}
    .gmc-saved-section{margin:28px 0 8px;padding:22px;background:#fff;border:1px solid #e5e9f2;border-radius:20px;box-shadow:0 6px 22px #1a234708}
    .gmc-saved-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
    .gmc-saved-heading h2{font-size:23px;margin:0}
    .gmc-storage-note,.gmc-save-empty{font-size:13px;color:#65708a;margin:5px 0 0}
    #gmc-clear-saved,.gmc-saved-actions button{border:1px solid #dce2ee;border-radius:9px;padding:8px 11px;background:#f4f6fb;color:#34405d;font-weight:700;cursor:pointer}
    #gmc-save-status{font-size:13px;color:#25816f;min-height:18px}
    #gmc-saved-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .gmc-saved-card{min-width:0;border:1px solid #e5e9f2;border-radius:13px;padding:14px;background:#fbfcff}
    .gmc-saved-card>strong{display:block}
    .gmc-saved-result{white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;color:#34405d}
    .gmc-saved-card small{color:#65708a}
    .gmc-saved-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
    @media(max-width:650px){#gmc-saved-list{grid-template-columns:1fr}.gmc-saved-section{padding:16px}}
  `;
  document.head.appendChild(style);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",setup,{once:true});
  else setup();
})();

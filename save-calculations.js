/*
 * GlobalMoneyCalc: save calculator results on this device.
 * No account, server upload, or cross-device sync. Data stays in localStorage.
 */
(() => {
  "use strict";
  const KEY = "gmc_saved_calculations_v1";
  const $ = id => document.getElementById(id);
  const words = {
    en: {
      save:"Save this calculation", saved:"Saved calculations", empty:"No saved calculations yet. Calculate an amount and tap “Save this calculation”.",
      savedAt:"Saved", delete:"Delete", confirm:"Delete this saved calculation?", clear:"Clear all",
      clearConfirm:"Delete all saved calculations on this device?", savedOk:"Calculation saved on this device.",
      limit:"You can save up to 100 calculations. Delete an old one to save more.",
      currency:"Currency conversion", salary:"Salary calculation", budget:"Monthly budget", savings:"Savings projection",
      storage:"Saved only in this browser on this device. Clearing browser data may erase these records.", restore:"Restore inputs", storageUnavailable:"Browser storage is unavailable or full."
    },
    bn: {
      save:"এই হিসাব সংরক্ষণ করুন", saved:"সংরক্ষিত হিসাব", empty:"এখনো কোনো হিসাব সংরক্ষণ করা হয়নি। হিসাব করে “এই হিসাব সংরক্ষণ করুন” চাপুন।",
      savedAt:"সংরক্ষণের সময়", delete:"মুছুন", confirm:"এই সংরক্ষিত হিসাবটি মুছে ফেলবেন?",
      clear:"সব মুছুন", clearConfirm:"এই ডিভাইসের সব সংরক্ষিত হিসাব মুছে ফেলবেন?",
      savedOk:"এই ডিভাইসে হিসাব সংরক্ষিত হয়েছে।", limit:"সর্বোচ্চ ১০০টি হিসাব রাখা যাবে। নতুন হিসাব রাখতে পুরোনো একটি মুছুন।",
      currency:"মুদ্রা রূপান্তরের হিসাব", salary:"বেতনের হিসাব", budget:"মাসিক বাজেট", savings:"সঞ্চয়ের হিসাব",
      storage:"হিসাব শুধু এই ডিভাইসের এই ব্রাউজারে সংরক্ষিত থাকে। ব্রাউজারের ডেটা মুছলে এগুলোও মুছে যেতে পারে।", restore:"ইনপুট ফিরিয়ে আনুন", storageUnavailable:"ব্রাউজারে জায়গা পাওয়া যায়নি।"
    }
  };
  Object.assign(words, {"zh":{"save":"保存此计算","saved":"已保存的计算","empty":"尚无保存的计算。请先计算，然后点击“保存此计算”。","savedAt":"保存时间","delete":"删除","confirm":"删除此计算记录？","clear":"全部清除","clearConfirm":"清除此设备上保存的所有计算？","savedOk":"计算已保存在此设备。","limit":"最多可保存 100 条记录。请删除旧记录后再保存。","currency":"货币换算","salary":"工资计算","budget":"月度预算","savings":"储蓄预测","storage":"仅保存在此设备的当前浏览器中。清除浏览器数据可能会删除这些记录。","restore":"恢复输入","storageUnavailable":"浏览器存储不可用或已满。"},"hi":{"save":"यह गणना सहेजें","saved":"सहेजी गई गणनाएँ","empty":"अभी कोई गणना सहेजी नहीं गई है। पहले गणना करें और “यह गणना सहेजें” दबाएँ।","savedAt":"सहेजा गया","delete":"हटाएँ","confirm":"यह सहेजी गई गणना हटाएँ?","clear":"सभी हटाएँ","clearConfirm":"इस डिवाइस की सभी सहेजी गई गणनाएँ हटाएँ?","savedOk":"गणना इस डिवाइस पर सहेजी गई।","limit":"अधिकतम 100 गणनाएँ सहेज सकते हैं। नई सहेजने से पहले पुरानी हटाएँ।","currency":"मुद्रा रूपांतरण","salary":"वेतन गणना","budget":"मासिक बजट","savings":"बचत अनुमान","storage":"यह रिकॉर्ड केवल इसी डिवाइस के इस ब्राउज़र में सहेजे जाते हैं। ब्राउज़र डेटा साफ़ करने से ये मिट सकते हैं।","restore":"इनपुट वापस लाएँ","storageUnavailable":"ब्राउज़र स्टोरेज उपलब्ध नहीं है या भर गया है।"},"es":{"save":"Guardar este cálculo","saved":"Cálculos guardados","empty":"Todavía no hay cálculos guardados. Calcula una cantidad y pulsa «Guardar este cálculo».","savedAt":"Guardado","delete":"Eliminar","confirm":"¿Eliminar este cálculo guardado?","clear":"Borrar todo","clearConfirm":"¿Eliminar todos los cálculos guardados en este dispositivo?","savedOk":"Cálculo guardado en este dispositivo.","limit":"Puedes guardar hasta 100 cálculos. Elimina uno antiguo para guardar más.","currency":"Conversión de divisas","salary":"Cálculo de salario","budget":"Presupuesto mensual","savings":"Proyección de ahorros","storage":"Se guarda solo en este navegador y dispositivo. Al borrar los datos del navegador, estos registros pueden desaparecer.","restore":"Restaurar datos","storageUnavailable":"El almacenamiento del navegador no está disponible o está lleno."},"ar":{"save":"احفظ هذا الحساب","saved":"الحسابات المحفوظة","empty":"لا توجد حسابات محفوظة بعد. احسب مبلغاً ثم اضغط «احفظ هذا الحساب».","savedAt":"تم الحفظ","delete":"حذف","confirm":"هل تريد حذف هذا الحساب المحفوظ؟","clear":"حذف الكل","clearConfirm":"هل تريد حذف جميع الحسابات المحفوظة على هذا الجهاز؟","savedOk":"تم حفظ الحساب على هذا الجهاز.","limit":"يمكنك حفظ 100 حساب كحد أقصى. احذف حساباً قديماً لحفظ المزيد.","currency":"تحويل العملات","salary":"حساب الراتب","budget":"الميزانية الشهرية","savings":"توقع الادخار","storage":"يُحفظ هذا السجل في المتصفح وعلى هذا الجهاز فقط. قد يؤدي مسح بيانات المتصفح إلى حذفه.","restore":"استعادة المدخلات","storageUnavailable":"مساحة تخزين المتصفح غير متاحة أو ممتلئة."},"fr":{"save":"Enregistrer ce calcul","saved":"Calculs enregistrés","empty":"Aucun calcul enregistré. Effectuez un calcul puis appuyez sur « Enregistrer ce calcul ». ","savedAt":"Enregistré","delete":"Supprimer","confirm":"Supprimer ce calcul enregistré ?","clear":"Tout effacer","clearConfirm":"Supprimer tous les calculs enregistrés sur cet appareil ?","savedOk":"Calcul enregistré sur cet appareil.","limit":"Vous pouvez enregistrer jusqu’à 100 calculs. Supprimez-en un ancien pour continuer.","currency":"Conversion de devises","salary":"Calcul du salaire","budget":"Budget mensuel","savings":"Projection d’épargne","storage":"Enregistré uniquement dans ce navigateur sur cet appareil. L’effacement des données du navigateur peut supprimer ces enregistrements.","restore":"Restaurer les valeurs","storageUnavailable":"Le stockage du navigateur est indisponible ou plein."},"pt":{"save":"Salvar este cálculo","saved":"Cálculos salvos","empty":"Ainda não há cálculos salvos. Faça um cálculo e toque em “Salvar este cálculo”.","savedAt":"Salvo","delete":"Excluir","confirm":"Excluir este cálculo salvo?","clear":"Limpar tudo","clearConfirm":"Excluir todos os cálculos salvos neste dispositivo?","savedOk":"Cálculo salvo neste dispositivo.","limit":"Você pode salvar até 100 cálculos. Exclua um antigo para salvar mais.","currency":"Conversão de moedas","salary":"Cálculo de salário","budget":"Orçamento mensal","savings":"Projeção de poupança","storage":"Salvo apenas neste navegador e dispositivo. Limpar os dados do navegador pode apagar estes registros.","restore":"Restaurar dados","storageUnavailable":"O armazenamento do navegador está indisponível ou cheio."},"ru":{"save":"Сохранить расчёт","saved":"Сохранённые расчёты","empty":"Пока нет сохранённых расчётов. Выполните расчёт и нажмите «Сохранить расчёт».","savedAt":"Сохранено","delete":"Удалить","confirm":"Удалить этот сохранённый расчёт?","clear":"Очистить всё","clearConfirm":"Удалить все сохранённые расчёты на этом устройстве?","savedOk":"Расчёт сохранён на этом устройстве.","limit":"Можно сохранить до 100 расчётов. Удалите старый, чтобы сохранить новый.","currency":"Конвертация валют","salary":"Расчёт зарплаты","budget":"Месячный бюджет","savings":"Прогноз накоплений","storage":"Сохраняется только в этом браузере на этом устройстве. Очистка данных браузера может удалить эти записи.","restore":"Восстановить ввод","storageUnavailable":"Хранилище браузера недоступно или заполнено."},"id":{"save":"Simpan perhitungan ini","saved":"Perhitungan tersimpan","empty":"Belum ada perhitungan tersimpan. Hitung jumlah lalu tekan “Simpan perhitungan ini”.","savedAt":"Disimpan","delete":"Hapus","confirm":"Hapus perhitungan tersimpan ini?","clear":"Hapus semua","clearConfirm":"Hapus semua perhitungan tersimpan di perangkat ini?","savedOk":"Perhitungan disimpan di perangkat ini.","limit":"Anda dapat menyimpan hingga 100 perhitungan. Hapus yang lama untuk menyimpan lebih banyak.","currency":"Konversi mata uang","salary":"Perhitungan gaji","budget":"Anggaran bulanan","savings":"Proyeksi tabungan","storage":"Hanya disimpan di browser pada perangkat ini. Menghapus data browser dapat menghapus catatan ini.","restore":"Pulihkan input","storageUnavailable":"Penyimpanan browser tidak tersedia atau penuh."}});
  const language = () => { const code=(document.documentElement.lang||"en").toLowerCase().split("-")[0]; return words[code]?code:"en"; };
  const locale = () => ((window.GMC_LOCALES||{})[language()]||"en-US");
  const fields = {
    currency:["amount","fromCurrency","toCurrency","rate","dailyMode","manualMode"],
    salary:["salaryAmount","salaryCurrency","days","hours","deduction"],
    budget:["income","budgetCurrency","housing","food","transport","other"],
    savings:["monthlySave","savingsCurrency","months","interest"]
  };
  const labels = {currency:"currency",salary:"salary",budget:"budget",savings:"savings"};
  let status;
  function t(key){return words[language()][key]||words.en[key]||key;}
  function read(){
    try {
      const data=JSON.parse(localStorage.getItem(KEY)||"[]");
      return Array.isArray(data)?data.filter(x=>x&&typeof x.id==="string"&&typeof x.result==="string").slice(0,100):[];
    } catch(_){return [];}
  }
  function write(items){
    try {localStorage.setItem(KEY,JSON.stringify(items));return true;}
    catch(_){return false;}
  }
  function valueOf(id){
    const node=$(id);
    if(!node)return null;
    if(node.type==="checkbox")return node.checked;
    if(node.tagName==="BUTTON")return node.classList.contains("active");
    return node.value;
  }
  function restoreValues(values){
    Object.entries(values||{}).forEach(([id,value])=>{
      const node=$(id);if(!node)return;
      if(id==="dailyMode"||id==="manualMode"){
        if(value){node.click();}
      } else if(node.tagName==="SELECT"||node.tagName==="INPUT") node.value=value;
    });
  }
  function render(){
    const list=$("gmc-saved-list");if(!list)return;
    const items=read();list.replaceChildren();
    if(!items.length){
      const empty=document.createElement("p");empty.className="gmc-save-empty";empty.textContent=t("empty");list.appendChild(empty);return;
    }
    items.forEach(item=>{
      const card=document.createElement("article");card.className="gmc-saved-card";
      const title=document.createElement("strong");title.textContent=t(labels[item.type]||"saved");
      const result=document.createElement("p");result.className="gmc-saved-result";result.textContent=item.result;
      const date=document.createElement("small");
      const d=new Date(item.savedAt);
      date.textContent=t("savedAt")+": "+(Number.isNaN(d.getTime())?"":new Intl.DateTimeFormat(locale(),{dateStyle:"medium",timeStyle:"short"}).format(d));
      const actions=document.createElement("div");actions.className="gmc-saved-actions";
      const load=document.createElement("button");load.type="button";load.textContent=t("restore");
      load.addEventListener("click",()=>{restoreValues(item.values);const target=$(item.type);if(target)target.scrollIntoView({behavior:"smooth",block:"center"});});
      const remove=document.createElement("button");remove.type="button";remove.textContent=t("delete");
      remove.addEventListener("click",()=>{if(!window.confirm(t("confirm")))return;write(read().filter(x=>x.id!==item.id));render();});
      actions.append(load,remove);card.append(title,result,date,actions);list.appendChild(card);
    });
  }
  function setup(){
    const tools=[
      {type:"currency",result:"currencyResult",button:"convert"},
      {type:"salary",result:"salaryResult",button:"calcSalary"},
      {type:"budget",result:"budgetResult",button:"calcBudget"},
      {type:"savings",result:"savingsResult",button:"calcSavings"}
    ];
    tools.forEach(tool=>{
      const result=$(tool.result),calculator=$(tool.type);
      if(!result||!calculator||$(tool.button+"_save"))return;
      const button=document.createElement("button");
      button.type="button";button.id=tool.button+"_save";button.className="btn secondary gmc-save-button";
      button.textContent=t("save");button.disabled=true;
      result.insertAdjacentElement("afterend",button);
      const update=()=>{button.disabled=result.classList.contains("empty")||!result.textContent.trim();};
      $(tool.button).addEventListener("click",()=>setTimeout(update,0));
      button.addEventListener("click",()=>{
        update();if(button.disabled)return;
        const items=read();
        if(items.length>=100){status.textContent=t("limit");return;}
        const values={};fields[tool.type].forEach(id=>{values[id]=valueOf(id);});
        const record={id:(window.crypto&&crypto.randomUUID)?crypto.randomUUID():String(Date.now())+"-"+Math.random().toString(36).slice(2),type:tool.type,values,result:result.innerText.trim(),savedAt:new Date().toISOString()};
        items.unshift(record);
        if(!write(items)){status.textContent=t("storageUnavailable");return;}
        status.textContent=t("savedOk");render();
      });
      update();
    });
    const section=document.createElement("section");
    section.id="gmc-saved-calculations";section.className="gmc-saved-section";
    section.innerHTML='<div class="gmc-saved-heading"><div><h2></h2><p class="gmc-storage-note"></p></div><button type="button" id="gmc-clear-saved"></button></div><p id="gmc-save-status" role="status" aria-live="polite"></p><div id="gmc-saved-list"></div>';
    section.querySelector("h2").textContent=t("saved");
    section.querySelector(".gmc-storage-note").textContent=t("storage");
    section.querySelector("#gmc-clear-saved").textContent=t("clear");
    status=section.querySelector("#gmc-save-status");
    section.querySelector("#gmc-clear-saved").addEventListener("click",()=>{
      if(!read().length)return;
      if(window.confirm(t("clearConfirm"))){write([]);status.textContent="";render();}
    });
    const toolsSection=$("tools");
    if(toolsSection)toolsSection.insertAdjacentElement("afterend",section);
    render();
    window.addEventListener("storage",event=>{if(event.key===KEY)render();});
    new MutationObserver(()=>{
      section.querySelector("h2").textContent=t("saved");
      section.querySelector(".gmc-storage-note").textContent=t("storage");
      section.querySelector("#gmc-clear-saved").textContent=t("clear");
      section.querySelectorAll(".gmc-save-button").forEach(b=>b.textContent=t("save"));
      render();
    }).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  }
  const style=document.createElement("style");
  style.textContent=`
    .gmc-save-button{width:100%;margin-top:9px;border:1px solid #dce2ee;background:#f4f6fb;color:#34405d;box-shadow:none}
    .gmc-save-button:disabled{opacity:.45;cursor:not-allowed}
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
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup,{once:true});else setup();
})();

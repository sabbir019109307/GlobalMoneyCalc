/* GlobalMoneyCalc PDF export v1
   Uses the browser's native print-to-PDF flow so Bengali and other system fonts
   remain selectable and render correctly without a third-party PDF library. */
(() => {
  "use strict";
  const items = [
    {type:"currency", result:"currencyResult", save:"gmc-save-currency", fields:["amount","fromCurrency","toCurrency","rate"]},
    {type:"salary", result:"salaryResult", save:"gmc-save-salary", fields:["salaryAmount","salaryCurrency","days","hours","deduction"]},
    {type:"budget", result:"budgetResult", save:"gmc-save-budget", fields:["income","budgetCurrency","housing","food","transport","other"]},
    {type:"savings", result:"savingsResult", save:"gmc-save-savings", fields:["monthlySave","savingsCurrency","months","interest"]}
  ];
  const words = {
    en:{button:"Download PDF",date:"Created",inputs:"Calculation details",result:"Result",brand:"GlobalMoneyCalc",hint:"If the print window does not open automatically, tap Print / Save PDF.",print:"Print / Save PDF",rate:"Exchange rate used",mode:"Rate source",daily:"Indicative market rate",manual:"Your own rate",disclaimer:"For general educational and planning purposes only. Check important figures with the relevant provider."},
    bn:{button:"PDF ডাউনলোড",date:"তৈরির সময়",inputs:"হিসাবের বিবরণ",result:"ফলাফল",brand:"GlobalMoneyCalc",hint:"প্রিন্ট উইন্ডো নিজে থেকে না খুললে Print / Save PDF চাপুন।",print:"Print / Save PDF",rate:"ব্যবহৃত বিনিময় হার",mode:"হারের উৎস",daily:"ইঙ্গিতমূলক বাজারদর",manual:"আপনার দেওয়া হার",disclaimer:"শুধু সাধারণ তথ্য ও পরিকল্পনার জন্য। গুরুত্বপূর্ণ অঙ্ক সংশ্লিষ্ট প্রতিষ্ঠানের সঙ্গে যাচাই করুন।"},
    zh:{button:"下载 PDF",date:"创建时间",inputs:"计算详情",result:"结果",brand:"GlobalMoneyCalc",hint:"如果打印窗口未自动打开，请点击“打印 / 保存 PDF”。",print:"打印 / 保存 PDF",rate:"使用的汇率",mode:"汇率来源",daily:"参考市场汇率",manual:"自定义汇率",disclaimer:"仅供一般教育和规划使用。重要金额请向相关服务提供商核实。"},
    hi:{button:"PDF डाउनलोड करें",date:"बनाया गया",inputs:"गणना विवरण",result:"परिणाम",brand:"GlobalMoneyCalc",hint:"यदि प्रिंट विंडो अपने आप नहीं खुलती है, तो Print / Save PDF दबाएँ।",print:"Print / Save PDF",rate:"प्रयुक्त विनिमय दर",mode:"दर का स्रोत",daily:"संकेतात्मक बाजार दर",manual:"आपकी दर",disclaimer:"केवल सामान्य जानकारी और योजना के लिए। महत्वपूर्ण आंकड़ों की संबंधित प्रदाता से पुष्टि करें।"},
    es:{button:"Descargar PDF",date:"Creado",inputs:"Detalles del cálculo",result:"Resultado",brand:"GlobalMoneyCalc",hint:"Si la ventana de impresión no se abre, pulsa Imprimir / Guardar PDF.",print:"Imprimir / Guardar PDF",rate:"Tipo de cambio utilizado",mode:"Origen del tipo",daily:"Tipo de mercado indicativo",manual:"Tipo personalizado",disclaimer:"Solo para información y planificación general. Confirma las cifras importantes con el proveedor correspondiente."},
    ar:{button:"تنزيل PDF",date:"تاريخ الإنشاء",inputs:"تفاصيل الحساب",result:"النتيجة",brand:"GlobalMoneyCalc",hint:"إذا لم تفتح نافذة الطباعة تلقائياً، اضغط طباعة / حفظ PDF.",print:"طباعة / حفظ PDF",rate:"سعر الصرف المستخدم",mode:"مصدر السعر",daily:"سعر سوق استرشادي",manual:"سعرك الخاص",disclaimer:"للمعلومات والتخطيط العام فقط. تحقق من الأرقام المهمة لدى الجهة المعنية."},
    fr:{button:"Télécharger PDF",date:"Créé le",inputs:"Détails du calcul",result:"Résultat",brand:"GlobalMoneyCalc",hint:"Si la fenêtre d’impression ne s’ouvre pas, appuyez sur Imprimer / Enregistrer PDF.",print:"Imprimer / Enregistrer PDF",rate:"Taux de change utilisé",mode:"Source du taux",daily:"Taux indicatif du marché",manual:"Votre taux",disclaimer:"À titre informatif et pour la planification uniquement. Vérifiez les montants importants auprès du prestataire concerné."},
    pt:{button:"Baixar PDF",date:"Criado em",inputs:"Detalhes do cálculo",result:"Resultado",brand:"GlobalMoneyCalc",hint:"Se a janela de impressão não abrir, toque em Imprimir / Salvar PDF.",print:"Imprimir / Salvar PDF",rate:"Taxa de câmbio utilizada",mode:"Origem da taxa",daily:"Taxa indicativa de mercado",manual:"Sua taxa",disclaimer:"Apenas para informação e planejamento geral. Confirme valores importantes com o fornecedor relevante."},
    ru:{button:"Скачать PDF",date:"Создано",inputs:"Детали расчёта",result:"Результат",brand:"GlobalMoneyCalc",hint:"Если окно печати не открылось, нажмите «Печать / Сохранить PDF».",print:"Печать / Сохранить PDF",rate:"Использованный курс",mode:"Источник курса",daily:"Ориентировочный рыночный курс",manual:"Ваш курс",disclaimer:"Только для общей информации и планирования. Проверяйте важные суммы у соответствующего поставщика."},
    id:{button:"Unduh PDF",date:"Dibuat",inputs:"Detail perhitungan",result:"Hasil",brand:"GlobalMoneyCalc",hint:"Jika jendela cetak tidak terbuka otomatis, ketuk Cetak / Simpan PDF.",print:"Cetak / Simpan PDF",rate:"Kurs yang digunakan",mode:"Sumber kurs",daily:"Kurs pasar indikatif",manual:"Kurs Anda",disclaimer:"Hanya untuk informasi dan perencanaan umum. Periksa angka penting kepada penyedia terkait."}
  };
  const $ = id => document.getElementById(id);
  const lang = () => (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const tr = () => words[lang()] || words.en;
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  function labelFor(id) {
    const label = document.querySelector('label[for="' + id + '"]');
    return label ? label.textContent.trim() : id;
  }
  function fieldValue(id) {
    const field = $(id);
    if (!field) return "";
    if (field.tagName === "SELECT") return field.value;
    return field.value.trim();
  }
  function makeReport(item) {
    const result = $(item.result);
    if (!result || result.classList.contains("empty") || !(result.innerText || result.textContent || "").trim()) {
      alert(lang()==="bn" ? "আগে হিসাব করুন, তারপর PDF ডাউনলোড করুন।" : "Calculate first, then download the PDF.");
      return;
    }
    const t = tr();
    const heading = document.querySelector("#" + item.result).closest(".tool").querySelector("h3");
    const title = heading ? heading.textContent.trim() : item.type;
    const rows = item.fields.map(id => {
      const value = fieldValue(id);
      if (!value) return "";
      return "<tr><th>" + esc(labelFor(id)) + "</th><td>" + esc(value) + "</td></tr>";
    }).filter(Boolean);
    if (item.type === "currency") {
      const daily = $("dailyMode") && $("dailyMode").classList.contains("active");
      const rate = daily && typeof window.getDailyPairRate === "function" ? window.getDailyPairRate() : fieldValue("rate");
      rows.push("<tr><th>" + esc(t.mode) + "</th><td>" + esc(daily ? t.daily : t.manual) + "</td></tr>");
      if (rate !== null && rate !== "" && Number.isFinite(Number(rate))) rows.push("<tr><th>" + esc(t.rate) + "</th><td>" + esc(rate) + "</td></tr>");
    }
    const output = (result.innerText || result.textContent || "").trim();
    const date = new Intl.DateTimeFormat((window.GMC_LOCALES || {})[lang()] || "en-US", {dateStyle:"medium",timeStyle:"short"}).format(new Date());
    const direction = document.documentElement.dir === "rtl" ? "rtl" : "auto";
    const html = '<!doctype html><html lang="' + esc(lang()) + '" dir="' + direction + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(title) + ' - GlobalMoneyCalc</title><style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#172039;line-height:1.6;margin:0;padding:28px;background:#fff}main{max-width:760px;margin:auto}.brand{font-size:13px;font-weight:800;color:#6652d9;letter-spacing:.04em}.rule{height:4px;background:#7157f2;border-radius:5px;margin:14px 0 22px}h1{font-size:25px;margin:0 0 5px}h2{font-size:16px;margin:24px 0 8px}.date,.note{color:#65708a;font-size:12px}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{text-align:start;padding:10px;border-bottom:1px solid #e5e9f2;vertical-align:top}th{width:48%;color:#53607a;font-weight:650}.result{white-space:pre-wrap;border:1px solid #e5e9f2;background:#f6f7fc;padding:14px;border-radius:12px;font-size:15px}.actions{display:flex;gap:10px;margin:18px 0}.actions button{border:0;border-radius:9px;padding:10px 15px;background:#7157f2;color:#fff;font-weight:700;font-size:14px}.note{margin-top:22px;border-top:1px solid #e5e9f2;padding-top:12px}@media print{body{padding:0}.actions{display:none}main{max-width:none}.result,table{break-inside:avoid}}@page{margin:16mm}</style></head><body><main><div class="brand">' + esc(t.brand) + '</div><div class="rule"></div><h1>' + esc(title) + '</h1><div class="date">' + esc(t.date) + ': ' + esc(date) + '</div><h2>' + esc(t.inputs) + '</h2><table>' + rows.join("") + '</table><h2>' + esc(t.result) + '</h2><div class="result">' + esc(output) + '</div><div class="note">' + esc(t.disclaimer) + '<br>' + esc(location.href) + '</div><div class="actions"><button onclick="window.print()">' + esc(t.print) + '</button></div><p class="note">' + esc(t.hint) + '</p></main><script>window.addEventListener("load",function(){setTimeout(function(){try{window.focus();window.print()}catch(e){}},350)})<\/script></body></html>';
    const popup = window.open("", "_blank");
    if (!popup) {
      alert(lang()==="bn" ? "পপ-আপ বন্ধ আছে। ব্রাউজারে এই সাইটের Pop-ups অনুমতি দিয়ে আবার চেষ্টা করুন।" : "The report window was blocked. Allow pop-ups for this site and try again.");
      return;
    }
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
  }
  function init() {
    items.forEach(item => {
      const save = $(item.save);
      const result = $(item.result);
      if (!save || !result || $("gmc-pdf-" + item.type)) return;
      const button = document.createElement("button");
      button.type = "button";
      button.id = "gmc-pdf-" + item.type;
      button.className = "btn primary";
      button.style.cssText = "display:block;width:100%;margin-top:8px;cursor:pointer";
      button.textContent = tr().button;
      button.addEventListener("click", () => makeReport(item));
      save.insertAdjacentElement("afterend", button);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
  const selector = $("languageSelect");
  if (selector) selector.addEventListener("change", () => {
    items.forEach(item => { const button = $("gmc-pdf-" + item.type); if (button) button.textContent = tr().button; });
  });
})();
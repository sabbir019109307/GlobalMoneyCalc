/* Independent homepage translation fallback.
   Reads the same dictionaries as the calculator app, but does not depend on
   the calculator's internal lang variable or event-handler initialization. */
(() => {
  "use strict";

  const supported = new Set(["en", "bn", "zh", "hi", "es", "ar", "fr", "pt", "ru", "id"]);
  const languageLabels = {
    en: "Choose language", bn: "ভাষা নির্বাচন করুন", zh: "选择语言",
    hi: "भाषा चुनें", es: "Elegir idioma", ar: "اختر اللغة",
    fr: "Choisir la langue", pt: "Escolher idioma", ru: "Выбрать язык",
    id: "Pilih bahasa"
  };
  let lastApplied = "";

  function applyLanguage(code, save = true) {
    if (!supported.has(code)) return false;
    const dictionaries = window.GMC_TRANSLATIONS;
    if (!dictionaries || !dictionaries.en) return false;

    const words = dictionaries[code] || dictionaries.en;
    document.documentElement.lang = code;
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(node => {
      const key = node.getAttribute("data-i18n");
      const value = words[key] !== undefined ? words[key] : dictionaries.en[key];
      if (value !== undefined) node.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(node => {
      const key = node.getAttribute("data-i18n-placeholder");
      const value = words[key] !== undefined ? words[key] : dictionaries.en[key];
      if (value !== undefined) node.setAttribute("placeholder", value);
    });

    const selector = document.getElementById("languageSelect");
    if (selector) {
      selector.value = code;
      selector.setAttribute("aria-label", languageLabels[code] || languageLabels.en);
    }

    const title = words.heroTitle || dictionaries.en.heroTitle;
    if (title) {
      document.title = title.replace(/<br\s*\/?\s*>/gi, " ") + " | GlobalMoneyCalc";
    }

    if (save) {
      try { localStorage.setItem("gmc_language", code); } catch (_) {}
    }
    lastApplied = code;
    return true;
  }

  // Handle direct selector changes even if another page script misses the event.
  document.addEventListener("change", event => {
    if (event.target && event.target.id === "languageSelect") {
      applyLanguage(event.target.value);
    }
  }, true);

  // Handle changes made by the shared site-wide language controller/account page.
  window.addEventListener("gmc:languagechange", event => {
    const code = event.detail && event.detail.language;
    if (supported.has(code)) applyLanguage(code);
  });

  // Also catch any controller that updates only the root html lang attribute.
  const observer = new MutationObserver(() => {
    const code = (document.documentElement.lang || "").toLowerCase();
    if (supported.has(code) && code !== lastApplied) applyLanguage(code);
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });

  let initial = "en";
  try {
    const saved = localStorage.getItem("gmc_language");
    if (supported.has(saved)) initial = saved;
    else if (supported.has(document.documentElement.lang)) initial = document.documentElement.lang;
    else {
      const selector = document.getElementById("languageSelect");
      if (selector && supported.has(selector.value)) initial = selector.value;
    }
  } catch (_) {}
  applyLanguage(initial, false);

  // Public entry point for any homepage language control.
  window.GMCApplyHomepageLanguage = applyLanguage;
})();

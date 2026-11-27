/* Homepage language bridge: always use the page's own translator first. */
(() => {
  "use strict";
  const supported = new Set(["en","bn","zh","hi","es","ar","fr","pt","ru","id"]);
  let applied = "";

  function apply(code) {
    if (!supported.has(code)) return false;

    // The homepage already owns the complete dictionary and calculator state.
    // Delegate to it so headings, labels, buttons and calculator messages all
    // change together instead of translating only the clock/document metadata.
    if (typeof window.gmcSetLanguage === "function") {
      const ok = window.gmcSetLanguage(code);
      if (ok) {
        applied = code;
        return true;
      }
    }

    // Defensive fallback for an unusually early event before the page script
    // has initialized its public translator.
    const dictionaries = window.GMC_TRANSLATIONS;
    if (!dictionaries || !dictionaries.en) return false;
    const words = dictionaries[code] || dictionaries.en;
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
    document.documentElement.lang = code;
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("gmc_language", code); } catch (_) {}
    applied = code;
    return true;
  }

  document.addEventListener("change", event => {
    if (event.target && event.target.id === "languageSelect") {
      apply(event.target.value);
    }
  }, true);

  window.addEventListener("gmc:languagechange", event => {
    const code = event.detail && event.detail.language;
    if (supported.has(code)) apply(code);
  });

  // Synchronize a stored preference after all inline homepage scripts load.
  const start = () => {
    let code = "en";
    try {
      const saved = localStorage.getItem("gmc_language");
      if (supported.has(saved)) code = saved;
    } catch (_) {}
    if (!supported.has(code)) code = "en";
    if (code !== applied) apply(code);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  window.GMCApplyHomepageLanguage = apply;
})();
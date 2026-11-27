/* Reliable homepage translator: apply the shared dictionary directly, then refresh page-specific computed text. */
(() => {
  "use strict";
  const LANGUAGES = new Set(["en","bn","zh","hi","es","ar","fr","pt","ru","id"]);
  let activeLanguage = "en";

  function dictionaryFor(code) {
    const all = window.GMC_TRANSLATIONS;
    if (!all || !all.en) return null;
    return { current: all[code] || all.en, fallback: all.en };
  }

  function translateNode(node, words) {
    if (!node || node.nodeType !== 1) return;
    if (node.matches && node.matches("[data-i18n]")) {
      const key = node.getAttribute("data-i18n");
      const value = words.current[key] !== undefined ? words.current[key] : words.fallback[key];
      if (value !== undefined) node.innerHTML = value;
    }
    if (node.matches && node.matches("[data-i18n-placeholder]")) {
      const key = node.getAttribute("data-i18n-placeholder");
      const value = words.current[key] !== undefined ? words.current[key] : words.fallback[key];
      if (value !== undefined) node.setAttribute("placeholder", value);
    }
    if (node.querySelectorAll) {
      node.querySelectorAll("[data-i18n]").forEach(child => translateNode(child, words));
      node.querySelectorAll("[data-i18n-placeholder]").forEach(child => translateNode(child, words));
    }
  }

  function apply(code) {
    if (!LANGUAGES.has(code)) return false;
    activeLanguage = code;

    // First ask the homepage's own translator to refresh calculator-specific text.
    // Errors here must not prevent the static page dictionary from being applied.
    try {
      if (typeof window.gmcSetLanguage === "function") window.gmcSetLanguage(code);
    } catch (error) {
      console.error("GlobalMoneyCalc page translator failed:", error);
    }

    const words = dictionaryFor(code);
    if (words) {
      document.documentElement.lang = code;
      document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
      translateNode(document.body, words);
    }

    const selector = document.getElementById("languageSelect");
    if (selector && selector.value !== code) selector.value = code;
    try { localStorage.setItem("gmc_language", code); } catch (_) {}

    // Refresh dynamic exchange-rate status and other computed labels.
    try {
      if (typeof window.gmcSetLanguage === "function") window.gmcSetLanguage(code);
    } catch (error) {
      console.error("GlobalMoneyCalc computed labels could not refresh:", error);
    }
    return !!words || typeof window.gmcSetLanguage === "function";
  }

  document.addEventListener("change", event => {
    if (event.target && event.target.id === "languageSelect") apply(event.target.value);
  }, true);

  window.addEventListener("gmc:languagechange", event => {
    const code = event.detail && event.detail.language;
    if (LANGUAGES.has(code)) apply(code);
  });

  window.addEventListener("storage", event => {
    if (event.key === "gmc_language" && LANGUAGES.has(event.newValue)) apply(event.newValue);
  });

  function start() {
    let code = "en";
    try {
      const saved = localStorage.getItem("gmc_language");
      if (LANGUAGES.has(saved)) code = saved;
      else if (LANGUAGES.has(document.documentElement.lang)) code = document.documentElement.lang;
    } catch (_) {}
    const selector = document.getElementById("languageSelect");
    if (selector && LANGUAGES.has(selector.value) && code === "en") code = selector.value;
    apply(code);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  // Newly inserted homepage elements carrying translation keys stay localized too.
  if (window.MutationObserver && document.body) {
    const observer = new MutationObserver(records => {
      const words = dictionaryFor(activeLanguage);
      if (!words) return;
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === 1) translateNode(node, words);
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.GMCApplyHomepageLanguage = apply;
})();

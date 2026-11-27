/* One site-wide language preference shared by every GlobalMoneyCalc page. */
(() => {
  "use strict";

  const STORAGE_KEY = "gmc_language";
  const LANGUAGES = new Set(["en", "bn", "zh", "hi", "es", "ar", "fr", "pt", "ru", "id"]);
  const LANGUAGE_LABELS = {
    en: "Choose language", bn: "ভাষা নির্বাচন করুন", zh: "选择语言",
    hi: "भाषा चुनें", es: "Elegir idioma", ar: "اختر اللغة",
    fr: "Choisir la langue", pt: "Escolher idioma", ru: "Выбрать язык",
    id: "Pilih bahasa"
  };

  const isLanguage = value => typeof value === "string" && LANGUAGES.has(value);
  const readLanguage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isLanguage(saved)) return saved;
    } catch (_) {}
    const htmlLanguage = (document.documentElement.lang || "").toLowerCase();
    if (isLanguage(htmlLanguage)) return htmlLanguage;
    const selector = document.getElementById("languageSelect");
    return selector && isLanguage(selector.value) ? selector.value : "en";
  };

  function persistLanguage(language) {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== language) {
        localStorage.setItem(STORAGE_KEY, language);
      }
    } catch (_) {}
  }

  // Call the active page's full translator directly. Updating <html lang> alone
  // only changes locale-aware widgets such as the clock, not page copy.
  function applyPageLanguage(language) {
    if (!isLanguage(language)) return false;
    let applied = false;

    // Run both translators when present: the calculator's dynamic labels and
    // the shared page dictionary cover different parts of the same page.
    try {
      if (typeof window.gmcSetLanguage === "function") {
        applied = window.gmcSetLanguage(language) !== false || applied;
      }
    } catch (error) {
      console.error("GlobalMoneyCalc calculator translation failed:", error);
    }

    try {
      if (typeof window.GMCApplyHomepageLanguage === "function") {
        applied = window.GMCApplyHomepageLanguage(language) !== false || applied;
      }
    } catch (error) {
      console.error("GlobalMoneyCalc shared page translation failed:", error);
    }

    return applied;
  }

  function applyDocumentLanguage(language, dispatchChange) {
    if (!isLanguage(language)) return false;

    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("#languageSelect").forEach(selector => {
      const changed = selector.value !== language;
      if (changed) selector.value = language;
      selector.setAttribute("aria-label", LANGUAGE_LABELS[language]);
      if (dispatchChange && changed) {
        selector.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    return true;
  }

  // The page-specific translator handles its own text. This shared listener
  // makes its selected language persistent and available to every other page.
  document.addEventListener("change", event => {
    const selector = event.target;
    if (!selector || selector.id !== "languageSelect") return;
    const language = selector.value;
    if (!isLanguage(language)) return;
    persistLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    applyPageLanguage(language);
    // Explicitly notify each page's own translator; the clock alone is not the translator.
    window.dispatchEvent(new CustomEvent("gmc:languagechange", {
      detail: { language, source: "language-selector" }
    }));
  }, true);

  // Keep other tabs in sync when a visitor changes the language elsewhere.
  window.addEventListener("storage", event => {
    if (event.key !== STORAGE_KEY || !isLanguage(event.newValue)) return;
    applyDocumentLanguage(event.newValue, true);
    applyPageLanguage(event.newValue);
  });

  // Account profile language changes use this event after saving the preference.
  window.addEventListener("gmc:languagechange", event => {
    const language = event.detail && event.detail.language;
    if (!isLanguage(language)) return;
    persistLanguage(language);
    applyDocumentLanguage(language, true);
    applyPageLanguage(language);
  });

  // A common API for any current or future page-specific language control.
  window.GMCSetLanguage = language => {
    if (!isLanguage(language)) return false;
    persistLanguage(language);
    applyDocumentLanguage(language, true);
    applyPageLanguage(language);
    window.dispatchEvent(new CustomEvent("gmc:languagechange", {
      detail: { language, source: "global-language-control" }
    }));
    return true;
  };

  // Translators marked defer may not be available when this file first runs.
  // Re-apply the saved language after all page scripts have finished loading.
  window.addEventListener("load", () => {
    const language = readLanguage();
    applyDocumentLanguage(language, false);
    applyPageLanguage(language);
  });

  // Translators are loaded before this file. If a stored selection differs
  // from the page's default selector, trigger its normal change handler once.
  const initialLanguage = readLanguage();
  persistLanguage(initialLanguage);
  applyDocumentLanguage(initialLanguage, true);
})();

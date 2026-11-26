/* Shared language switcher for the English/Bengali standalone guide pages. */
(() => {
  "use strict";
  const allowed = ["en", "bn"];
  const select = document.getElementById("languageSelect");
  const readSaved = () => {
    try {
      const saved = localStorage.getItem("gmc_language");
      return allowed.includes(saved) ? saved : "en";
    } catch {
      return "en";
    }
  };
  let language = readSaved();

  function applyLanguage(next, persist = true) {
    language = allowed.includes(next) ? next : "en";
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";

    document.querySelectorAll("[data-lang-section]").forEach((node) => {
      node.hidden = node.dataset.langSection !== language;
    });
    document.querySelectorAll("[data-lang-en][data-lang-bn]").forEach((node) => {
      node.textContent = node.getAttribute("data-lang-" + language) || "";
    });

    if (select) {
      select.value = language;
      select.setAttribute("aria-label", language === "bn" ? "ভাষা নির্বাচন" : "Select language");
    }

    const pageTitle = document.documentElement.getAttribute("data-page-title-" + language);
    if (pageTitle) document.title = pageTitle + " | GlobalMoneyCalc";

    if (persist) {
      try { localStorage.setItem("gmc_language", language); } catch {}
    }
  }

  if (select) {
    select.addEventListener("change", () => applyLanguage(select.value));
  }
  applyLanguage(language);
})();

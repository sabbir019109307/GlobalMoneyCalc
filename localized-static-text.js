/* Small shared helper for site-credit labels that appear outside page dictionaries. */
(() => {
  "use strict";
  const selector = document.getElementById("languageSelect");
  function apply(language) {
    const code = language === "bn" ? "bn" : "en";
    document.querySelectorAll("[data-gmc-lang-en][data-gmc-lang-bn]").forEach((node) => {
      node.textContent = node.getAttribute("data-gmc-lang-" + code) || "";
    });
  }
  function applyCurrent() {
    apply(selector ? selector.value : document.documentElement.lang);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyCurrent, { once: true });
  } else {
    applyCurrent();
  }
  if (selector) selector.addEventListener("change", () => apply(selector.value));
})();

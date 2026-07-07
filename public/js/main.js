(function () {
  const cfg = window.ALPHA_AURA_CONFIG || {};
  const CONVERSION_EVENT = cfg.metaConversionEvent || "Lead";

  function canTrack() {
    return typeof fbq === "function";
  }

  function trackConversion(el) {
    if (!canTrack()) return;

    const label = (el.getAttribute("data-fb-label") || el.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
    const section = el.closest("section, header, footer");
    const sectionId = section?.id || section?.className?.split(" ")[0] || "page";

    fbq("track", CONVERSION_EVENT, {
      content_name: label || "CTA click",
      content_category: sectionId,
      destination: "whatsapp",
    });
  }

  function bindConversionTracking() {
    document.querySelectorAll("a.btn, a.whatsapp-float, .nav a.wa-link").forEach((el) => {
      el.addEventListener("click", () => trackConversion(el), { passive: true });
    });
  }

  bindConversionTracking();

  const header = document.getElementById("header");
  const onScrollHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            revealIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealIo.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav");
  navToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open);
    document.body.classList.toggle("nav-open", open);
  });
  nav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });
})();

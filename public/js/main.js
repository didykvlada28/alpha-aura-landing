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
    const section = el.closest("section, header, footer, .sticky-book");
    const sectionId = section?.id || section?.className?.split(" ")[0] || "page";
    const isBookday = el.classList.contains("bookday-link");

    fbq("track", CONVERSION_EVENT, {
      content_name: label || "CTA click",
      content_category: sectionId,
      destination: isBookday ? "bookday" : "whatsapp",
    });
  }

  function bindConversionTracking() {
    document
      .querySelectorAll("a.btn, a.whatsapp-float, .nav a.wa-link, a.bookday-link")
      .forEach((el) => {
        el.addEventListener("click", () => trackConversion(el), { passive: true });
      });
  }

  bindConversionTracking();

  document.querySelectorAll("img").forEach((img) => {
    if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
  });

  /* Header scrolled state via IO — no scroll listener (avoids main-thread work every frame) */
  const header = document.getElementById("header");
  const heroEl = document.getElementById("hero");
  if (header && heroEl && "IntersectionObserver" in window) {
    const headerIo = new IntersectionObserver(
      ([entry]) => {
        header.classList.toggle("is-scrolled", !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-48px 0px 0px 0px" }
    );
    headerIo.observe(heroEl);
  } else if (header) {
    header.classList.add("is-scrolled");
  }

  /* —— Mobile nav + reliable scroll lock/unlock —— */
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav");
  let lockedScrollY = 0;
  let navIsOpen = false;

  function lockBodyScroll() {
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.classList.add("nav-open");
  }

  function unlockBodyScroll() {
    document.body.classList.remove("nav-open");
    document.body.style.top = "";
    window.scrollTo(0, lockedScrollY);
  }

  function setNavOpen(open) {
    navIsOpen = !!open;
    nav?.classList.toggle("is-open", navIsOpen);
    navToggle?.setAttribute("aria-expanded", String(navIsOpen));
    if (navIsOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  }

  navToggle?.addEventListener("click", () => {
    setNavOpen(!navIsOpen);
  });

  nav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (navIsOpen) setNavOpen(false);
    });
  });

  window.addEventListener(
    "resize",
    () => {
      if (navIsOpen && window.matchMedia("(min-width: 769px)").matches) {
        setNavOpen(false);
      }
    },
    { passive: true }
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navIsOpen) setNavOpen(false);
  });

  /* Sticky book bar: only after leaving the hero */
  const stickyBook = document.getElementById("sticky-book");
  if (stickyBook && heroEl && "IntersectionObserver" in window) {
    const stickyIo = new IntersectionObserver(
      ([entry]) => {
        stickyBook.classList.toggle("is-visible", !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" }
    );
    stickyIo.observe(heroEl);
  } else if (stickyBook) {
    stickyBook.classList.add("is-visible");
  }
})();

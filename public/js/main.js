(function () {
  const cfg = window.ALPHA_AURA_CONFIG || {};
  const LEAD_EVENT = cfg.metaConversionEvent || "Lead";

  function canTrack() {
    return typeof fbq === "function";
  }

  /* Existing messaging conversion — unchanged Lead payload */
  function trackMessagingLead(el) {
    if (!canTrack()) return;

    const label = (el.getAttribute("data-fb-label") || el.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
    const section = el.closest("section, header, footer, .sticky-book");
    const sectionId = section?.id || section?.className?.split(" ")[0] || "page";

    fbq("track", LEAD_EVENT, {
      content_name: label || "CTA click",
      content_category: sectionId,
      destination: "whatsapp",
    });
  }

  /**
   * Official Meta standard event for Booking / Schedule a Meeting.
   * Fired on click only, before navigation. Booking opens in a new tab
   * (target=_blank), so the pixel request is not aborted by unload.
   */
  function trackSchedule(el) {
    if (!canTrack()) return;
    /* Guard against duplicate Schedule from a single click / double-bind */
    if (el.dataset.fbScheduleLock === "1") return;
    el.dataset.fbScheduleLock = "1";
    setTimeout(() => {
      delete el.dataset.fbScheduleLock;
    }, 1500);

    fbq("track", "Schedule");
  }

  function bindConversionTracking() {
    /* Messaging / WhatsApp — keep existing Lead tracking only */
    document.querySelectorAll("a.wa-link, a.whatsapp-float").forEach((el) => {
      el.addEventListener(
        "click",
        () => {
          trackMessagingLead(el);
        },
        { passive: true }
      );
    });

    /* Booking / BookDay — standard Schedule event only (not Lead) */
    document.querySelectorAll("a.bookday-link").forEach((el) => {
      el.addEventListener(
        "click",
        () => {
          trackSchedule(el);
        },
        { passive: true }
      );
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

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

  /* Decode images off the main scroll path */
  document.querySelectorAll("img").forEach((img) => {
    if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
  });

  const header = document.getElementById("header");
  let headerTicking = false;
  let headerScrolled = false;
  const onScrollHeader = () => {
    if (headerTicking) return;
    headerTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      /* Hysteresis — avoid class thrash around the threshold */
      const next = headerScrolled ? y > 24 : y > 48;
      if (next !== headerScrolled) {
        headerScrolled = next;
        header?.classList.toggle("is-scrolled", headerScrolled);
      }
      headerTicking = false;
    });
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
      /* Reveal a bit before enter — less simultaneous mid-viewport work */
      { threshold: 0.05, rootMargin: "48px 0px -8px 0px" }
    );
    revealEls.forEach((el) => revealIo.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
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

  /* Sticky book bar: only after leaving the hero (avoids double Book CTAs) */
  const stickyBook = document.getElementById("sticky-book");
  const heroEl = document.getElementById("hero");
  if (stickyBook && heroEl && "IntersectionObserver" in window) {
    const stickyIo = new IntersectionObserver(
      ([entry]) => {
        stickyBook.classList.toggle("is-visible", !entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    stickyIo.observe(heroEl);
  } else if (stickyBook) {
    stickyBook.classList.add("is-visible");
  }
})();

(function () {
  const cfg = window.ALPHA_AURA_CONFIG || {};
  const PIXEL_ID = cfg.metaPixelId || "731067880081984";

  function canTrack() {
    return typeof fbq === "function";
  }

  function track(eventName, params) {
    if (!canTrack()) return;
    fbq("track", eventName, params || {});
  }

  function trackCustom(eventName, params) {
    if (!canTrack()) return;
    fbq("trackCustom", eventName, params || {});
  }

  function buttonLabel(el) {
    return (el.getAttribute("data-fb-label") || el.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function nearestSection(el) {
    const section = el.closest("section, header, footer");
    return section?.id || section?.className?.split(" ")[0] || "page";
  }

  function isWhatsAppClick(el) {
    const href = (el.getAttribute("href") || "").toLowerCase();
    const label = buttonLabel(el).toLowerCase();
    return (
      href.includes("whatsapp.com") ||
      href.includes("wa.me") ||
      label.includes("whatsapp") ||
      label.includes("message us")
    );
  }

  function isLeadClick(el) {
    const label = buttonLabel(el).toLowerCase();
    return (
      /book|register|11:11|session|private|group/i.test(label) &&
      !label.includes("message us")
    );
  }

  function bindConversionTracking() {
    document.querySelectorAll("a.btn, a.whatsapp-float, .nav a.wa-link").forEach((el) => {
      el.addEventListener(
        "click",
        () => {
          const label = buttonLabel(el);
          const section = nearestSection(el);
          const base = { content_name: label, content_category: section };

          if (isLeadClick(el)) {
            track("Lead", base);
            trackCustom("BookSessionClick", {
              ...base,
              destination: "whatsapp",
            });
          }

          if (isWhatsAppClick(el)) {
            track("Contact", base);
            trackCustom("WhatsAppClick", base);
          }
        },
        { passive: true }
      );
    });
  }

  function bindSectionViewTracking() {
    const sections = [
      { id: "experience", name: "The Alpha Aura Experience" },
      { id: "sessions", name: "Session Options" },
      { id: "eleven-eleven", name: "11:11 Experience" },
      { id: "atmosphere", name: "Atmosphere Gallery" },
      { id: "benefits", name: "Why Join" },
      { id: "final-cta", name: "Final CTA" },
    ];

    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const meta = entry.target.__fbMeta;
          if (!meta) return;

          track("ViewContent", {
            content_name: meta.name,
            content_ids: [meta.id],
            content_type: "section",
          });
          trackCustom("SectionView", { section_id: meta.id, section_name: meta.name });
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" }
    );

    sections.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      el.__fbMeta = item;
      io.observe(el);
    });
  }

  function bindScrollDepthTracking() {
    const marks = [25, 50, 75, 90];
    const fired = new Set();

    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) return;

      const depth = Math.round((window.scrollY / max) * 100);
      marks.forEach((mark) => {
        if (depth >= mark && !fired.has(mark)) {
          fired.add(mark);
          trackCustom("ScrollDepth", { percent: mark });
        }
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  bindConversionTracking();
  bindSectionViewTracking();
  bindScrollDepthTracking();

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

  if (canTrack()) {
    trackCustom("PixelReady", { pixel_id: PIXEL_ID });
  }
})();

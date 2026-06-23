(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Header scroll state
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.setAttribute("data-scrolled", window.scrollY > 6 ? "true" : "false");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".nav-panel");
  const closeNav = () => {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", "false");
    panel.setAttribute("data-open", "false");
  };
  const openNav = () => {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", "true");
    panel.setAttribute("data-open", "true");
  };

  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const isOpen = panel.getAttribute("data-open") === "true";
      if (isOpen) closeNav();
      else openNav();
    });

    panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest(".nav")) return;
      closeNav();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // Slider
  const slides = document.querySelector(".slides");
  if (slides) {
    const total = slides.querySelectorAll(".slide").length;
    const dots = Array.from(document.querySelectorAll("[data-dot]"));
    const setActive = (idx) => {
      const next = (idx + total) % total;
      slides.setAttribute("data-active", String(next));
      dots.forEach((d) => d.setAttribute("aria-selected", d.getAttribute("data-dot") === String(next) ? "true" : "false"));
    };

    const getActive = () => Number(slides.getAttribute("data-active") || "0");
    const next = () => setActive(getActive() + 1);
    const prev = () => setActive(getActive() - 1);

    document.querySelectorAll("[data-slide]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dir = btn.getAttribute("data-slide");
        if (dir === "next") next();
        if (dir === "prev") prev();
      });
    });

    dots.forEach((d) => {
      d.addEventListener("click", () => {
        const idx = Number(d.getAttribute("data-dot") || "0");
        setActive(idx);
      });
    });

    // Auto-rotate (pause on hover/focus)
    let timer = null;
    const start = () => {
      if (timer) return;
      timer = window.setInterval(next, 6000);
    };
    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };

    slides.addEventListener("mouseenter", stop);
    slides.addEventListener("mouseleave", start);
    slides.addEventListener("focusin", stop);
    slides.addEventListener("focusout", start);
    start();
  }
})();


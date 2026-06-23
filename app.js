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

  // Slider (supports multiple sliders on page)
  document.querySelectorAll(".slides").forEach((slidesEl) => {
    const total = slidesEl.querySelectorAll(".slide").length;
    if (total <= 1) return;

    const sliderRoot = slidesEl.closest(".hero-carousel, .hero-slider") || document;
    const dots = Array.from(sliderRoot.querySelectorAll("[data-dot]"));

    const setActive = (idx) => {
      const nextIdx = (idx + total) % total;
      slidesEl.setAttribute("data-active", String(nextIdx));
      dots.forEach((d) => d.setAttribute("aria-selected", d.getAttribute("data-dot") === String(nextIdx) ? "true" : "false"));
    };

    const getActive = () => Number(slidesEl.getAttribute("data-active") || "0");
    const next = () => setActive(getActive() + 1);
    const prev = () => setActive(getActive() - 1);

    sliderRoot.querySelectorAll("[data-slide]").forEach((btn) => {
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

    slidesEl.addEventListener("mouseenter", stop);
    slidesEl.addEventListener("mouseleave", start);
    slidesEl.addEventListener("focusin", stop);
    slidesEl.addEventListener("focusout", start);
    start();
  });

  // Scroll-spy: hangi bölümdeyim?
  const navLinks = Array.from(document.querySelectorAll('.nav-panel a[href*="#"]'))
    .filter((a) => {
      try {
        const url = new URL(a.getAttribute("href") || "", window.location.href);
        return url.pathname === window.location.pathname && !!url.hash;
      } catch {
        return false;
      }
    })
    .map((a) => {
      const url = new URL(a.getAttribute("href") || "", window.location.href);
      const id = url.hash.replace("#", "");
      const section = document.getElementById(id);
      return { a, section };
    })
    .filter((x) => x.section);

  if (navLinks.length) {
    const clearActive = () => {
      navLinks.forEach(({ a, section }) => {
        a.classList.remove("is-active");
        section.classList.remove("is-current");
      });
    };

    const setActive = (id) => {
      clearActive();
      navLinks.forEach(({ a, section }) => {
        if (section.id === id) {
          a.classList.add("is-active");
          section.classList.add("is-current");
        }
      });
    };

    let current = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (!visible.length) return;
        const top = visible[0].target;
        if (!(top instanceof HTMLElement)) return;
        if (current === top.id) return;
        current = top.id;
        setActive(current);
      },
      { root: null, threshold: [0.22, 0.35, 0.5, 0.7], rootMargin: "-18% 0px -62% 0px" },
    );

    navLinks.forEach(({ section }) => observer.observe(section));

    // İlk yüklemede hash varsa işaretle
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const section = document.getElementById(id);
      if (section) setActive(id);
    }
  }
})();

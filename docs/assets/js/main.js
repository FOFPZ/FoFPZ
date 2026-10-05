/* ============================================================
   FoFPZ — личный сайт
   Лёгкая интерактивность: печатающийся текст, появление
   секций, активное меню, мобильное меню, смена темы.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Печатающийся текст в секции «Герой» ----------
     ЗАМЕНИТЕ фразы ниже на свои. */
  const phrases = [
    "Этот сайт — моя визитка 👋",
    "Здесь будут мои проекты и идеи.",
    "Скоро тут появится много всего…",
  ];

  const typewriterEl = document.getElementById("typewriter");
  const caretEl = document.getElementById("caret");

  if (typewriterEl && caretEl) {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const phrase = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        typewriterEl.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) {
          deleting = true;
          setTimeout(tick, 2100); // пауза перед стиранием
          return;
        }
        setTimeout(tick, 55);
      } else {
        charIndex--;
        typewriterEl.textContent = phrase.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 450); // пауза перед новой фразой
          return;
        }
        setTimeout(tick, 28);
      }
    }

    tick();
  }

  /* ---------- Появление блоков при скролле ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Подсветка активного пункта меню ---------- */
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  const sections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((a) =>
              a.classList.toggle(
                "active",
                a.getAttribute("href") === "#" + entry.target.id
              )
            );
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------- Мобильное меню ---------- */
  const burger = document.getElementById("burger");
  const navList = document.getElementById("nav-links");

  if (burger && navList) {
    burger.addEventListener("click", () => {
      const open = navList.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navList.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navList.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Переключатель темы ---------- */
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
      themeToggle.setAttribute(
        "aria-label",
        theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"
      );
    }
  }

  const saved = localStorage.getItem("theme");
  applyTheme(saved || "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next =
        root.getAttribute("data-theme") === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      applyTheme(next);
    });
  }

  /* ---------- Подсветка карточек проектов за курсором ---------- */
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - rect.left + "px");
      card.style.setProperty("--my", e.clientY - rect.top + "px");
    });
  });

  /* ---------- Год в подвале ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

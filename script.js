document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");

const onScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* Split Text — hero title letter reveal */
document.querySelectorAll("[data-split]").forEach((el) => {
  const text = el.textContent;
  el.setAttribute("aria-label", text);
  el.textContent = "";

  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.style.setProperty("--i", String(i));
    span.textContent = ch === " " ? "\u00A0" : ch;
    el.appendChild(span);
  });
});

if (!reduceMotion) {
  /* Magnet — CTA gently follows cursor */
  document.querySelectorAll(".magnet").forEach((el) => {
    const strength = 0.28;
    const reset = () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };

    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.setProperty("--mx", `${x * strength}px`);
      el.style.setProperty("--my", `${y * strength}px`);
    });

    el.addEventListener("pointerleave", reset);
  });

  /* Glare Hover — sheen tracks pointer */
  document.querySelectorAll(".glare").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--gx", `${x}%`);
      el.style.setProperty("--gy", `${y}%`);
    });
  });

  /* Spotlight Card — warm light follows pointer */
  document.querySelectorAll(".spotlight").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--sx", `${x}%`);
      el.style.setProperty("--sy", `${y}%`);
    });
  });

  /* Particles — soft coffee-dust motes in hero (warm amber) */
  const canvas = document.querySelector(".hero__particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const hero = canvas.closest(".hero");
    let particles = [];
    let raf = 0;
    let running = true;

    const resize = () => {
      const { width, height } = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(28, Math.floor((width * height) / 28000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.8,
        vx: -0.12 + Math.random() * 0.24,
        vy: -0.35 - Math.random() * 0.45,
        a: 0.15 + Math.random() * 0.35,
        hue: 22 + Math.random() * 18,
      }));
    };

    const draw = () => {
      if (!running) return;
      const { width, height } = hero.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -8) {
          p.y = height + 6;
          p.x = Math.random() * width;
        }
        if (p.x < -8) p.x = width + 6;
        if (p.x > width + 8) p.x = -6;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 55%, 72%, ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize, { passive: true });

    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) draw();
      else cancelAnimationFrame(raf);
    });
  }
}
